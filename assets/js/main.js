var cesiumViewer = null;
var cesiumInit = false;
var cutActive = false;
var insideActive = false;
var cutPlane = null;

var OUA = { lon: -1.5197, lat: 12.3714 };

function v3dStatus(msg){
  var el = document.getElementById('v3d-status');
  if(el) el.textContent = msg;
}

function buildDemoBuildings(scene){
  // Maquette de démonstration : volumes bâtis stylisés sur Ouagadougou.
  var blocks = [
    { d: 0.0016, h: 34, w: 0.0022, rot: 0.2 },
    { d: 0.0022, h: 22, w: 0.0018, rot: -0.4 },
    { d: 0.0014, h: 46, w: 0.0016, rot: 0.9 },
    { d: 0.0026, h: 14, w: 0.0020, rot: 0.1 },
    { d: 0.0018, h: 28, w: 0.0015, rot: -0.8 },
    { d: 0.0030, h: 10, w: 0.0024, rot: 0.5 }
  ];
  blocks.forEach(function(b, i){
    var lat = OUA.lat + (i - blocks.length / 2) * b.d;
    var lon = OUA.lon + (i % 2 ? 0.0026 : -0.0026);
    var positions = Cesium.Cartesian3.fromDegreesArray([
      lon - b.w / 2, lat - b.d / 2,
      lon + b.w / 2, lat - b.d / 2,
      lon + b.w / 2, lat + b.d / 2,
      lon - b.w / 2, lat + b.d / 2
    ]);
    scene.primitives.add(Cesium.PolygonGeometryInstance.fromGeometry({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(positions),
        height: 0,
        extrudedHeight: b.h,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.fromCssColorString(i % 2 ? '#8fb8c9' : '#a9c4d2').withAlpha(0.92)
        )
      },
      id: 'batiment-' + i
    }));
  });

  // Sol + dallage pour cadrer la maquette.
  var pad = Cesium.Cartesian3.fromDegreesArray([
    OUA.lon - 0.012, OUA.lat - 0.010,
    OUA.lon + 0.012, OUA.lat - 0.010,
    OUA.lon + 0.012, OUA.lat + 0.010,
    OUA.lon - 0.012, OUA.lat + 0.010
  ]);
  scene.primitives.add(Cesium.PolygonGeometryInstance.fromGeometry({
    geometry: new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(pad),
      height: 0,
      extrudedHeight: 0.4,
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.fromCssColorString('#1c2a33').withAlpha(0.85)
      )
    }
  }));
}

function updateClipPlane(){
  var scene = cesiumViewer.scene;
  var planes = [];
  if(cutActive || insideActive){
    var center = Cesium.Cartesian3.fromDegrees(OUA.lon, OUA.lat, 0);
    // plan vertical qui scie la maquette en deux
    var plane = Cesium.Plane.fromPointAndNormal(
      center,
      Cesium.Cartesian3.normalize(Cesium.Cartesian3.fromDegrees(OUA.lon + 0.0025, OUA.lat, 0), new Cesium.Cartesian3())
    );
    planes.push(plane);
    cutPlane = plane;
  } else {
    cutPlane = null;
  }
  scene.globe.clippingPlanes = Cesium.ClippingPlaneCollection.fromArray(planes);
  scene.globe.clippingPlanes.enabled = planes.length > 0;
}

function flyToView(kind){
  var scene = cesiumViewer.scene;
  var h = 420;
  if(kind === 'top'){
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(OUA.lon, OUA.lat, h * 2.2),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 },
      duration: 1.4
    });
  } else if(kind === 'inside'){
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(OUA.lon - 0.0016, OUA.lat + 0.0008, 26),
      orientation: { heading: Cesium.Math.toRadians(35), pitch: Cesium.Math.toRadians(-6), roll: 0 },
      duration: 1.6
    });
  } else {
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(OUA.lon - 0.016, OUA.lat - 0.014, h),
      orientation: { heading: Cesium.Math.toRadians(20), pitch: Cesium.Math.toRadians(-32), roll: 0 },
      duration: 1.4
    });
  }
}

function initCesium3D(){
  if(cesiumInit) return;
  var el = document.getElementById('cesium3d');
  if(!el || typeof Cesium === 'undefined') return;
  cesiumInit = true;

  try {
    cesiumViewer = new Cesium.Viewer('cesium3d', {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shouldAnimate: false
    });
  } catch(e) {
    el.innerHTML = '<div class="w-full h-full flex items-center justify-center text-center p-4 text-[12px] text-[#6B7280]">Vue 3D indisponible sur ce navigateur.</div>';
    return;
  }

  cesiumViewer.imageryLayers.removeAll();
  cesiumViewer.imageryLayers.addImageryProvider(
    new Cesium.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' })
  );
  cesiumViewer.scene.globe.enableLighting = true;

  buildDemoBuildings(cesiumViewer.scene);

  var immersive = document.getElementById('v3d-immersive');
  var cutBtn = document.getElementById('v3d-cut');
  var insideBtn = document.getElementById('v3d-inside');
  var topBtn = document.getElementById('v3d-top');

  if(immersive) immersive.addEventListener('click', function(){ flyToView('immersion'); });
  if(topBtn) topBtn.addEventListener('click', function(){ flyToView('top'); });

  if(cutBtn){
    cutBtn.addEventListener('click', function(){
      cutActive = !cutActive;
      insideActive = false;
      updateClipPlane();
      cutBtn.textContent = cutActive ? 'Coupe OK' : 'Coupe';
      if(insideBtn) insideBtn.textContent = 'Intérieur';
      flyToView('immersion');
      v3dStatus(cutActive ? 'Coupe active : la maquette est tranchée.' : 'Coupe désactivée.');
    });
  }

  if(insideBtn){
    insideBtn.addEventListener('click', function(){
      insideActive = !insideActive;
      cutActive = false;
      updateClipPlane();
      insideBtn.textContent = insideActive ? 'Intérieur ON' : 'Intérieur';
      if(cutBtn) cutBtn.textContent = 'Coupe';
      flyToView(insideActive ? 'inside' : 'immersion');
      v3dStatus(insideActive ? 'Vue intérieure : placez-vous dans le bâtiment scié.' : 'Vue intérieure désactivée.');
    });
  }

  flyToView('immersion');

  var timer = null;
  window.addEventListener('resize', function(){
    if(timer) clearTimeout(timer);
    timer = setTimeout(function(){
      if(cesiumViewer && !cesiumViewer.isDestroyed()) cesiumViewer.resize();
    }, 150);
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
    initCesium3D();
    setTimeout(function(){ if(cesiumViewer && !cesiumViewer.isDestroyed()) cesiumViewer.resize(); }, 150);
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