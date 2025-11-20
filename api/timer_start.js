// api/timer_start.js
// Uses Firestore (Firebase) with the JSON key in FIREBASE_SERVICE_ACCOUNT_JSON

const admin = require('firebase-admin');
const { verifySession } = require('./_utils_auth');

const logEnv = () => {
  console.log('[timer_start] FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('[timer_start] FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log('[timer_start] FIREBASE_PRIVATE_KEY present:', !!process.env.FIREBASE_PRIVATE_KEY);
};

try {
  logEnv();
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('One or more Firebase environment variables are missing');
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
} catch (e) {
  console.error('[timer_start] Firebase initialization error:', e);
}
const db = admin.firestore();

module.exports = async (req, res) => {
  // Authentication check
  const session = await verifySession(req);
  if (!session) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }
  try {
    console.log('[timer_start] Reçu une requête');
    const docRef = db.collection('config').doc('timer_start');
    let doc = await docRef.get();
    let start;
    if (!doc.exists) {
      start = Date.now();
      await docRef.set({ start });
      console.log('[timer_start] Timer initialisé à', start);
    } else {
      start = doc.data().start;
      console.log('[timer_start] Timer déjà existant:', start);
    }
    res.status(200).json({ start });
  } catch (error) {
    console.error('[timer_start] Erreur:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};
