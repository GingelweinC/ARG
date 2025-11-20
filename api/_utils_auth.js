// _utils_auth.js
// Utility to check user session

const cookie = require('cookie');
const admin = require('firebase-admin');

// Firebase initialization (adapt as needed for your project)
if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}
const db = admin.firestore();

async function verifySession(req) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  if (!cookies.session) return null;

  return { userId: cookies.session };
}

// Checks a user's progress for a given page
async function checkProgress(userId, pageKey) {
  if (!userId || !pageKey) return false;
  const doc = await db.collection('progress').doc(userId).get();
  if (!doc.exists) return false;
  const data = doc.data();
  return !!data[pageKey];
}

module.exports = { verifySession, checkProgress };
