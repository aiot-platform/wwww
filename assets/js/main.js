/* =============================================================
   物联智造 官网 · 共享脚本
   负责：导航/页脚/固定转化条注入、移动端菜单、滚动动效、
        数字滚动、表单校验、FAQ 折叠
   ============================================================= */
(function () {
  'use strict';

  /* ---------------- 站点配置（改品牌/导航/页脚只改这里） ---------------- */
  var SITE = {
    brand: '物联智造',
    brandEn: 'IOTMAKER',
    slogan: '物联网全套方案，从 PCB 到上云，再到 AI 质检',
    nav: [
      { label: '首页', href: '/' },
      {
        label: '行业方案', href: null,
        children: [
          { label: '宠物方案', href: '/solutions/pet/' },
          { label: '养殖业（牛 / 马）', href: '/solutions/livestock/' },
          { label: '工业 / 商业数采', href: '/solutions/industrial/' }
        ]
      },
      { label: '视觉 AI 质检', href: '/ai-inspection/' },
      { label: 'PCB 研发制造', href: '/hardware/' },
      { label: '资源中心', href: '/resources/' },
      { label: '关于我们', href: '/about/' }
    ],
    cta: { label: '预约方案演示', href: '/contact/' },
    secondaryCta: { label: '提交项目需求', href: '/contact/#form' },

    footer: [
      {
        title: '能力',
        links: [
          { label: 'PCB 研发制造', href: '/hardware/' },
          { label: '视觉 AI 质检', href: '/ai-inspection/' },
          { label: '交付流程', href: '/about/#process' }
        ]
      },
      {
        title: '行业方案',
        links: [
          { label: '宠物方案', href: '/solutions/pet/' },
          { label: '养殖业（牛 / 马）', href: '/solutions/livestock/' },
          { label: '工业 / 商业数采', href: '/solutions/industrial/' }
        ]
      },
      {
        title: '支持',
        links: [
          { label: '资源中心', href: '/resources/' },
          { label: '关于我们', href: '/about/' },
          { label: '联系咨询', href: '/contact/' }
        ]
      }
    ],

    contact: {
      phone: '400-000-0000',
      email: 'hello@iotmaker.example.com',
      address: '上海市浦东新区 · 物联智造产业园'
    }
  };

  /* ---------------- 工具 ---------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // 归一化路径：去掉结尾的 index.html 与多余斜杠，便于高亮当前菜单
  function normalize(path) {
    if (!path) return '/';
    var p = path.split('?')[0].split('#')[0];
    p = p.replace(/\/index\.html$/, '/');
    if (p.length > 1 && p.charAt(p.length - 1) !== '/') p += '/';
    return p;
  }

  /* ---------------- 顶部导航 ---------------- */
  function buildHeader(mount) {
    var current = normalize(window.location.pathname);
    var header = el('header', 'site-header');
    var container = el('div', 'container');

    var logo = el('a', 'logo');
    logo.href = '/';
    logo.innerHTML =
      '<span class="logo__mark">智</span>' +
      '<span>' + SITE.brand + '<span class="logo__sub">' + SITE.brandEn + '</span></span>';
    container.appendChild(logo);

    var nav = el('nav', 'nav');
    var list = el('ul', 'nav__list');

    SITE.nav.forEach(function (item) {
      var li = el('li', 'nav__item');
      var isActive = (item.href && normalize(item.href) === current) ||
        (item.children && item.children.some(function (c) { return normalize(c.href) === current; }));

      // 无 href 的菜单项（如「行业方案」）只负责展开下拉，不作为链接跳转
      var a = el(item.href ? 'a' : 'span', 'nav__link' + (isActive ? ' is-active' : ''));
      if (item.href) a.href = item.href;
      a.innerHTML = item.label + (item.children ? '<span class="nav__caret"></span>' : '');
      li.appendChild(a);

      if (item.children) {
        var dd = el('div', 'nav__dropdown');
        item.children.forEach(function (c) {
          var ca = el('a', null, c.label);
          ca.href = c.href;
          if (normalize(c.href) === current) ca.style.color = 'var(--cyan)';
          dd.appendChild(ca);
        });
        li.appendChild(dd);
      }
      list.appendChild(li);
    });

    nav.appendChild(list);
    nav.id = 'site-nav';
    container.appendChild(nav);

    var cta = el('a', 'btn btn--primary btn--sm header__cta', SITE.cta.label + '<span class="arrow">→</span>');
    cta.href = SITE.cta.href;
    container.appendChild(cta);

    var toggle = el('button', 'nav__toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '展开导航菜单');
    toggle.setAttribute('aria-controls', 'site-nav');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    container.appendChild(toggle);
    header.appendChild(container);
    mount.replaceWith(header);

    // 滚动阴影
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 页脚 ---------------- */
  function buildFooter(mount) {
    var footer = el('footer', 'site-footer');
    var container = el('div', 'container');
    var grid = el('div', 'footer__grid');

    var brandCol = el('div', 'footer__brand');
    brandCol.innerHTML =
      '<a class="logo" href="/"><span class="logo__mark">智</span>' +
      '<span>' + SITE.brand + '<span class="logo__sub">' + SITE.brandEn + '</span></span></a>' +
      '<p>' + SITE.slogan + '。一套团队覆盖硬件、云、App 与 AI 质检，按行业交付，不从零试错。</p>' +
      '<div class="footer__contact">' +
      '<div><span>电话</span><br>' + SITE.contact.phone + '</div>' +
      '<div><span>邮箱</span><br>' + SITE.contact.email + '</div>' +
      '<div><span>地址</span><br>' + SITE.contact.address + '</div>' +
      '</div>';
    grid.appendChild(brandCol);

    SITE.footer.forEach(function (col) {
      var c = el('div', 'footer__col');
      var h = el('h4', null, col.title);
      c.appendChild(h);
      var ul = el('ul');
      col.links.forEach(function (l) {
        var li = el('li');
        var a = el('a', null, l.label);
        a.href = l.href;
        li.appendChild(a);
        ul.appendChild(li);
      });
      c.appendChild(ul);
      grid.appendChild(c);
    });

    container.appendChild(grid);

    var bottom = el('div', 'footer__bottom');
    var year = new Date().getFullYear();
    bottom.innerHTML =
      '<div>© ' + year + ' ' + SITE.brand + ' · 保留所有权利</div>' +
      '<div><a href="/contact/">预约方案演示</a> · <a href="/resources/">资源下载</a> · <a href="#">隐私政策</a></div>';
    container.appendChild(bottom);

    footer.appendChild(container);
    mount.replaceWith(footer);
  }

  /* ---------------- 固定转化条 ---------------- */
  function buildStickyCta() {
    var bar = el('div', 'sticky-cta');
    bar.innerHTML =
      '<div class="sticky-cta__inner">' +
      '<div class="sticky-cta__text">准备好把项目落地了？<b>先从一次方案沟通开始</b></div>' +
      '<div class="sticky-cta__actions">' +
      '<a class="btn btn--primary btn--sm" href="' + SITE.cta.href + '">' + SITE.cta.label + '<span class="arrow">→</span></a>' +
      '<a class="btn btn--ghost btn--sm" href="' + SITE.secondaryCta.href + '">' + SITE.secondaryCta.label + '</a>' +
      '</div></div>';
    document.body.appendChild(bar);

    var onScroll = function () {
      bar.classList.toggle('is-show', window.scrollY > 620);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 数字滚动 ---------------- */
  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    var run = function (node) {
      var target = parseFloat(node.getAttribute('data-count'));
      var decimals = (node.getAttribute('data-decimals') | 0);
      var duration = 1100;
      var start = null;

      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        node.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: .4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------------- 滚动显现 ---------------- */
  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------------- 案例筛选 ---------------- */
  function initFilters() {
    var filters = document.querySelectorAll('[data-filter]');
    if (!filters.length) return;
    var items = document.querySelectorAll('[data-category]');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var key = btn.getAttribute('data-filter');
        items.forEach(function (item) {
          var show = key === 'all' || item.getAttribute('data-category') === key;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- FAQ 折叠 ---------------- */
  function initAccordion() {
    document.querySelectorAll('.accordion__head').forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.closest('.accordion__item');
        var body = item.querySelector('.accordion__body');
        var open = item.classList.toggle('is-open');
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* ---------------- 表单校验 ---------------- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      // 关闭浏览器原生校验，改由下方逻辑渲染统一的内联错误提示
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        form.querySelectorAll('[required]').forEach(function (input) {
          var field = input.closest('.field');
          var value = (input.value || '').trim();
          var ok = value.length > 0;

          if (ok && input.type === 'tel') ok = /^[0-9+\-\s()]{6,20}$/.test(value);
          if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

          if (field) field.classList.toggle('is-error', !ok);
          if (!ok) valid = false;
        });

        if (!valid) {
          var firstError = form.querySelector('.field.is-error');
          if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        var success = form.querySelector('.form__success');
        var submit = form.querySelector('[type="submit"]');
        if (submit) { submit.disabled = true; submit.textContent = '提交中…'; }

        // 演示环境：仅前端反馈，接入后端时替换为真实请求
        setTimeout(function () {
          if (success) success.classList.add('is-show');
          form.reset();
          if (submit) { submit.disabled = false; submit.textContent = submit.getAttribute('data-label') || '提交'; }
        }, 480);
      });

      // 输入即清除错误态
      form.querySelectorAll('.input, .textarea, .select').forEach(function (input) {
        input.addEventListener('input', function () {
          var field = input.closest('.field');
          if (field) field.classList.remove('is-error');
        });
      });
    });

    // 若带 #form 锚点进入，聚焦首个输入
    if (window.location.hash === '#form') {
      var first = document.querySelector('#form .input, #form .textarea');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 300);
    }
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    var headerMount = document.querySelector('[data-site-header]');
    if (headerMount) buildHeader(headerMount);

    var footerMount = document.querySelector('[data-site-footer]');
    if (footerMount) buildFooter(footerMount);

    buildStickyCta();
    initReveal();
    initCounters();
    initFilters();
    initAccordion();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
