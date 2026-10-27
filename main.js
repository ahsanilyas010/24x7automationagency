/* 24x7 Automation — page behaviour (no build step, no dependencies) */
(function () {
  'use strict';

  // Set this to a form endpoint (Formspree, Make, n8n webhook, etc.) to receive bookings.
  // Leave empty to show the confirmation only.
  var FORM_ENDPOINT = '';

  // Calendly (or other scheduling) link for the "Book a demo" button. Leave empty to hide the button.
  var CALENDLY_URL = '';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) document.documentElement.classList.add('reduced');

  // ---------- Content ----------
  var SOL = [
    { k: 'Wholesaler', t: 'Orders off WhatsApp', r: 'retyping every order into your system', src: 'images/sol-wholesale.jpg',
      steps: ['Order read from the message', 'Entered into your system', 'Confirmed back to the customer', 'Queries flagged to you'] },
    { k: 'Builder', t: 'Quote to paid', r: 'chasing quotes and late payers by hand', src: 'images/sol-builder.jpg',
      steps: ['Quote sent', 'Chased twice', 'Invoice out when the job is done', 'Late payers reminded'] },
    { k: 'Shop', t: 'Stock reorder drafts', r: 'counting shelves and writing supplier orders', src: 'images/sol-shop.jpg',
      steps: ['Stock checked each morning', 'Supplier order drafted', 'Sent once you approve'] },
    { k: 'Any business', t: 'Numbers at 07:00', r: 'pulling figures from three systems', src: 'images/sol-morning.jpg',
      steps: ['Sales, orders and cash', 'Pulled together overnight', 'Sent to you at 07:00'] }
  ];

  var HERO = [
    { k: 'Wholesaler', t: 'WhatsApp order to invoice', steps: [
      ['Order arrives', '"Same as last week plus 2 cases of 5L oil"'],
      ['Read and matched', 'Customer, products and quantities found'],
      ['Entered in your system', 'No retyping, no typos'],
      ['Confirmed to customer', 'Delivery day and total sent back']] },
    { k: 'Builder', t: 'Quote to paid', steps: [
      ['Quote sent', 'Kitchen refit, £14,200 inc VAT'],
      ['Chased on day 3 and 7', 'In your wording, from your mailbox'],
      ['Job marked done', 'Invoice raised and sent'],
      ['Late payer reminded', 'Polite nudge at 7 and 14 days']] },
    { k: 'Shop', t: 'Morning stock check', steps: [
      ['Stock read at 06:00', 'From your till system'],
      ['Low lines found', '12 products under minimum'],
      ['Supplier order drafted', 'Grouped by supplier'],
      ['Waiting for your OK', 'One tap to send']] },
    { k: 'Any business', t: 'Numbers at 07:00', steps: [
      ['Sales pulled', 'From your till or invoices'],
      ['Orders and cash added', 'Bank and order book'],
      ['Summary written', 'Yesterday against last week'],
      ['Sent at 07:00', 'To your phone and inbox']] }
  ];

  var CHANNELS = [
    { k: 'WhatsApp', c: '#25D366', i: 'W' },
    { k: 'Email', c: '#0B7282', i: 'E' },
    { k: 'SMS', c: '#9A5B00', i: 'S' },
    { k: 'Facebook', c: '#1877F2', i: 'f' },
    { k: 'Instagram', c: '#D6336C', i: 'I' },
    { k: 'LinkedIn', c: '#0A66C2', i: 'in' }
  ];
  var SAMPLE_MSGS = {
    WhatsApp: ['Can you fit us in Thursday?', 'Same order as last week please', 'Is the 9am slot still free?'],
    Email: ['Quote request for a kitchen refit', 'Invoice 1042 query', 'Can I change my booking?'],
    SMS: ['Running 10 mins late', 'Do you do weekends?', 'Please call me back'],
    Facebook: ['How much for a full service?', 'Are you open bank holiday?'],
    Instagram: ['Love this, do you deliver?', 'Price for the grey one?'],
    LinkedIn: ['Could we set up a call?', 'Interested in a partnership']
  };

  var PROC = [
    { t: 'Scope', d: 'A call where you describe the bottleneck in your own words, whatever your industry. We match it to a build and give you a fixed price.' },
    { t: 'Brief and demo', d: 'We turn it into a build brief and show you a working demo on your own data before anything goes live.' },
    { t: 'Go live', d: 'Switched on with you watching. We stay close for the first two weeks while it settles in.' },
    { t: 'Care plan', d: 'We monitor it, fix it when something upstream changes, and make small changes as you grow.' }
  ];

  var TRADES = [
    { name: 'Builders', tpl: 'Builder', img: 'images/trade-builders.jpg', alt: 'Construction crew on a building site', pain: 'Quotes go out and nobody chases them. Invoices wait until the weekend.',
      steps: ['Quote sent from your template', 'Chased on day 3 and day 7', 'Invoice raised when the job is marked done', 'Late payers reminded at 7 and 14 days'] },
    { name: 'Kitchens', tpl: 'Builder', img: 'images/trade-kitchens.jpg', alt: 'Newly fitted kitchen with brass tap', pain: 'Every enquiry needs a measure-up booked, a design sent and a deposit chased.',
      steps: ['Measure-up request logged', 'Design and quote sent together', 'Deposit invoice raised on yes', 'Balance chased before fitting'] },
    { name: 'Electrical', tpl: 'Builder', img: 'images/trade-electrical.jpg', alt: 'Electrician wiring a socket', pain: 'Certificates and invoices are written up late at night after the job.',
      steps: ['Job marked done on the phone', 'Certificate and invoice drafted', 'Sent to the customer', 'Unpaid invoices reminded'] },
    { name: 'Plumbing and heating', tpl: 'Builder', img: 'images/trade-plumbing.jpg', alt: 'Chrome bath taps and shower fittings', pain: 'Service reminders are kept in a notebook and often missed.',
      steps: ['Service dates stored per customer', 'Reminder sent a month before', 'Booking request logged', 'Invoice out after the visit'] },
    { name: 'Roofing', tpl: 'Builder', img: 'images/trade-roofing.jpg', alt: 'Roofer working on a pitched roof', pain: 'Quotes after inspections take days because photos and notes are scattered.',
      steps: ['Inspection photos and notes gathered', 'Quote drafted from your price list', 'Sent and chased twice', 'Invoice out on completion'] },
    { name: 'Landscaping', tpl: 'Builder', img: 'images/trade-landscaping.jpg', alt: 'Landscaper planting up a garden bed', pain: 'Seasonal work means a rush of quotes that never get followed up.',
      steps: ['Enquiries logged from WhatsApp and email', 'Quotes sent from templates', 'Chased before the season fills', 'Deposit invoices raised'] },
    { name: 'Wholesale', tpl: 'Wholesaler', img: 'images/trade-wholesale.jpg', alt: 'Parcel being handed over for delivery', pain: 'Thirty WhatsApp orders a day, each one typed into the system by hand.',
      steps: ['Order read from WhatsApp', 'Matched to customer and products', 'Entered into your system', 'Confirmation sent back'] },
    { name: 'Independent shops', tpl: 'Shop', img: 'images/trade-shops.jpg', alt: 'Open sign in a shop window', pain: 'Shelves are counted by eye and supplier orders written at closing time.',
      steps: ['Stock read from the till each morning', 'Low lines listed', 'Supplier orders drafted', 'Sent once you approve'] }
  ];

  var PRODUCTS = [
    { t: 'AI Receptionist', domain: 'frontdesk.24x7automations.com', href: 'https://frontdesk.24x7automations.com', src: 'images/prod-frontdesk.jpg', live: true,
      d: 'Your AI front desk for WhatsApp, SMS, Facebook, Instagram and LinkedIn. Every message is sorted into its own place, replies are drafted in your voice, bookings and payment links are handled, and you step in only when a decision needs you.' },
    { t: 'AI Email Assistant', domain: 'email.24x7automations.com', href: 'https://email.24x7automations.com', src: 'images/prod-email.jpg', live: true,
      d: 'Reads and sorts every email enquiry, drafts quotes and replies from your own business information, and handles bookings, cancellations and changes. Anything important waits for your approval.' },
    { t: 'AI CEO', domain: 'ceo.24x7automations.com', href: 'https://ceo.24x7automations.com', src: 'images/prod-ceo.jpg', live: false,
      d: 'One dashboard for the business. Income by service and by staff, salary costs, a weekly briefing on what went well and what needs attention, and suggestions.' },
    { t: 'Team Manager', domain: 'teams.24x7automations.com', href: 'https://teams.24x7automations.com', src: 'images/prod-teams.jpg', live: false,
      d: 'Staff profiles, hours, holidays and skills. Bookings go to whoever is free and qualified, tasks are delegated, and performance is tracked per person.' },
    { t: 'AI Social Poster', domain: 'social.24x7automations.com', href: 'https://social.24x7automations.com', src: 'images/prod-social.jpg', live: false,
      d: 'Creates posts from your bookings, reviews and business activity, suggests campaigns, and publishes to Instagram, Facebook and Google Business Profile after you approve.' }
  ];

  var RULES = [
    { t: 'Built on what you use', d: 'We connect to your existing systems. No new software for your team to learn.' },
    { t: 'You approve the important steps', d: 'Anything that spends money or speaks for you can wait for your OK.' },
    { t: 'Demo before go-live', d: 'You see it working on your own data before it is switched on.' },
    { t: 'Your data stays yours', d: 'Stored securely and never shared. We work from code and redacted logs, never your customers’ messages.' },
    { t: 'Fixed price', d: 'Agreed before work starts. No hourly billing, no surprises.' },
    { t: 'Looked after', d: 'The care plan covers monitoring and fixes, so it keeps working when things change.' }
  ];

  var BANDS = [
    { t: 'Small', d: 'One step automated inside a single system. For example a daily numbers summary.' },
    { t: 'Standard', d: 'A full job across two systems. For example WhatsApp orders into your accounts.' },
    { t: 'Large', d: 'A multi-step job with approvals across several systems. For example quote to paid.' }
  ];

  var FAQ = [
    ['What kind of jobs can you automate?', 'Repeated jobs that follow the same steps each time: orders, quotes, invoices, reminders, stock, daily figures and customer conversations. If it is done by hand more than a few times a week, it is worth a call. We work with any industry: trades, wholesale, retail, clinics, studios, agencies and offices.'],
    ['Which channels does the AI front desk cover?', 'WhatsApp, email, SMS, Facebook Messenger, Instagram and LinkedIn messages. Each channel is sorted into its own place on one dashboard, so WhatsApp conversations sit with WhatsApp, emails with email, and nothing is mixed into one cluttered inbox.'],
    ['Will I still get a notification for every message?', 'No. Messages are collected quietly, a reply is drafted for each one, and the dashboard shows you what needs an answer now. You check your WhatsApp folder, your email folder or your social folder when you are ready, instead of your phone pinging all day.'],
    ['Does the AI send replies without me?', 'Only where you allow it. You decide which replies can go out automatically, such as opening hours or booking confirmations, and which wait for your approval. Anything that spends money or commits you to something always waits for you.'],
    ['Do I need to change my software?', 'No. We build on the systems you already use, such as your accounts package, till, calendar or mailbox. The AI front desk connects to your existing numbers and inboxes.'],
    ['How is the AI front desk priced?', 'One tailored plan per business, based on your channels and volume, so you always know what the bill will be. You start with a two-week trial. If you are happy, the plan is paid annually. There are no monthly direct debits and no per-message surprises.'],
    ['How quickly can I get set up?', 'The AI front desk connects to your channels in minutes and we help you add your business information the same day. Custom builds get a date along with the fixed price on your scoping call.'],
    ['How long does a custom project take?', 'It depends on the band. Small builds are usually live within a couple of weeks, larger multi-system jobs take longer. You get a date along with the fixed price before any work starts.'],
    ['What if my job does not match the four builds?', 'Tell us the bottleneck anyway. We look at the problem, propose a solution and price it. If it is not something we can deliver properly, we will say so.'],
    ['What does the care plan cover?', 'Monitoring, fixes when an outside system changes, and small changes as your business grows. It comes with every project.'],
    ['How do the ready-made products fit in?', 'AI Receptionist, AI Email Assistant, AI CEO, Team Manager and AI Social Poster are separate products, each with its own site. They share the same customer and booking records, so they work together. Many customers start with one and add a custom build later.']
  ];

  var INDUSTRIES = ['Construction and trades', 'Home services', 'Wholesale and distribution', 'Retail and shops', 'Clinics and dental', 'Education and tutoring', 'Fitness and studios', 'Hospitality', 'Professional services', 'Manufacturing', 'Other'];
  var TEAM_SIZES = ['Just me', '2 to 5', '6 to 10', '11 to 50', 'More than 50'];
  var COUNTRIES = ['United Kingdom', 'Ireland', 'United States', 'Canada', 'Australia', 'New Zealand', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Pakistan', 'India', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'South Africa', 'Other'];

  var MARQUEE = ['Orders off WhatsApp', 'Quote to paid', 'Stock reorder drafts', 'Numbers at 07:00', 'Builders', 'Wholesalers', 'Shops', 'Kitchens', 'Electrical', 'Plumbing and heating', 'Roofing', 'Landscaping'];

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  // ---------- Hero demo ----------
  var hf = 0, hk = RM ? 4 : 0;
  var heroSteps = $('demo-steps'), heroTabs = $('demo-tabs');

  function renderHero() {
    var flow = HERO[hf];
    var k = Math.min(hk, 4);
    $('demo-k').textContent = flow.k;
    $('demo-t').textContent = flow.t;
    $('demo-running').classList.toggle('on', hk % 2 === 1);
    heroSteps.innerHTML = '';
    flow.steps.forEach(function (s, i) {
      var done = i < k, cur = i === k;
      var row = el('div', 'dstep' + (done ? ' done' : cur ? ' cur' : ''));
      row.innerHTML =
        '<div class="dstep-rail"><span class="dstep-num">' + (done ? '✓' : i + 1) + '</span><span class="dstep-line"><i></i></span></div>' +
        '<div class="dstep-body"><span class="t">' + esc(s[0]) + '</span><span class="d">' + esc(s[1]) + '</span></div>';
      heroSteps.appendChild(row);
    });
    Array.prototype.forEach.call(heroTabs.children, function (b, i) {
      b.classList.toggle('on', i === hf);
      b.setAttribute('aria-selected', i === hf ? 'true' : 'false');
    });
  }
  HERO.forEach(function (flow, i) {
    var b = el('button', '', esc(flow.k));
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.addEventListener('click', function () { hf = i; hk = RM ? 4 : 0; renderHero(); });
    heroTabs.appendChild(b);
  });
  renderHero();
  if (!RM) {
    setInterval(function () {
      if (hk >= 6) { hk = 0; hf = (hf + 1) % HERO.length; } else { hk++; }
      renderHero();
    }, 1100);
  }

  // ---------- Marquee ----------
  var mq = $('marquee');
  MARQUEE.concat(MARQUEE).forEach(function (m) { mq.appendChild(el('span', '', esc(m))); });
  if (!RM && mq.animate) {
    mq.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 50000, iterations: Infinity });
  }

  // ---------- Front desk routing animation ----------
  var feed = $('router-feed'), out = $('router-out');
  var counts = {}, outTiles = {};
  CHANNELS.forEach(function (ch) {
    counts[ch.k] = 0;
    var tile = el('div', 'rtile');
    tile.innerHTML =
      '<span class="rtile-icon" style="background:' + ch.c + '">' + ch.i + '</span>' +
      '<span class="rtile-body"><span class="rtile-k">' + ch.k + '</span><span class="rtile-s">0 waiting</span></span>' +
      '<span class="rtile-n">0</span>';
    out.appendChild(tile);
    outTiles[ch.k] = tile;
  });
  function updateTile(k) {
    var t = outTiles[k], n = counts[k];
    t.querySelector('.rtile-n').textContent = n;
    t.querySelector('.rtile-s').textContent = n === 0 ? '0 waiting' : (n + (n === 1 ? ' draft ready' : ' drafts ready'));
    t.classList.remove('pulse'); void t.offsetWidth; t.classList.add('pulse');
  }
  function routeOne() {
    var ch = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
    var msgs = SAMPLE_MSGS[ch.k];
    var chip = el('div', 'rmsg');
    chip.innerHTML = '<span class="rtile-icon" style="background:' + ch.c + '">' + ch.i + '</span><span class="rmsg-t">' + esc(msgs[Math.floor(Math.random() * msgs.length)]) + '</span>';
    feed.insertBefore(chip, feed.firstChild);
    while (feed.children.length > 4) feed.removeChild(feed.lastChild);
    requestAnimationFrame(function () { chip.classList.add('in'); });
    setTimeout(function () {
      chip.classList.add('routed');
      counts[ch.k] = (counts[ch.k] + 1) % 10 || 1;
      updateTile(ch.k);
    }, 1400);
  }
  if (RM) {
    // Static snapshot for reduced motion
    [['WhatsApp', 3], ['Email', 5], ['SMS', 2], ['Facebook', 1], ['Instagram', 2], ['LinkedIn', 1]].forEach(function (p) { counts[p[0]] = p[1]; updateTile(p[0]); });
    [['WhatsApp', 0], ['Email', 0], ['SMS', 0]].forEach(function (p) {
      var ch = CHANNELS.filter(function (c) { return c.k === p[0]; })[0];
      var chip = el('div', 'rmsg in');
      chip.innerHTML = '<span class="rtile-icon" style="background:' + ch.c + '">' + ch.i + '</span><span class="rmsg-t">' + esc(SAMPLE_MSGS[ch.k][0]) + '</span>';
      feed.appendChild(chip);
    });
  } else {
    routeOne();
    setInterval(routeOne, 1900);
  }

  // ---------- Solutions ----------
  var sg = $('solutions-grid');
  SOL.forEach(function (c) {
    var card = el('div', 'sol');
    card.setAttribute('data-reveal', '0');
    card.innerHTML =
      '<div class="sol-img"><img src="' + c.src + '" alt="" loading="lazy"></div>' +
      '<span class="k">' + esc(c.k) + '</span>' +
      '<h3>' + esc(c.t) + '</h3>' +
      '<p class="r"><span>Replaces:</span> ' + esc(c.r) + '</p>' +
      '<ul>' + c.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    sg.appendChild(card);
  });

  // ---------- Process ----------
  var pk = RM ? 3 : 0;
  var pg = $('process-grid');
  PROC.forEach(function (p, i) {
    var card = el('div', 'proc');
    card.setAttribute('data-reveal', '0');
    card.innerHTML = '<span class="n">' + pad(i + 1) + '</span><h3>' + esc(p.t) + '</h3><p>' + esc(p.d) + '</p>';
    pg.appendChild(card);
  });
  function renderProc() {
    var k = Math.min(pk, 3);
    $('proc-bar').style.width = ((k + 1) / 4 * 100) + '%';
    Array.prototype.forEach.call(pg.children, function (c, i) {
      c.classList.toggle('on', i <= k);
      c.classList.toggle('cur', i === k);
    });
  }
  renderProc();
  if (!RM) setInterval(function () { pk = (pk + 1) % 5; renderProc(); }, 1700);

  // ---------- Trades ----------
  var tr = 0, step = 0, tradeAuto = true;
  var chips = $('trade-chips'), tsteps = $('trade-steps');
  TRADES.forEach(function (t, i) {
    var b = el('button', '', esc(t.name));
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.addEventListener('click', function () { tr = i; step = 0; tradeAuto = false; renderTrade(); });
    chips.appendChild(b);
  });
  function renderTrade() {
    var t = TRADES[tr];
    var tk = RM ? t.steps.length : step % (t.steps.length + 2);
    $('trade-pain').textContent = t.pain;
    $('trade-tpl').textContent = t.tpl;
    var img = $('trade-img');
    if (img.getAttribute('src') !== t.img) {
      img.classList.add('swap');
      setTimeout(function () { img.src = t.img; img.alt = t.alt; img.classList.remove('swap'); }, RM ? 0 : 220);
    }
    Array.prototype.forEach.call(chips.children, function (b, i) {
      b.classList.toggle('on', i === tr);
      b.setAttribute('aria-selected', i === tr ? 'true' : 'false');
    });
    tsteps.innerHTML = '';
    t.steps.forEach(function (s, i) {
      var row = el('div', 'astep' + (i < tk ? ' done' : i === tk ? ' cur' : ''));
      row.innerHTML = '<span class="n">' + pad(i + 1) + '</span><span class="t">' + esc(s) + '</span>';
      tsteps.appendChild(row);
    });
  }
  renderTrade();
  if (!RM) {
    setInterval(function () {
      step++;
      // Auto-rotate through trades so no single industry looks like the only one we serve.
      if (tradeAuto && step > 0 && step % (TRADES[tr].steps.length + 2) === 0) { tr = (tr + 1) % TRADES.length; step = 0; }
      renderTrade();
    }, 1300);
  }

  // ---------- Products ----------
  var prg = $('products-grid'), fp = $('footer-products');
  PRODUCTS.forEach(function (p) {
    var a = el('a', 'prod');
    a.href = p.href; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('data-reveal', '0');
    a.innerHTML =
      '<div class="prod-img"><img src="' + p.src + '" alt="" loading="lazy"></div>' +
      '<div class="prod-body">' +
        '<div class="prod-top"><h3>' + esc(p.t) + '</h3><span class="status' + (p.live ? ' live' : '') + '">' + (p.live ? 'Available now' : 'Coming soon') + '</span></div>' +
        '<p>' + esc(p.d) + '</p>' +
        '<span class="domain">' + esc(p.domain) +
          '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M7 17 17 7M8 7h9v9"/></svg>' +
        '</span>' +
      '</div>';
    prg.appendChild(a);
    var f = el('a', '', esc(p.t));
    f.href = p.href; f.target = '_blank'; f.rel = 'noopener';
    fp.appendChild(f);
  });

  // ---------- Rules ----------
  var rg = $('rules-grid');
  RULES.forEach(function (r) {
    var d = el('div', 'rule', '<h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p>');
    d.setAttribute('data-reveal', '0');
    rg.appendChild(d);
  });

  // ---------- Pricing bands ----------
  var bg = $('bands-grid'), last = bg.querySelector('[data-last]');
  BANDS.forEach(function (b) {
    var d = el('div', 'band', '<span class="k">Project band</span><h3>' + esc(b.t) + '</h3><p>' + esc(b.d) + '</p>');
    d.setAttribute('data-reveal', '0');
    bg.insertBefore(d, last);
  });

  // ---------- FAQ ----------
  var fl = $('faq-list');
  FAQ.forEach(function (f, i) {
    var item = el('div', 'faq-item' + (i === 0 ? ' open' : ''));
    var id = 'faq-a-' + i;
    item.innerHTML =
      '<button type="button" class="faq-q" aria-expanded="' + (i === 0) + '" aria-controls="' + id + '"><span>' + esc(f[0]) + '</span>' +
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="fill:none;stroke:#4B463D;stroke-width:2;stroke-linecap:round"><path d="M12 5v14M5 12h14"/></svg></button>' +
      '<p class="faq-a" id="' + id + '">' + esc(f[1]) + '</p>';
    item.querySelector('button').addEventListener('click', function () {
      var open = item.classList.contains('open');
      Array.prototype.forEach.call(fl.children, function (it) {
        it.classList.remove('open');
        it.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
    });
    fl.appendChild(item);
  });

  // ---------- Form ----------
  function fillSelect(id, items) {
    var s = $(id);
    items.forEach(function (n) { var o = document.createElement('option'); o.textContent = n; s.appendChild(o); });
  }
  fillSelect('build-select', ['AI front desk: all channels, one dashboard'].concat(SOL.map(function (x) { return x.k + ': ' + x.t; })).concat(['Not sure yet']));
  fillSelect('industry-select', INDUSTRIES);
  fillSelect('team-select', TEAM_SIZES);
  fillSelect('country-select', COUNTRIES);
  var demoBtn = $('demo-btn');
  if (CALENDLY_URL) { demoBtn.href = CALENDLY_URL; demoBtn.hidden = false; }
  var form = $('book-form'), card = $('book-card'), err = $('form-error'), btn = $('submit-btn');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var required = ['name', 'business', 'email', 'phone'];
    var ok = required.every(function (n) { return form.elements[n].value.trim(); }) && form.elements.email.checkValidity();
    err.classList.toggle('show', !ok);
    if (!ok) return;
    var data = {};
    Array.prototype.forEach.call(form.elements, function (f) { if (f.name) data[f.name] = f.value; });
    data.page = location.href;
    function done() { card.classList.add('is-sent'); card.scrollIntoView({ block: 'nearest' }); }
    if (!FORM_ENDPOINT) { done(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('Request failed');
      done();
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Book a scoping call';
      err.textContent = 'Something went wrong sending your request. Please try again or email us directly.';
      err.classList.add('show');
    });
  });

  // ---------- Footer year ----------
  $('year').textContent = new Date().getFullYear();

  // ---------- Reveal on scroll ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function showAll() { revealEls.forEach(function (e) { e.classList.add('in'); }); }
  if (RM || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    revealEls.forEach(function (e) { e.style.transitionDelay = (e.getAttribute('data-reveal') || 0) + 'ms'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (e) { io.observe(e); });
    window.addEventListener('beforeprint', showAll);
    setTimeout(showAll, 2500);
  }

  // ---------- Parallax on photos ----------
  if (!RM) {
    var par = Array.prototype.slice.call(document.querySelectorAll('[data-parallax] img'));
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        par.forEach(function (img) {
          var r = img.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var p = (r.top + r.height / 2 - vh / 2) / vh;
          img.style.transform = 'scale(1.12) translateY(' + (p * -30).toFixed(1) + 'px)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
