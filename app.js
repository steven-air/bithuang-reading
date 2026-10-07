// 页面交互：导航高亮、搜索、纪律自检、语料筛选、风险计算与主题切换。
document.addEventListener('DOMContentLoaded', () => {
  const iconRefresh = () => {
    if (window.lucide) window.lucide.createIcons();
  };
  iconRefresh();

  const toast = document.querySelector('#toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  // 侧栏导航随阅读位置更新，移动端仍保留锚点跳转。
  const sections = [...document.querySelectorAll('[data-section]')];
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.dataset.nav === visible.target.dataset.section));
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .25, .6] });
  sections.forEach((section) => observer.observe(section));

  // 键盘 / 快捷键聚焦搜索。
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
      event.preventDefault();
      document.querySelector('#site-search').focus();
    }
  });

  // 全文搜索：只隐藏可搜索卡片，保留章节导航与阅读骨架。
  const searchInput = document.querySelector('#site-search');
  const searchable = [...document.querySelectorAll('[data-searchable]')];
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    searchable.forEach((node) => node.classList.toggle('is-hidden', keyword && !node.dataset.searchable.toLowerCase().includes(keyword)));
    document.querySelectorAll('.quote-card').forEach((card) => card.classList.toggle('is-hidden', keyword && !card.dataset.searchable.toLowerCase().includes(keyword)));
    updateQuoteCount();
  });

  // 纪律卡片以本地存储保留，方便下一次打开继续自检。
  const ruleCards = [...document.querySelectorAll('.discipline-card')];
  const savedRules = JSON.parse(localStorage.getItem('bithuang-rules') || '{}');
  const updateProgress = () => {
    const completed = ruleCards.filter((card) => card.classList.contains('checked')).length;
    const percent = Math.round(completed / ruleCards.length * 100);
    document.querySelector('#progress-label').textContent = `${percent}%`;
    document.querySelector('#progress-bar').style.width = `${percent}%`;
  };
  ruleCards.forEach((card) => {
    if (savedRules[card.dataset.ruleId]) card.classList.add('checked');
    card.addEventListener('click', () => {
      card.classList.toggle('checked');
      savedRules[card.dataset.ruleId] = card.classList.contains('checked');
      localStorage.setItem('bithuang-rules', JSON.stringify(savedRules));
      updateProgress();
    });
  });
  updateProgress();

  // 纪律分类筛选。
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      ruleCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
    });
  });

  // 资料中的 5% 参考线计算器。
  const capitalInput = document.querySelector('#capital-input');
  const lossInput = document.querySelector('#loss-input');
  const updateRisk = () => {
    const capital = Math.max(Number(capitalInput.value) || 0, 0);
    const loss = Math.max(Number(lossInput.value) || 0, 0);
    const ratio = capital ? loss / capital * 100 : 0;
    const display = document.querySelector('#risk-percent');
    const status = document.querySelector('#risk-status');
    const result = document.querySelector('.calc-result');
    const fill = document.querySelector('#calc-bar-fill');
    display.textContent = `${ratio.toFixed(2)}%`;
    const over = ratio > 5;
    status.textContent = over ? '超过参考线' : '在参考线内';
    result.classList.toggle('over', over);
    fill.style.width = `${Math.min(ratio / 10 * 100, 100)}%`;
    fill.style.background = over ? 'var(--danger)' : 'var(--green)';
  };
  [capitalInput, lossInput].forEach((input) => input.addEventListener('input', updateRisk));
  updateRisk();

  // 语料分类与复制。
  const quoteCards = [...document.querySelectorAll('.quote-card')];
  const updateQuoteCount = () => {
    const visible = quoteCards.filter((card) => !card.classList.contains('is-hidden')).length;
    document.querySelector('#quote-count').textContent = `显示 ${visible} 条`;
    document.querySelector('#quote-empty').hidden = visible > 0;
  };
  document.querySelectorAll('[data-quote-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-quote-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.quoteFilter;
      quoteCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.quoteCategory !== filter));
      updateQuoteCount();
    });
  });
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast('语料已复制');
      } catch {
        showToast('当前浏览器未允许复制');
      }
    });
  });
  updateQuoteCount();

  // 主题偏好只保存在当前浏览器，不影响页面内容。
  const themeToggle = document.querySelector('#theme-toggle');
  if (localStorage.getItem('bithuang-theme') === 'dark') document.body.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('bithuang-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    showToast(document.body.classList.contains('dark') ? '已切换深色模式' : '已切换浅色模式');
  });
});
