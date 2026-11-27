(() => {
  const content = document.querySelector('#content');
  let state = DC.readState();
  let route = '';
  function setFilters(next, fromSearch = false) {
    state = { ...state, ...next };
    const nextHash = DC.stateHash(state);
    if (fromSearch) {
      history.replaceState(null, '', nextHash);
      DC.lastBrowse = nextHash;
      DC.updateResults(state);
    } else if (location.hash !== nextHash) {
      location.hash = nextHash;
    } else {
      renderRoute();
    }
  }
  function renderRoute() {
    const hash = location.hash || '#/';
    const previousRoute = route;
    route = hash.startsWith('#/deal/') ? 'detail' : hash === '#/compare' ? 'compare' : 'home';
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === route;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (route === 'compare') {
      document.title = 'AirPods comparison — DealCheck';
      content.innerHTML = DC.comparePage();
    } else if (route === 'detail') {
      const id = hash.slice('#/deal/'.length);
      const deal = DC.deals.find(deal => deal.id === id);
      document.title = `${deal ? deal.product : 'Deal not found'} — DealCheck`;
      content.innerHTML = deal ? DC.detailPage(deal) : '<section class="empty"><h1>That deal isn’t in this edit.</h1><a href="#/">Explore all 20 deals →</a></section>';
    } else {
      state = DC.readState();
      DC.lastBrowse = hash;
      document.title = 'DealCheck — Black Friday, with receipts.';
      const focusSearch = document.activeElement?.id === 'search';
      content.innerHTML = DC.home(state);
      DC.updateResults(state);
      if (focusSearch) document.querySelector('#search').focus();
    }
    if (previousRoute !== route) window.scrollTo(0, 0);
  }
  content.addEventListener('click', event => {
    const chip = event.target.closest('[data-filter]');
    if (chip) setFilters({ [chip.dataset.filter]: chip.dataset.value });
    if (event.target.closest('#clear, [data-reset]')) setFilters(DC.defaults());
  });
  content.addEventListener('input', event => {
    if (event.target.id === 'search') setFilters({ q: event.target.value }, true);
  });
  content.addEventListener('change', event => {
    if (event.target.id === 'sort') setFilters({ sort: event.target.value });
  });
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
