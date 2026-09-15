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
  if (name === 'projets') initProjectsMap();
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

var projectsMap = null;
var projectsMapInit = false;
var mapUsingSat = false;

function mapToggleLabel() {
  var btn = document.getElementById('map-basemap-toggle');
  if (!btn) return;
  var lang = getSavedLang();
  if (!lang || !I18N[lang]) lang = DEFAULT_LANG;
  btn.textContent = mapUsingSat ? I18N[lang].map_btn_osm : I18N[lang].map_btn_sat;
}

function initProjectsMap() {
  if (projectsMapInit) return;
  if (typeof L === 'undefined') return;
  projectsMapInit = true;
  projectsMap = L.map('projects-map', { scrollWheelZoom: false });
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(projectsMap);
  var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri'
  });
  L.marker([12.3714, -1.5197]).addTo(projectsMap).bindPopup('Ouagadougou');
  L.marker([10.317, -3.167]).addTo(projectsMap).bindPopup('Gaoua');
  L.marker([12.0616, 0.3584]).addTo(projectsMap).bindPopup('Fada N\u0027Gourma');
  projectsMap.fitBounds([[12.3714, -1.5197], [10.317, -3.167], [12.0616, 0.3584]]);
  document.getElementById('map-basemap-toggle').addEventListener('click', function () {
    mapUsingSat = !mapUsingSat;
    if (mapUsingSat) {
      projectsMap.addLayer(sat);
      projectsMap.removeLayer(osm);
    } else {
      projectsMap.addLayer(osm);
      projectsMap.removeLayer(sat);
    }
    mapToggleLabel();
  });
  mapToggleLabel();
  setTimeout(function () { if (projectsMap) projectsMap.invalidateSize(); }, 200);
}

window.addEventListener('resize', function () {
  if (projectsMap) projectsMap.invalidateSize();
});

// État initial
showTab('accueil');