window.DC = window.DC || {};
DC.money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
DC.saving = deal => Math.round((deal.usual - deal.sale) * 100) / 100;
DC.discount = deal => (deal.usual - deal.sale) / deal.usual * 100;
DC.percent = deal => Math.round(DC.discount(deal));
DC.escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
DC.verdictClass = verdict => verdict.toLowerCase().replace(/ /g, '-');
DC.icon = category => {
  const paths = {
    Audio: '<path d="M5 14v-3a7 7 0 0 1 14 0v3M5 12H3v7h4v-7Zm14 0h2v7h-4v-7Z"/>',
    TVs: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8m-4-4v4"/>',
    Laptops: '<rect x="5" y="3" width="14" height="13" rx="1"/><path d="m5 16-3 5h20l-3-5"/>',
    Gaming: '<path d="M7 7h10c3 0 6 11 3 13-2 1-4-4-5-4H9c-1 0-3 5-5 4C1 18 4 7 7 7Z"/><path d="M6 11h5m-2.5-2.5v5M16 11h.01m2 3h.01"/>',
    Home: '<path d="m3 10 9-7 9 7v11H3Zm6 11v-8h6v8"/>',
    Streaming: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/>',
    Reading: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
    PC: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 22h8m-4-5v5"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[category] || paths.PC}</svg>`;
};
