(function(){
  // ---------------------------------------------------------------
  // Shelf page. Everything comes from the JSON file named in
  // <body data-menu="beer.json">. To change the shelf, edit the JSON
  // and upload bottle PNGs (transparent background) into the image
  // folder it names. No code changes needed.
  //
  //   name    shown on the card and the shelf tag
  //   detail  shown when the customer taps the bottle
  //   price   number (or text like "190 / 650")
  //   new     true puts a gold star above the bottle
  //   shelf   1 = top shelf, 2 = next one down ...
  //   order   1 = leftmost on that shelf, then 2, 3 ...
  //           To show a bottle on several shelves, use lists that pair up:
  //           "shelf": [1, 3], "order": [2, 5] = 2nd on shelf 1, 5th on shelf 3
  //   image   file name inside imageFolder (image_name also works)
  //   unit    "Bottle", "Can" ... shown next to the price (optional)
  //   scale   bottle height, 1 = tallest. 0.72 suits a can (optional)
  //   hidden  true hides the item without deleting it (optional)
  //
  // "shelfNames": {"1": "Thai & Lao", ...} puts a small sign on a shelf.
  // ---------------------------------------------------------------
  var bust = '?v=' + Math.floor(Date.now() / 60000); // refresh at most once a minute
  var file = document.body.getAttribute('data-menu');

  var cabinet = document.getElementById('cabinet');
  var card = document.getElementById('card');
  var cardImg = document.getElementById('cardImg');
  var cardName = document.getElementById('cardName');
  var cardNew = document.getElementById('cardNew');
  var cardDetail = document.getElementById('cardDetail');
  var cardPrice = document.getElementById('cardPrice');

  function num(v, fallback){
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  function priceText(price, currency){
    if (price === undefined || price === null || price === '') return '';
    if (typeof price === 'number') return currency + price.toLocaleString('en-US');
    return String(price);
  }

  function showError(html){
    cabinet.innerHTML = '<div class="state">' + html + '</div>';
  }

  function render(data){
    var folder = data.imageFolder || '';
    var shelfNames = data.shelfNames || {};
    var currency = data.currency === undefined ? '฿' : data.currency;
    if (data.title) document.title = 'The Old Pals — ' + data.title;

    var items = (data.items || []).filter(function(it){ return it && !it.hidden; });
    if (!items.length){
      showError('Nothing on the shelf yet.<br><br>Add bottles to <code>' + file + '</code>.');
      return;
    }

    // Group by shelf number, then sort each shelf left to right by order.
    // An item listed on several shelves gets one spot on each.
    var shelves = {};
    items.forEach(function(it, i){
      var list = [].concat(it.shelf === undefined ? 1 : it.shelf);
      var orders = [].concat(it.order === undefined ? [] : it.order);
      list.forEach(function(sh, k){
        var s = num(sh, 1);
        var spot = { it: it, i: i, order: num(orders[k], 999) };
        (shelves[s] = shelves[s] || []).push(spot);
      });
    });
    var numbers = Object.keys(shelves).map(Number).sort(function(a, b){ return a - b; });

    cabinet.innerHTML = '';
    numbers.forEach(function(s){
      var list = shelves[s].sort(function(a, b){
        return a.order - b.order || a.i - b.i;
      }).map(function(spot){ return spot.it; });
      var shelf = document.createElement('section');
      shelf.className = 'shelf';
      shelf.setAttribute('aria-label', shelfNames[s] || 'Shelf ' + s);
      if (shelfNames[s]){
        var sign = document.createElement('div');
        sign.className = 'sign';
        sign.textContent = shelfNames[s];
        shelf.appendChild(sign);
      }
      var row = document.createElement('div');
      row.className = 'row';
      list.forEach(function(it){
        var src = folder + (it.image || it.image_name || 'no-image.png') + bust;
        var price = priceText(it.price, currency);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'item';
        btn.setAttribute('aria-label', (it.name || '') + (price ? ', ' + price : '') + (it.new ? ', new' : ''));
        if (it.new){
          var star = document.createElement('span');
          star.className = 'star';
          star.setAttribute('aria-hidden', 'true');
          star.innerHTML = '&#9733;<small>NEW</small>';
          btn.appendChild(star);
        }
        var img = document.createElement('img');
        img.src = src;
        img.alt = it.name || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        var scale = num(it.scale, 1);
        if (scale !== 1) img.style.height = 'calc(var(--bottle-h) * ' + scale + ')';
        img.onerror = function(){
          img.onerror = null;
          img.src = folder + 'no-image.png' + bust;
        };
        btn.appendChild(img);
        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = price || it.name || '';
        btn.appendChild(tag);
        btn.addEventListener('click', function(){ openCard(it, src, price); });
        row.appendChild(btn);
      });
      shelf.appendChild(row);
      cabinet.appendChild(shelf);
    });
  }

  function openCard(it, src, price){
    cardImg.src = src;
    cardImg.alt = it.name || '';
    cardName.textContent = it.name || '';
    cardNew.style.display = it.new ? 'inline-block' : 'none';
    cardDetail.textContent = it.detail || '';
    cardPrice.textContent = price + (price && it.unit ? ' / ' + String(it.unit).toLowerCase() : '');
    card.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('closeBtn').focus();
  }
  function closeCard(){
    card.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('closeBtn').addEventListener('click', closeCard);
  card.addEventListener('click', function(e){ if (e.target === card) closeCard(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeCard(); });

  fetch(file + bust)
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function(){
      showError('Could not read <code>' + file + '</code>.<br><br>' +
        'Check that the file exists and is valid JSON<br>(a missing comma is the usual cause).');
    });
})();
