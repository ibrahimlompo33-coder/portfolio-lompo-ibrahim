var map3d = null;
var map3dInit = false;
var map3dFlat = false;

function map3dFallback(el, msg){
  el.innerHTML = '<div class="w-full h-full flex items-center justify-center text-center p-4 text-[12px] text-[#6B7280]">' + msg + '</div>';
}

function initMap3D(){
  if(map3dInit) return;
  var el = document.getElementById('projects-map3d');
  if(!el || typeof maplibregl === 'undefined') return;
  map3dInit = true;

  var isMobile = window.matchMedia('(max-width: 640px)').matches;
  var zones = [
    { ll: [12.3714, -1.5197], nom: 'Ouagadougou', info: 'WebSIG Ouagadougou, memoire de Master, missions de cartographie' },
    { ll: [10.317, -3.167], nom: 'Gaoua', info: 'Poster scientifique, potentiel de fertilite des sols' },
    { ll: [12.0616, 0.3584], nom: "Fada N'Gourma", info: 'Stage en urbanisme, donnees foncieres' }
  ];
  var pitch3d = isMobile ? 45 : 60;

  try {
    map3d = new maplibregl.Map({
      container: 'projects-map3d',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-1.6, 11.9],
      zoom: 6,
      pitch: pitch3d,
      bearing: -12,
      maxPitch: 85,
      cooperativeGestures: true,
      canvasContextAttributes: { antialias: !isMobile },
      attributionControl: { compact: true, customAttribution: 'Relief: SRTM / AWS Terrain Tiles' }
    });
  } catch(e) {
    map3dFallback(el, 'Vue 3D indisponible sur ce navigateur.');
    return;
  }

  map3d.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

  map3d.on('load', function(){
    map3d.addSource('terrainSource', {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 14,
      encoding: 'terrarium'
    });
    map3d.setTerrain({ source: 'terrainSource', exaggeration: isMobile ? 1.2 : 1.6 });

    var src = map3d.getSource('openmaptiles');
    if(src){
      map3d.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'openmaptiles',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        paint: {
          'fill-extrusion-color': '#a9c4d2',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.75
        }
      });
    }
  });

  map3d.on('error', function(e){
    if(e && e.error && map3d && !map3d.loaded()){
      console.error('map3d', e.error);
    }
  });

  zones.forEach(function(z){
    var marker = new maplibregl.Marker({ color: '#12B7D6' }).setLngLat(z.ll);
    marker.setPopup(new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML('<strong>' + z.nom + '</strong><br/>' + z.info));
    marker.addTo(map3d);
  });

  var bounds = new maplibregl.LngLatBounds(zones[0].ll, zones[2].ll);
  map3d.fitBounds(bounds, { padding: isMobile ? 48 : 80, duration: 0 });
  map3d.jumpTo({ pitch: pitch3d, bearing: -12 });

  var btn = document.getElementById('map3d-pitch');
  if(btn){
    btn.addEventListener('click', function(){
      map3dFlat = !map3dFlat;
      map3d.easeTo({ pitch: map3dFlat ? 0 : pitch3d, duration: 900 });
      btn.textContent = map3dFlat ? 'Vue 3D' : 'Vue plane';
    });
  }

  var resizeTimer = null;
  window.addEventListener('resize', function(){
    if(resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){ if(map3d) map3d.resize(); }, 150);
  });
}

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
  if(name === 'projets'){
    initMap3D();
    setTimeout(function(){ if(map3d) map3d.resize(); }, 120);
  }
  window.scrollTo({top:0, behavior:'smooth'});
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