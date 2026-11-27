DC.defaults = () => ({ q: '', category: 'All', store: 'All', discount: 'All', verdict: 'All', sort: 'best' });
DC.categories = ['All', 'Laptops', 'TVs', 'Audio', 'Gaming', 'Home', 'Streaming', 'Reading', 'PC'];
DC.stores = ['All', 'Amazon', 'Best Buy', 'Dell', 'Target', 'Walmart'];
DC.discounts = ['All', '50%+', '30-49%', '20-29%', 'Under 20%'];
DC.verdicts = ['All', 'True low', 'Strong', 'Good', 'Routine'];
DC.sorts = { best: 'Best first', percent: 'Biggest % off', saving: 'Biggest $ saving', price: 'Price low to high' };
DC.readState = () => {
  const hash = location.hash || '#/';
  const state = DC.defaults();
  if (hash === '#/audio50') return { ...state, category: 'Audio', discount: '50%+' };
  const query = new URLSearchParams(hash.split('?')[1] || '');
  for (const key of Object.keys(state)) if (query.has(key)) state[key] = query.get(key);
  for (const [key, options] of Object.entries({ category: DC.categories, store: DC.stores, discount: DC.discounts, verdict: DC.verdicts })) {
    if (!options.includes(state[key])) state[key] = 'All';
  }
  if (!DC.sorts[state.sort]) state.sort = 'best';
  return state;
};
DC.stateHash = state => {
  if (state.q === '' && state.category === 'Audio' && state.store === 'All' && state.discount === '50%+' && state.verdict === 'All' && state.sort === 'best') return '#/audio50';
  const params = new URLSearchParams();
  const defaults = DC.defaults();
  for (const key of Object.keys(defaults)) if (state[key] !== defaults[key]) params.set(key, state[key]);
  return '#/' + (params.size ? '?' + params.toString() : '');
};
DC.filterDeals = state => {
  const ranks = { 'True low': 0, Strong: 1, Good: 2, Routine: 3 };
  return DC.deals.filter(deal => {
    const percent = DC.percent(deal);
    const bands = { All: true, '50%+': percent >= 50, '30-49%': percent >= 30 && percent < 50, '20-29%': percent >= 20 && percent < 30, 'Under 20%': percent < 20 };
    return (deal.product + ' ' + deal.store + ' ' + deal.category).toLowerCase().includes(state.q.trim().toLowerCase()) &&
      (state.category === 'All' || deal.category === state.category) && (state.store === 'All' || deal.store === state.store) &&
      (state.verdict === 'All' || deal.verdict === state.verdict) && bands[state.discount];
  }).sort((a, b) => {
    if (state.sort === 'price') return a.sale - b.sale;
    if (state.sort === 'saving') return DC.saving(b) - DC.saving(a);
    if (state.sort === 'percent') return DC.discount(b) - DC.discount(a);
    return ranks[a.verdict] - ranks[b.verdict] || DC.discount(b) - DC.discount(a) || DC.saving(b) - DC.saving(a);
  });
};
