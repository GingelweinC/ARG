// API route for validating and exposing global game progress (Vercel serverless function)
// Used to unlock access to protected pages

const admin = require('firebase-admin');
let db;
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
  db = admin.firestore();
} catch (e) {
  console.error('[progress] Firebase initialization error:', e);
}

export default async function handler(req, res) {
  // GET global status: /api/progress?global=1
  if (req.method === 'GET' && req.query && req.query.global === '1') {
    try {
      const doc = await db.collection('config').doc('global_progress').get();
      const unlocked = doc.exists ? doc.data().unlocked || {} : {};
      return res.status(200).json({ unlocked });
    } catch (e) {
      return res.status(500).json({ error: 'Firestore error' });
    }
  }
  // GET page status: /api/progress?page=X
  if (req.method === 'GET' && req.query && req.query.page) {
    let page = req.query.page;
    if (/^\d+$/.test(page)) page = 'page' + String(Number(page));
    else if (/^page0\d$/.test(page)) page = page.replace(/^page0(\d)$/, 'page$1');
    try {
      const doc = await db.collection('config').doc('global_progress').get();
      const unlocked = doc.exists ? doc.data().unlocked || {} : {};
      return res.status(200).json({ allowed: !!unlocked[page] });
    } catch (e) {
      return res.status(500).json({ error: 'Firestore error' });
    }
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Check session cookie
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('session=')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }
  const { page, solved } = body || {};
  let normPage = page;
  if (typeof normPage === 'number' || /^\d+$/.test(normPage)) normPage = 'page' + String(Number(normPage));
  else if (/^page0\d$/.test(normPage)) normPage = normPage.replace(/^page0(\d)$/, 'page$1');
  if (solved && normPage) {
    try {
      const docRef = db.collection('config').doc('global_progress');
      const doc = await docRef.get();
      let unlocked = doc.exists ? doc.data().unlocked || {} : {};
      unlocked[normPage] = true;
      await docRef.set({ unlocked }, { merge: true });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Erreur Firestore' });
    }
  }
  // RESET global progress: /api/progress?reset=1 (admin only)
  if (req.method === 'POST' && req.query && req.query.reset === '1') {
    try {
      await db.collection('config').doc('global_progress').set({ unlocked: {} });
      return res.status(200).json({ reset: true });
    } catch (e) {
      return res.status(500).json({ error: 'Erreur Firestore' });
    }
  }
  return res.status(400).json({ error: 'Requête invalide' });
}
