// api/countdown706_start.js
// Independent timer for countdown706.html (triggered on first visit)

const admin = require('firebase-admin');

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
} catch (e) {
  console.error('[countdown706_start] Erreur d\'initialisation Firebase:', e);
}
const db = admin.firestore();

module.exports = async (req, res) => {
  try {
    const docRef = db.collection('config').doc('countdown706_start');
    let doc = await docRef.get();
    let start;
    if (!doc.exists) {
      start = Date.now();
      await docRef.set({ start });
      console.log('[countdown706_start] Timer initialisé à', start);
    } else {
      start = doc.data().start;
      console.log('[countdown706_start] Timer déjà existant:', start);
    }
    res.status(200).json({ start });
  } catch (error) {
    console.error('[countdown706_start] Erreur:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};
