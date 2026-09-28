const CONTACT_TO_DEFAULT = 'Ibrahimlompo33@gmail.com';
const RESEND_FROM_DEFAULT = 'Portfolio <onboarding@resend.dev>';

const LIMITS = { name: 120, email: 200, message: 5000, projectType: 120, budget: 60 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\t]+/g, ' ').replace(/[<>]/g, '').trim().slice(0, max);
}

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Methode non autorisee.' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Methode non autorisee.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(res, 503, { ok: false, error: 'Service temporairement indisponible.' });
  }
  const contactTo = process.env.CONTACT_TO || CONTACT_TO_DEFAULT;
  const resendFrom = process.env.RESEND_FROM || RESEND_FROM_DEFAULT;

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (e) {
    return json(res, 400, { ok: false, error: 'Requete invalide.' });
  }

  if (body.company) {
    return json(res, 200, { ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);
  const projectType = clean(body.projectType, LIMITS.projectType);
  const budget = clean(body.budget, LIMITS.budget);

  if (!name || !message) {
    return json(res, 400, { ok: false, error: 'Nom et message requis.' });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return json(res, 400, { ok: false, error: 'Adresse e-mail invalide.' });
  }

  const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const lines = [
    'Nouvelle demande de projet depuis le portfolio',
    '',
    'Nom      : ' + name,
    'E-mail   : ' + email,
    'Projet   : ' + (projectType || 'non precise'),
    'Budget   : ' + (budget || 'non precise'),
    'Recu le  : ' + when,
    '',
    'Message :',
    message
  ];

  const text = lines.join('\n');
  const html =
    '<h2>Nouvelle demande de projet</h2>' +
    '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">' +
    '<tr><td><b>Nom</b></td><td>' + escapeHtml(name) + '</td></tr>' +
    '<tr><td><b>E-mail</b></td><td>' + escapeHtml(email) + '</td></tr>' +
    '<tr><td><b>Projet</b></td><td>' + escapeHtml(projectType || 'non precise') + '</td></tr>' +
    '<tr><td><b>Budget</b></td><td>' + escapeHtml(budget || 'non precise') + '</td></tr>' +
    '<tr><td><b>Recu le</b></td><td>' + escapeHtml(when) + '</td></tr>' +
    '</table>' +
    '<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">' + escapeHtml(message) + '</p>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [contactTo],
        reply_to: email,
        subject: 'Demande de projet - ' + name,
        text: text,
        html: html
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      return json(res, 502, { ok: false, error: 'Envoi impossible, merci de reessayer.' });
    }
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error('project-request failure', e);
    return json(res, 502, { ok: false, error: 'Envoi impossible, merci de reessayer.' });
  }
};
