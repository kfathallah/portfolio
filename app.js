/* =====================================================================
   منطق الموقع — يولّد المحتوى من ملف data.js و content_data.js
   ===================================================================== */

(function () {
  const P = window.PORTFOLIO;
  const C = window.CONTENT || { units: {}, fields: {}, opening: {} };
  if (!P) { console.error("data.js لم يُحمَّل"); return; }

  /* تطبيق ألوان السمة */
  const root = document.documentElement;
  Object.entries(P.theme || {}).forEach(([k, v]) => {
    const map = {
      primary: '--primary', primaryDeep: '--primary-deep',
      accent: '--accent', accentSoft: '--accent-soft',
      gold: '--gold', paper: '--paper', paperDark: '--paper-dark',
      text: '--text', muted: '--muted'
    };
    if (map[k]) root.style.setProperty(map[k], v);
  });

  /* ---------- شريط التنقّل والتذييل ---------- */

  function buildNavbar(active) {
    /* الروابط ثابتة في HTML، نضيف فقط active state إذا لم تكن مضبوطة */
    const links = document.querySelectorAll('.navbar-inner .nav-links a');
    const linkMap = {
      'home': 'index.html',
      'theorique': 'theorique.html',
      'terrain': 'terrain.html',
      'recherches': 'recherches.html',
      'projets': 'projets.html',
      'cv': 'cv.html',
      'dimension': 'theorique.html',
      'unit': 'theorique.html',
      'mjal': 'terrain.html'
    };
    const activeHref = linkMap[active];
    if (activeHref) {
      links.forEach(a => {
        if (a.getAttribute('href') === activeHref) a.classList.add('active');
      });
    }

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.navbar-inner .nav-links');
    if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  function buildFooter() {
    const f = document.querySelector('footer .container');
    if (!f) return;
    f.innerHTML = `
      <div>
        <h4>${P.meta.titre}</h4>
        <p style="font-size:.9rem;line-height:1.7;color:rgba(255,255,255,0.7)">
          ${P.meta.sousTitre} — ${P.meta.nomComplet}<br>
          ${P.meta.institution}<br>
          ${P.meta.tutelle} • ${P.meta.promotion}
        </p>
      </div>
      <div>
        <h4>تصفّح</h4>
        <ul>
          <li><a href="index.html">الاستقبال</a></li>
          <li><a href="theorique.html">التكوين النظري</a></li>
          <li><a href="terrain.html">التكوين الميداني</a></li>
          <li><a href="recherches.html">الأبحاث التربويّة</a></li>
          <li><a href="projets.html">المشاريع البيداغوجيّة</a></li>
          <li><a href="cv.html">السيرة الذاتيّة</a></li>
        </ul>
      </div>
      <div>
        <h4>عن البورتفوليو</h4>
        <p style="font-size:.85rem;line-height:1.7">
          ملفّ تربوي تأمّلي يرافق مسار التكوين الأساسي لمتفقّدي المدارس الابتدائيّة، يجمع بين توثيق التكوين النظري والميداني وفق منطق النحت التدريجي للهويّة المهنيّة.
        </p>
      </div>`;
    const fb = document.querySelector('.footer-bottom');
    if (fb) fb.innerHTML = `© ${new Date().getFullYear()} — ${P.meta.nomComplet} • ${P.meta.institution}`;
  }

  /* ---------- الصفحة الرئيسيّة ---------- */
  function buildHome() {
    /* بطاقات الأبعاد */
    const dimHost = document.querySelector('#dimensions-grid');
    if (dimHost) {
      dimHost.innerHTML = P.livreI.dimensions.map(d => `
        <a href="dimension.html?id=${d.id}" class="dim-card">
          <span class="dim-num">${d.numero}</span>
          <div class="dim-icon">${d.icon}</div>
          <h3>${d.titre}</h3>
          <p class="resume">${d.resume}</p>
          <div class="units-count">
            <span>${d.unites.length} وحدات تكوينيّة</span>
            <span class="arrow">←</span>
          </div>
        </a>
      `).join('');
    }

    /* بطاقات المجالات */
    const mjHost = document.querySelector('#mjalat-grid');
    if (mjHost) {
      mjHost.innerHTML = P.livreII.mjalat.map(m => `
        <a href="mjal.html?id=${m.id}" class="dim-card">
          <span class="dim-num">${m.numero}</span>
          <div class="dim-icon">${m.icon}</div>
          <h3>${m.titre}</h3>
          <p class="resume">${m.resume}</p>
          <div class="units-count">
            <span>اطّلع على الأنشطة</span>
            <span class="arrow">←</span>
          </div>
        </a>
      `).join('');
    }

    /* معرض الصور */
    buildGallery();
  }

  /* ---------- معرض الصور (mosaic) ---------- */
  function buildGallery() {
    const grid = document.querySelector('#gallery-grid');
    if (!grid) return;

    /* الصور المتاحة + placeholders إذا لم توجد صور */
    const gallery = (P.gallery || []).filter(g => g);

    /* إذا لا توجد صور حقيقيّة بعد، نضع 6 بطاقات placeholders */
    const items = gallery.length ? gallery : [
      { placeholder: true, label: 'ندوة أخلاقيّات المهنة', icon: '⚖️' },
      { placeholder: true, label: 'حلقة تربية دامجة', icon: '🤝' },
      { placeholder: true, label: 'زيارة ميدانيّة', icon: '🔍' },
      { placeholder: true, label: 'ورشة هندسة البرامج', icon: '📚' },
      { placeholder: true, label: 'يوم دراسي', icon: '🎓' },
      { placeholder: true, label: 'تكوين بالذكاء الاصطناعي', icon: '🤖' }
    ];

    const spans = ['span-1', 'span-2', 'span-3', 'span-4', 'span-5', 'span-6'];

    grid.innerHTML = items.map((it, i) => {
      const span = spans[i % spans.length];
      if (it.placeholder) {
        return `
          <div class="gallery-item placeholder ${span}" data-label="${it.label}">
            ${it.icon || '📷'}
          </div>`;
      }
      return `
        <div class="gallery-item ${span}" data-src="${it.src}" data-caption="${it.caption || ''}">
          <img src="${it.src}" alt="${it.caption || 'صورة'}" loading="lazy">
          <div class="overlay">
            <div class="caption">${it.caption || ''}</div>
          </div>
        </div>`;
    }).join('');

    /* Lightbox handlers */
    const lightbox = document.querySelector('#lightbox');
    const lbImg = document.querySelector('#lightbox-img');
    const closeBtn = document.querySelector('#lightbox-close');

    grid.querySelectorAll('.gallery-item:not(.placeholder)').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src;
        if (src && lbImg && lightbox) {
          lbImg.src = src;
          lightbox.classList.add('open');
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('open'));
    if (lightbox) lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  /* ---------- صفحة التكوين النظري ---------- */
  function buildTheorique() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الرئيسيّة</a> ← الباب الأول</div>
      <h1>${P.livreI.titre} — <span style="opacity:.7">${P.livreI.sousTitre}</span></h1>
      <p class="lead">${P.livreI.intro}</p>
    `;
    const host = document.querySelector('#dim-list');
    if (host) {
      host.innerHTML = P.livreI.dimensions.map(d => `
        <a href="dimension.html?id=${d.id}" class="dim-card">
          <span class="dim-num">${d.numero}</span>
          <div class="dim-icon">${d.icon}</div>
          <h3>${d.titre}</h3>
          <p class="resume">${d.resume}</p>
          <div class="units-count">
            <span>${d.unites.length} وحدات</span>
            <span class="arrow">←</span>
          </div>
        </a>
      `).join('');
    }
  }

  /* ---------- صفحة بُعد محدّد ---------- */
  function buildDimension() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const dim = P.livreI.dimensions.find(d => d.id === id);
    if (!dim) {
      document.querySelector('.page-header .container').innerHTML = `<h1>البعد غير موجود</h1>`;
      return;
    }
    document.title = dim.titre + ' — ' + P.meta.titre;
    const head = document.querySelector('.page-header .container');
    head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الرئيسيّة</a> ← <a href="theorique.html">التكوين النظري</a> ← ${dim.titre}</div>
      <h1><span style="opacity:.55;margin-left:.5rem">${dim.numero}</span> ${dim.icon} ${dim.titre}</h1>
      <p class="lead">${dim.resume}</p>
    `;
    const list = document.querySelector('#unit-list');
    list.innerHTML = dim.unites.map((u, i) => `
      <a href="unit.html?key=${u.contentKey}" class="unit-card unit-link">
        <div class="unit-num">${i + 1}</div>
        <div>
          <h4>الوحدة ${u.num}: ${u.titre}</h4>
          <p>${u.description}</p>
          <div class="unit-actions">
            <span class="tag" style="background:var(--accent-light);color:var(--accent);border:none">📖 افتح المحتوى الكامل ←</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  /* ---------- صفحة الوحدة (تعرض المحتوى الكامل) ---------- */
  function buildUnit() {
    const params = new URLSearchParams(location.search);
    const key = params.get('key');
    const fromMjal = params.get('from') === 'mjal';
    const mjalId = params.get('id');

    /* ابحث في الأبعاد أولاً */
    let unit = null, dim = null, mjal = null, section = null;
    for (const d of P.livreI.dimensions) {
      const u = d.unites.find(u => u.contentKey === key);
      if (u) { unit = u; dim = d; break; }
    }
    /* إن لم نجدها في الأبعاد، فابحث في المجالات الميدانيّة */
    if (!unit) {
      for (const m of P.livreII.mjalat) {
        const s = (m.sections || []).find(s => s.contentKey === key);
        if (s) { section = s; mjal = m; break; }
      }
    }

    if (!unit && !section) {
      document.querySelector('.page-header .container').innerHTML = `<h1>المحتوى غير موجود</h1>`;
      return;
    }

    const data = (C[key]) || { title: (unit || section).titre, html: '<p>المحتوى غير متوفّر بعد.</p>' };
    const title = (unit || section).titre;
    const desc = (unit || section).description;

    document.title = title + ' — ' + P.meta.titre;

    const head = document.querySelector('.page-header .container');
    let breadcrumb;
    if (unit) {
      breadcrumb = `
        <a href="index.html">الاستقبال</a> ←
        <a href="theorique.html">التكوين النظري</a> ←
        <a href="dimension.html?id=${dim.id}">${dim.titre}</a> ←
        ${unit.titre}`;
    } else {
      breadcrumb = `
        <a href="index.html">الاستقبال</a> ←
        <a href="terrain.html">التكوين الميداني</a> ←
        <a href="mjal.html?id=${mjal.id}">${mjal.titre}</a> ←
        ${section.titre}`;
    }

    head.innerHTML = `
      <div class="breadcrumb">${breadcrumb}</div>
      <h1>${title}</h1>
      <p class="lead">${desc}</p>
    `;

    const body = document.querySelector('#unit-body');
    body.innerHTML = data.html;

    /* تنقّل بين الوحدات (للوحدات النظريّة فقط) */
    const nav = document.querySelector('#unit-nav');
    if (nav && unit) {
      const allUnits = [];
      P.livreI.dimensions.forEach(d => d.unites.forEach(u => allUnits.push({...u, dimId: d.id, dimTitre: d.titre})));
      const idx = allUnits.findIndex(u => u.contentKey === key);
      const prev = idx > 0 ? allUnits[idx - 1] : null;
      const next = idx < allUnits.length - 1 ? allUnits[idx + 1] : null;
      nav.innerHTML = `
        ${prev ? `<a href="unit.html?key=${prev.contentKey}" class="nav-prev">
          <span class="dir">→ السابق</span>
          <span class="ttl">${prev.titre}</span>
        </a>` : '<span></span>'}
        ${next ? `<a href="unit.html?key=${next.contentKey}" class="nav-next">
          <span class="dir">التالي ←</span>
          <span class="ttl">${next.titre}</span>
        </a>` : '<span></span>'}
      `;
    } else if (nav && section) {
      /* تنقّل بين أقسام المجال */
      const sections = mjal.sections || [];
      const idx = sections.findIndex(s => s.contentKey === key);
      const prev = idx > 0 ? sections[idx - 1] : null;
      const next = idx < sections.length - 1 ? sections[idx + 1] : null;
      nav.innerHTML = `
        ${prev ? `<a href="unit.html?key=${prev.contentKey}&from=mjal&id=${mjal.id}" class="nav-prev">
          <span class="dir">→ السابق</span>
          <span class="ttl">${prev.titre}</span>
        </a>` : '<span></span>'}
        ${next ? `<a href="unit.html?key=${next.contentKey}&from=mjal&id=${mjal.id}" class="nav-next">
          <span class="dir">التالي ←</span>
          <span class="ttl">${next.titre}</span>
        </a>` : '<span></span>'}
      `;
    }
  }

  /* ---------- صفحة التكوين الميداني ---------- */
  function buildTerrain() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الرئيسيّة</a> ← الباب الثاني</div>
      <h1>${P.livreII.titre} — <span style="opacity:.7">${P.livreII.sousTitre}</span></h1>
      <p class="lead">${P.livreII.intro}</p>
    `;
    const host = document.querySelector('#mjal-list');
    if (host) {
      host.innerHTML = P.livreII.mjalat.map(m => `
        <a href="mjal.html?id=${m.id}" class="dim-card">
          <span class="dim-num">${m.numero}</span>
          <div class="dim-icon">${m.icon}</div>
          <h3>${m.titre}</h3>
          <p class="resume">${m.resume}</p>
          <div class="units-count">
            <span>اطّلع على المجال</span>
            <span class="arrow">←</span>
          </div>
        </a>
      `).join('');
    }

    /* مقدّمة الباب الثاني */
    const intro = document.querySelector('#bab2-intro');
    if (intro && C.opening && C.opening.bab2_intro_html) {
      intro.innerHTML = C.opening.bab2_intro_html;
    }
  }

  /* ---------- صفحة مجال ميداني ---------- */
  function buildMjal() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const mj = P.livreII.mjalat.find(m => m.id === id);
    if (!mj) {
      document.querySelector('.page-header .container').innerHTML = `<h1>المجال غير موجود</h1>`;
      return;
    }
    document.title = mj.titre + ' — ' + P.meta.titre;

    const head = document.querySelector('.page-header .container');
    head.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">الاستقبال</a> ←
        <a href="terrain.html">التكوين الميداني</a> ←
        ${mj.titre}
      </div>
      <h1><span style="opacity:.55;margin-left:.5rem">${mj.numero}</span> ${mj.icon} ${mj.titre}</h1>
      <p class="lead">${mj.resume}</p>
    `;

    /* عرض الأقسام كقائمة من البطاقات */
    const list = document.querySelector('#mjal-body');
    if (mj.sections && mj.sections.length) {
      list.innerHTML = `
        <div class="unit-list">
          ${mj.sections.map((s, i) => `
            <a href="unit.html?key=${s.contentKey}&from=mjal&id=${mj.id}" class="unit-card unit-link">
              <div class="unit-num">${i + 1}</div>
              <div>
                <h4>${s.titre}</h4>
                <p>${s.description}</p>
                <div class="unit-actions">
                  <span class="tag">📖 افتح المحتوى الكامل ←</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    } else {
      list.innerHTML = '<p>لا يوجد محتوى بعد.</p>';
    }
  }

  /* ---------- المراجع ---------- */
  function buildReferences() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الرئيسيّة</a> ← المراجع</div>
      <h1>المراجع والإطار القانوني</h1>
      <p class="lead">المنظومة القانونيّة المؤطّرة للتكوين، والمراجع العلميّة المعتمدة في بناء البورتفوليو.</p>
    `;
    const j = document.querySelector('#refs-juridiques');
    const s = document.querySelector('#refs-scientifiques');
    if (j) j.innerHTML = P.references.juridiques.map(r => `<li class="cv-lang">📜 ${r}</li>`).join('');
    if (s) s.innerHTML = P.references.scientifiques.map(r => `<li class="cv-lang">📖 ${r}</li>`).join('');
  }

  /* ---------- السيرة الذاتيّة ---------- */
  function buildCV() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الرئيسيّة</a> ← السيرة الذاتيّة</div>
      <h1>السيرة الذاتيّة</h1>
      <p class="lead">سيرة مهيكلة قابلة للتحرير المباشر من المتصفّح، مع حفظ محلّي ومعاينة للطباعة.</p>
    `;

    let cv = P.cv;
    try {
      const saved = localStorage.getItem('cv-data');
      if (saved) cv = { ...P.cv, ...JSON.parse(saved) };
    } catch (e) {}

    const initials = (cv.nom || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('');

    const wrap = document.querySelector('#cv-wrapper');
    wrap.innerHTML = `
      <div class="cv-header">
        <div class="cv-avatar">${initials}</div>
        <div class="cv-identity">
          <h1 data-field="nom">${cv.nom || ''}</h1>
          <div class="role" data-field="fonction">${cv.fonction || ''}</div>
          <div style="margin-top:.6rem;font-size:.85rem;color:rgba(255,255,255,0.75)">
            📧 <span data-field="contact.email">${cv.contact.email || '—'}</span> &nbsp;•&nbsp;
            📱 <span data-field="contact.tel">${cv.contact.tel || '—'}</span> &nbsp;•&nbsp;
            📍 <span data-field="contact.ville">${cv.contact.ville || '—'}</span>
          </div>
        </div>
        <div class="cv-actions">
          <button class="edit-toggle" id="edit-btn">✏️ تعديل</button>
          <button class="edit-toggle" id="print-btn">🖨 طباعة</button>
        </div>
      </div>
      <div class="cv-body">
        <div>
          <div class="cv-section">
            <h3>الملف الشخصي</h3>
            <p data-field="profil">${cv.profil || ''}</p>
          </div>
          <div class="cv-section">
            <h3>المسار الأكاديمي</h3>
            <div class="cv-timeline">
              ${(cv.parcoursAcademique || []).map((it, idx) => `
                <div class="cv-item" data-arr="parcoursAcademique" data-idx="${idx}">
                  <div class="when" data-field-arr="periode">${it.periode || '—'}</div>
                  <div class="what">
                    <h4 data-field-arr="titre">${it.titre || ''}</h4>
                    <div class="where" data-field-arr="lieu">${it.lieu || ''}</div>
                    <div class="desc" data-field-arr="details">${it.details || ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cv-section">
            <h3>الخبرات المهنيّة</h3>
            <div class="cv-timeline">
              ${(cv.experiences || []).map((it, idx) => `
                <div class="cv-item" data-arr="experiences" data-idx="${idx}">
                  <div class="when" data-field-arr="periode">${it.periode || '—'}</div>
                  <div class="what">
                    <h4 data-field-arr="poste">${it.poste || ''}</h4>
                    <div class="where" data-field-arr="etablissement">${it.etablissement || ''}</div>
                    <div class="desc" data-field-arr="description">${it.description || ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cv-section">
            <h3>تكوينات وندوات</h3>
            <div class="cv-timeline">
              ${(cv.formations || []).map((it, idx) => `
                <div class="cv-item" data-arr="formations" data-idx="${idx}">
                  <div class="when" data-field-arr="date">${it.date || '—'}</div>
                  <div class="what">
                    <h4 data-field-arr="titre">${it.titre || '(أضف عنوانًا)'}</h4>
                    <div class="where" data-field-arr="organisme">${it.organisme || ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div>
          <div class="cv-section">
            <h3>الكفايات الأساسيّة</h3>
            <div>
              ${(cv.competences || []).map((c, i) =>
                `<span class="skill-chip" data-arr-simple="competences" data-idx="${i}">${c}</span>`
              ).join('')}
            </div>
          </div>
          <div class="cv-section">
            <h3>اللغات</h3>
            <div>
              ${(cv.langues || []).map((l, i) => `
                <div class="cv-lang" data-arr="langues" data-idx="${i}">
                  <span data-field-arr="langue"><strong>${l.langue}</strong></span>
                  <span class="niveau" data-field-arr="niveau">${l.niveau}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cv-section">
            <h3>مراكز الاهتمام</h3>
            <div>
              ${(cv.centresInteret || []).map((c, i) =>
                `<span class="skill-chip" data-arr-simple="centresInteret" data-idx="${i}">${c}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const bar = document.createElement('div');
    bar.className = 'cv-save-bar';
    bar.id = 'save-bar';
    bar.innerHTML = `
      <span>تعديلات غير محفوظة</span>
      <button id="save-cv">💾 حفظ في المتصفّح</button>
      <button id="export-cv">⬇ تصدير JSON</button>
      <button id="cancel-cv">إلغاء</button>
    `;
    document.body.appendChild(bar);

    let editing = false;
    document.getElementById('edit-btn').addEventListener('click', () => {
      editing = !editing;
      wrap.querySelectorAll('[data-field], [data-field-arr]').forEach(el => el.contentEditable = editing);
      wrap.querySelectorAll('[data-arr-simple]').forEach(el => el.contentEditable = editing);
      document.getElementById('edit-btn').classList.toggle('active', editing);
      document.getElementById('edit-btn').textContent = editing ? '✅ إنهاء التعديل' : '✏️ تعديل';
      document.getElementById('save-bar').classList.toggle('visible', editing);
    });

    document.getElementById('save-cv').addEventListener('click', () => {
      const updated = JSON.parse(JSON.stringify(cv));
      wrap.querySelectorAll('[data-field]').forEach(el => {
        const path = el.dataset.field.split('.');
        let target = updated;
        for (let i = 0; i < path.length - 1; i++) target = target[path[i]] = target[path[i]] || {};
        target[path[path.length - 1]] = el.innerText.trim();
      });
      wrap.querySelectorAll('[data-arr]').forEach(item => {
        const arrName = item.dataset.arr;
        const idx = parseInt(item.dataset.idx);
        if (!updated[arrName]) updated[arrName] = [];
        if (!updated[arrName][idx]) updated[arrName][idx] = {};
        item.querySelectorAll('[data-field-arr]').forEach(f => {
          updated[arrName][idx][f.dataset.fieldArr] = f.innerText.trim();
        });
      });
      ['competences', 'centresInteret'].forEach(arrName => {
        const items = wrap.querySelectorAll(`[data-arr-simple="${arrName}"]`);
        updated[arrName] = Array.from(items).map(el => el.innerText.trim()).filter(Boolean);
      });
      localStorage.setItem('cv-data', JSON.stringify(updated));
      alert('تمّ الحفظ في متصفّحك. للنسخ الاحتياطي اضغط «تصدير JSON».');
      location.reload();
    });

    document.getElementById('export-cv').addEventListener('click', () => {
      const blob = new Blob([localStorage.getItem('cv-data') || JSON.stringify(cv, null, 2)],
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'cv-data.json'; a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('cancel-cv').addEventListener('click', () => location.reload());
    document.getElementById('print-btn').addEventListener('click', () => window.print());
  }

  /* ---------- الأبحاث التربويّة ---------- */
  function buildRecherches() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الاستقبال</a> ← الأبحاث التربويّة</div>
      <h1>الأبحاث التربويّة</h1>
      <p class="lead">البحوث الميدانيّة والدراسات التربويّة المُنجَزَة في إطار التكوين، مع إبراز الإشكاليّات والمنهجيّة والنتائج.</p>
    `;
    const host = document.querySelector('#recherches-list');
    const items = P.recherches || [];
    if (host) {
      if (items.length === 0) {
        host.innerHTML = `<p style="text-align:center;color:var(--muted);padding:3rem 0">لم تُضَفْ أبحاث بعد. حرّر <code>data.js</code> داخل مصفوفة <code>recherches</code> لإضافة بحث جديد.</p>`;
      } else {
        host.innerHTML = items.map(r => `
          <article class="research-card">
            <header class="research-head">
              <div class="research-tags">
                <span class="tag tag-type">${r.type || ''}</span>
                <span class="tag tag-status status-${(r.status || '').includes('قيد') ? 'pending' : 'done'}">${r.status || ''}</span>
                <span class="tag tag-date">${r.date || ''}</span>
              </div>
              <h2>${r.titre}</h2>
              <p class="research-resume">${r.resume || ''}</p>
            </header>
            ${r.problematique ? `
              <div class="research-section">
                <h4>الإشكاليّة</h4>
                <p>${r.problematique}</p>
              </div>` : ''}
            ${r.objectifs && r.objectifs.length ? `
              <div class="research-section">
                <h4>الأهداف</h4>
                <ul>${r.objectifs.map(o => `<li>${o}</li>`).join('')}</ul>
              </div>` : ''}
            ${r.methodologie ? `
              <div class="research-section">
                <h4>المنهجيّة</h4>
                <p>${r.methodologie}</p>
              </div>` : ''}
            ${r.resultats ? `
              <div class="research-section">
                <h4>النتائج</h4>
                <p>${r.resultats}</p>
              </div>` : ''}
            ${r.tags && r.tags.length ? `
              <footer class="research-footer">
                ${r.tags.map(t => `<span class="chip">#${t}</span>`).join('')}
              </footer>` : ''}
          </article>
        `).join('');
      }
    }
  }

  /* ---------- المشاريع البيداغوجيّة ---------- */
  function buildProjets() {
    const head = document.querySelector('.page-header .container');
    if (head) head.innerHTML = `
      <div class="breadcrumb"><a href="index.html">الاستقبال</a> ← المشاريع البيداغوجيّة</div>
      <h1>المشاريع البيداغوجيّة</h1>
      <p class="lead">المشاريع المُنجَزَة أو قيد الإنجاز في إطار هندسة التكوين والمرافقة البيداغوجيّة، مع تفاصيل المراحل والأهداف.</p>
    `;
    const host = document.querySelector('#projets-list');
    const items = P.projets || [];
    if (host) {
      if (items.length === 0) {
        host.innerHTML = `<p style="text-align:center;color:var(--muted);padding:3rem 0">لم تُضَفْ مشاريع بعد. حرّر <code>data.js</code> داخل مصفوفة <code>projets</code> لإضافة مشروع جديد.</p>`;
      } else {
        host.innerHTML = items.map(p => `
          <article class="research-card">
            <header class="research-head">
              <div class="research-tags">
                <span class="tag tag-type">${p.type || ''}</span>
                <span class="tag tag-status status-${(p.status || '').includes('قيد') ? 'pending' : 'done'}">${p.status || ''}</span>
                <span class="tag tag-date">${p.date || ''}</span>
                ${p.lieu ? `<span class="tag">📍 ${p.lieu}</span>` : ''}
              </div>
              <h2>${p.titre}</h2>
              <p class="research-resume">${p.resume || ''}</p>
            </header>
            ${p.objectifs && p.objectifs.length ? `
              <div class="research-section">
                <h4>الأهداف</h4>
                <ul>${p.objectifs.map(o => `<li>${o}</li>`).join('')}</ul>
              </div>` : ''}
            ${p.etapes && p.etapes.length ? `
              <div class="research-section">
                <h4>مراحل التنفيذ</h4>
                <div class="phase-grid">
                  ${p.etapes.map((e, i) => `
                    <div class="phase-card">
                      <span class="phase-num">${String(i + 1).padStart(2, '0')}</span>
                      <strong>${e.phase}</strong>
                      <p>${e.desc}</p>
                    </div>
                  `).join('')}
                </div>
              </div>` : ''}
            ${p.participants ? `<p class="research-meta">👥 المشاركون: ${p.participants}</p>` : ''}
            ${p.tags && p.tags.length ? `
              <footer class="research-footer">
                ${p.tags.map(t => `<span class="chip">#${t}</span>`).join('')}
              </footer>` : ''}
          </article>
        `).join('');
      }
    }
  }

  /* ---------- تشغيل ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    buildNavbar(page);
    buildFooter();
    switch (page) {
      case 'home': buildHome(); break;
      case 'theorique': buildTheorique(); break;
      case 'dimension': buildDimension(); break;
      case 'unit': buildUnit(); break;
      case 'terrain': buildTerrain(); break;
      case 'mjal': buildMjal(); break;
      case 'recherches': buildRecherches(); break;
      case 'projets': buildProjets(); break;
      case 'cv': buildCV(); break;
      case 'refs': buildReferences(); break;
    }

    setTimeout(() => {
      buildInlineToc();
      buildToTopButton();
    }, 200);
  });

  /* فهرس داخلي تلقائي للمقالات الطويلة */
  function buildInlineToc() {
    const body = document.querySelector('#unit-body, #mjal-body');
    if (!body) return;
    const h3s = body.querySelectorAll('h3');
    if (h3s.length < 4) return; /* لا فهرس للمقالات القصيرة */

    const items = [];
    h3s.forEach((h, i) => {
      const slug = 'sec-' + i;
      h.id = slug;
      items.push(`<li><a href="#${slug}">${h.textContent}</a></li>`);
    });

    const toc = document.createElement('div');
    toc.className = 'toc-inline';
    toc.innerHTML = `<h4>محتويات الوحدة</h4><ul>${items.join('')}</ul>`;

    /* أدرجه بعد العنوان الأوّل (h2) أو في البداية */
    const firstH2 = body.querySelector('h2');
    if (firstH2 && firstH2.nextSibling) {
      body.insertBefore(toc, firstH2.nextSibling);
    } else {
      body.insertBefore(toc, body.firstChild);
    }
  }

  /* زر العودة للأعلى */
  function buildToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.innerHTML = '↑';
    btn.title = 'إلى أعلى الصفحة';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
  }

})();
