function isMenuOpen(){
  var menu = document.getElementById('dropdown-menu');
  return !!menu && menu.classList.contains('is-open');
}

function setMenuOpen(open){
  var menu = document.getElementById('dropdown-menu');
  var btn = document.getElementById('menu-btn');
  var icon = document.getElementById('menu-icon');
  if(!menu) return;
  menu.classList.toggle('is-open', open);
  if(btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if(icon) icon.textContent = open ? 'close' : 'menu';
}

function toggleMenu(){
  setMenuOpen(!isMenuOpen());
}

document.addEventListener('click', function(e){
  if(!isMenuOpen()) return;
  var menu = document.getElementById('dropdown-menu');
  var btn = document.getElementById('menu-btn');
  if(menu && menu.contains(e.target)) return;
  if(btn && btn.contains(e.target)) return;
  setMenuOpen(false);
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && isMenuOpen()) setMenuOpen(false);
});

window.addEventListener('resize', function(){
  if(window.innerWidth >= 640) setMenuOpen(false);
});

function showTab(name){
  setMenuOpen(false);
  document.querySelectorAll('[data-tab-panel]').forEach(function(sec){
    sec.classList.toggle('hidden', sec.id !== 'tab-' + name);
  });
  document.querySelectorAll('.nav-btn').forEach(function(btn){
    var active = btn.getAttribute('data-path') === name;
    btn.classList.toggle('text-primary', active);
    btn.classList.toggle('font-semibold', active);
    btn.classList.toggle('text-on-surface-variant', !active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });
  document.querySelectorAll('[data-menu-item]').forEach(function(item){
    var label = item.textContent.trim();
    item.classList.toggle('text-primary', label === menuLabelFor(name));
  });
  window.scrollTo({top:0, behavior:'smooth'});
}

function menuLabelFor(tab){
  return { accueil:'Accueil', projets:'Projets', expertise:'Expertise', parcours:'Parcours', contact:'Contact' }[tab];
}

function setFormStatus(msg, kind){
  var el = document.getElementById('form-status');
  if(!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.toggle('bg-emerald-50', kind === 'ok');
  el.classList.toggle('text-emerald-700', kind === 'ok');
  el.classList.toggle('bg-red-50', kind === 'error');
  el.classList.toggle('text-red-700', kind === 'error');
}

function setSubmitBusy(busy){
  var btn = document.getElementById('cf-submit');
  if(!btn) return;
  btn.disabled = busy;
  btn.style.opacity = busy ? '0.6' : '1';
}

function whatsappFallback(name, email, type, budget, message){
  var txt = 'Bonjour Ibrahim, je vous contacte depuis votre portfolio.' +
    '\nNom : ' + name + '\nEmail : ' + email + '\nProjet : ' + (type || 'non precise') +
    '\nBudget : ' + (budget || 'non precise') + '\n\n' + message;
  return 'https://wa.me/22664095443?text=' + encodeURIComponent(txt);
}

function sendRequest(e){
  e.preventDefault();
  var form = document.getElementById('contact-form');
  if(!form) return false;

  var name = (document.getElementById('cf-name').value || '').trim();
  var email = (document.getElementById('cf-email').value || '').trim();
  var projectType = (document.getElementById('cf-project').value || '').trim();
  var budget = (document.getElementById('cf-budget').value || '').trim();
  var message = (document.getElementById('cf-message').value || '').trim();
  var company = (document.getElementById('cf-company').value || '').trim();

  if(!name || !message || !email){
    setFormStatus('Merci de remplir le nom, l\'e-mail et le message.', 'error');
    return false;
  }

  setSubmitBusy(true);
  setFormStatus('Envoi en cours...', 'ok');

  fetch('/api/project-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, message: message, projectType: projectType, budget: budget, company: company })
  }).then(function(r){
    return r.json().then(function(d){ return { ok: r.ok && d && d.ok, status: r.status }; });
  }).then(function(res){
    if(res.ok){
      form.reset();
      setFormStatus('Demande envoyee. Je vous reponds sous 48 h.', 'ok');
    } else {
      setSubmitBusy(false);
      var link = whatsappFallback(name, email, projectType, budget, message);
      setFormStatus('Envoi indisponible. Reessayer ou me-ecrire directement :', 'error');
      var el = document.getElementById('form-status');
      var a = document.createElement('a');
      a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.className = 'ml-1 underline font-bold';
      a.textContent = 'Envoyer via WhatsApp';
      el.appendChild(a);
    }
  }).catch(function(){
    setSubmitBusy(false);
    var link = whatsappFallback(name, email, projectType, budget, message);
    setFormStatus('Connexion impossible. Reessayer ou me-ecrire directement :', 'error');
    var el = document.getElementById('form-status');
    var a = document.createElement('a');
    a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.className = 'ml-1 underline font-bold';
    a.textContent = 'Envoyer via WhatsApp';
    el.appendChild(a);
  });

  return false;
}

// État initial
showTab('accueil');