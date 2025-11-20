// /api/force_all_timers.js
// GET endpoint to force all timers as finished (debug only)
const admin = require('firebase-admin');

try {
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
  console.error('[force_all_timers] Firebase initialization error:', e);
}
const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Old date (January 1, 2020)
    const oldDate = new Date('2020-01-01T00:00:00Z');
    const configRef = db.collection('config');
    await configRef.doc('timer_start').set({ start: oldDate.getTime() }, { merge: true });
    await configRef.doc('countdown706_start').set({ start: oldDate.getTime() }, { merge: true });
    // Ajoutez ici d'autres timers si besoin
    return res.status(200).json({ message: 'All timers forced as finished (debug)', date: oldDate });
  } catch (e) {
    return res.status(500).json({ message: 'Error forcing timers', error: e.message });
  }
};
