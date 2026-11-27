(function(){
  // Shows the Promotions tab only while promotion.json has something to show.
  // To end a promotion, set "hidden": true on its section (or items) in
  // promotion.json; the tab disappears from every page by itself.
  var link = document.querySelector('nav a[href="promotion.html"]');
  if (!link || link.getAttribute('aria-current') === 'page') return;
  fetch('promotion.json?v=' + Math.floor(Date.now() / 60000))
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(d){
      var off = {};
      (d.sections || []).forEach(function(s){ if (s && s.hidden) off[s.id] = true; });
      var live = (d.items || []).some(function(it){ return it && !it.hidden && !off[it.section]; });
      if (live) link.hidden = false;
    })
    .catch(function(){});
})();
