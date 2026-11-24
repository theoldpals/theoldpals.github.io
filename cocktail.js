(function(){
  // ---------------------------------------------------------------
  // Cocktail page. Everything comes from cocktail.json. To change the
  // menu, edit the JSON and upload photos into cocktail_images/
  // (plus a small copy, about 560px, into cocktail_images/thumb/).
  // No code changes needed.
  //
  //   name         English name (big on the card)
  //   section      id from "sections" — classic, spirits, mocktail
  //   order        1 = first in its section, then 2, 3 ...
  //   price        number, or text like "฿160–250"
  //   unit         "Glass", "Shot" ... shown next to the price
  //   image        clean photo (drink only, no text) shown in the grid,
  //                file name inside imageFolder (and thumbFolder)
  //   poster       info poster shown in the pop-up when tapped, file name
  //                inside posterFolder (optional; falls back to image)
  //   new          true puts a gold star on the card
  //   hidden       true hides the drink without deleting it
  //   was          old price, shown crossed out before the price (promotions)
  //   description  paragraph on the tap card (optional)
  //   ingredients  [{"en": "Gin", "ml": 45}, ...] (optional;
  //                ml can be null when there is no measure)
  //   options      [{"en": "Whiskey", "abv": "40%"}] (shots)
  //   taste        "Citrusy • Bright • Balanced" (optional)
  //   glass, garnish, tagline   (optional)
  //   non_alcoholic  true shows a "0% ALC" badge
  //   pos_name     the name in Silom POS, for reference only (not shown)
  // ---------------------------------------------------------------
  var bust = '?v=' + Math.floor(Date.now() / 60000);
  var file = document.body.getAttribute('data-menu');
  var bar = document.getElementById('bar');
  var card = document.getElementById('card');
  var $ = function(id){ return document.getElementById(id); };

  function priceText(price, currency){
    if (price === undefined || price === null || price === '') return '';
    if (typeof price === 'number') return currency + price.toLocaleString('en-US');
    return String(price);
  }
  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function render(data){
    var folder = data.imageFolder || '';
    var thumbs = data.thumbFolder || folder;
    var posters = data.posterFolder || folder;
    var currency = data.currency === undefined ? '฿' : data.currency;
    if (data.title) document.title = 'The Old Pals — ' + data.title;
    var items = (data.items || []).filter(function(it){ return it && !it.hidden; });
    if (!items.length){ bar.innerHTML = '<div class="state">No cocktails yet.</div>'; return; }

    var sections = (data.sections || []).slice();
    var known = {};
    sections.forEach(function(s){ known[s.id] = true; });
    items.forEach(function(it){
      if (it.section && !known[it.section]){ known[it.section] = true; sections.push({ id: it.section, name: it.section }); }
    });
    if (items.some(function(it){ return !it.section; })) sections.push({ id: undefined, name: '' });

    bar.innerHTML = '';
    sections.forEach(function(s){
      var list = items.filter(function(it){ return it.section === s.id; })
        .sort(function(a, b){ return (a.order || 999) - (b.order || 999); });
      if (!list.length) return;
      if (s.name){
        var h = el('h2', 'group', s.name);
        bar.appendChild(h);
      }
      var grid = el('div', 'grid');
      list.forEach(function(it){
        var price = priceText(it.price, currency);
        var full = it.poster ? posters + it.poster + bust : folder + it.image + bust;
        var btn = el('button', 'drink-btn');
        btn.type = 'button';
        btn.setAttribute('aria-label', it.name + (price ? ', ' + price : '') + (it.new ? ', new' : ''));
        var img = el('img');
        img.src = thumbs + it.image + bust;
        img.alt = it.name;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = function(){ img.onerror = null; img.src = full; };
        btn.appendChild(img);
        if (it.new){
          var star = el('span', 'star');
          star.setAttribute('aria-hidden', 'true');
          star.innerHTML = '&#9733;<small>NEW</small>';
          btn.appendChild(star);
        }
        if (it.non_alcoholic) btn.appendChild(el('span', 'zero', '0% ALC'));
        var info = el('span', 'info');
        info.appendChild(el('span', 'nm', it.name));
        var pr = el('span', 'pr', price);
        if (it.was){ var w = el('s', 'was', priceText(it.was, currency)); pr.insertBefore(w, pr.firstChild); pr.insertBefore(document.createTextNode(' '), w.nextSibling); }
        info.appendChild(pr);
        btn.appendChild(info);
        btn.addEventListener('click', function(){ openCard(it, full, price); });
        grid.appendChild(btn);
      });
      bar.appendChild(grid);
    });
  }

  function openCard(it, src, price){
    var img = $('cardImg');
    img.src = src;
    img.alt = it.name;
    img.classList.remove('full');
    $('cardName').textContent = it.name;
    $('cardNew').style.display = it.new ? 'inline-block' : 'none';
    $('cardDetail').textContent = it.description || it.tagline || '';
    $('cardDetail').style.display = (it.description || it.tagline) ? '' : 'none';

    var r = $('cardRecipe');
    r.innerHTML = '';
    r.className = 'recipe';
    if (it.ingredients && it.ingredients.length){
      r.appendChild(el('h3', '', 'Ingredients'));
      var ul = el('ul');
      it.ingredients.forEach(function(g){
        var li = el('li');
        var a = el('span', '', g.en);
        li.appendChild(a);
        li.appendChild(el('span', '', g.ml ? g.ml + ' ml' : ''));
        ul.appendChild(li);
      });
      r.appendChild(ul);
    }
    if (it.options && it.options.length){
      r.appendChild(el('h3', '', 'Choose your spirit'));
      var ul2 = el('ul');
      it.options.forEach(function(o){
        var li = el('li');
        var a = el('span', '', o.en);
        li.appendChild(a);
        li.appendChild(el('span', '', o.abv ? o.abv + ' ABV' : ''));
        ul2.appendChild(li);
      });
      r.appendChild(ul2);
    }
    if (it.taste){
      r.appendChild(el('h3', '', 'Taste'));
      var chips = el('div', 'chips');
      it.taste.split('•').forEach(function(t){ t = t.trim(); if (t) chips.appendChild(el('span', '', t)); });
      r.appendChild(chips);
    }
    if (it.glass || it.garnish){
      var two = el('div', 'row2');
      two.style.marginTop = '14px';
      if (it.glass){ var g1 = el('div'); g1.appendChild(el('b', '', 'Glass')); g1.appendChild(document.createTextNode(it.glass)); two.appendChild(g1); }
      if (it.garnish){ var g2 = el('div'); g2.appendChild(el('b', '', 'Garnish')); g2.appendChild(document.createTextNode(it.garnish)); two.appendChild(g2); }
      r.appendChild(two);
    }
    $('cardPrice').textContent = price + (price && it.unit ? ' / ' + String(it.unit).toLowerCase() : '');
    if (it.was){ var ws = el('s', 'was', priceText(it.was, (document.body.getAttribute('data-currency') || '฿'))); $('cardPrice').insertBefore(document.createTextNode(' '), $('cardPrice').firstChild); $('cardPrice').insertBefore(ws, $('cardPrice').firstChild); }
    card.classList.add('open');
    card.querySelector('.sheet').scrollTop = 0;
    document.body.style.overflow = 'hidden';
    $('closeBtn').focus();
  }
  // tap the photo to open it on its own, so the poster text can be pinch-zoomed
  $('cardImg').addEventListener('click', function(){ window.open(this.src, '_blank'); });
  function closeCard(){ card.classList.remove('open'); document.body.style.overflow = ''; }
  $('closeBtn').addEventListener('click', closeCard);
  card.addEventListener('click', function(e){ if (e.target === card) closeCard(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeCard(); });

  fetch(file + bust)
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function(){
      bar.innerHTML = '<div class="state">Could not read <code>' + file + '</code>.<br><br>' +
        'Check that the file exists and is valid JSON<br>(a missing comma is the usual cause).</div>';
    });
})();
