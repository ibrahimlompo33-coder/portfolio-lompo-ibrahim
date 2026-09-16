function showTab(name){
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
  window.scrollTo({top:0, behavior:'smooth'});
}

function sendViaMail(e){
  e.preventDefault();
  var name = document.getElementById('cf-name').value;
  var email = document.getElementById('cf-email').value;
  var message = document.getElementById('cf-message').value;
  var subject = encodeURIComponent('Contact portfolio - ' + name);
  var body = encodeURIComponent(message + '\n\n- ' + name + ' (' + email + ')');
  window.location.href = 'mailto:Ibrahimlompo33@gmail.com?subject=' + subject + '&body=' + body;
  return false;
}

// État initial
showTab('accueil');