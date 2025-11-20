// /api/terminal.js
// Centralized endpoint for secure processing of terminal commands (dashboard.html)
// All checks (auth, timer, progress, mapping, etc.) are done here server-side

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const https = require('https');
const http = require('http');

// Firebase Admin initialization 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

const delays = [0,2,4,6,8,10,12,14];
const pageMap = {
  '01': 'simon1.html',
  '02': 'labyrinthe2.html',
  '03': 'puzzle3.html',
  '04': 'sudoku4.html',
  '05': 'tusmo5.html',
  '06': 'memory6.html',
  '07': 'mastermind7.html',
  '08': 'labyrinthe8.html'
};

// Utility function to fetch global progress via HTTP
function fetchProgressGlobal(req) {
  return new Promise((resolve) => {
    const proto = req.headers['x-forwarded-proto'] === 'https' ? https : http;
    const host = req.headers.host;
    const options = {
      hostname: host,
      port: proto === https ? 443 : 80,
      path: '/api/progress?global=1',
      method: 'GET',
      headers: { cookie: req.headers.cookie || '' }
    };
    const request = proto.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.unlocked || {});
        } catch {
          resolve({});
        }
      });
    });
    request.on('error', () => resolve({}));
    request.end();
  });
}

// Stockage global en mémoire partagé avec /api/progress.js
let globalProgress;
try {
  // Import dynamique du module progress.js pour accéder à la variable globale
  const progressModule = require('./progress.js');
  // Selon l'export, la variable peut être accessible ainsi :
  globalProgress = progressModule.globalProgress || progressModule.default?.globalProgress || {};
} catch (e) {
  globalProgress = {};
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  if (!req.cookies || !req.cookies.session) {
    return res.status(401).json({ message: 'Non authentifié.' });
  }
  const { command } = req.body || {};
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ message: 'Commande invalide.' });
  }
  // LOG: Commande reçue
  console.log('[API/terminal] Commande reçue:', command);
  // Récupère la progression globale via HTTP (comme le frontend)
  const globalProgress = await fetchProgressGlobal(req);
  // Récupère la date de départ du timer global
  let timerStart = 0;
  try {
    // Correction : lire le timer dans config/timer_start (même doc que le frontend)
    const timerDoc = await db.collection('config').doc('timer_start').get();
    timerStart = timerDoc.exists ? timerDoc.data().start : 0;
    console.log('[API/terminal] Timer start (config/timer_start):', timerStart);
  } catch (e) { console.error('[API/terminal] Erreur Firestore timer', e); }
  // Commandes personnalisées (mapping secret)
  const customMap = {
    'Hide': 'End.',
    'Katchan': 'Je l\'aime.',
    'M0|| ph4||4®7 d3 |<47(#4||': 'Je l\'aime.',
    'SmUgdGUgdm91cw==': 'Reality.',
    'Myzkii': 'Missing.',
    'Pulet': 'Je l\'aime.',
    'Hosarny': 'Je l\'aime.',
    'OkPlonk': 'Je l\'aime.',
    'Okanyan': 'Je l\'aime.',
    'Keola': 'Je l\'aime.',
    'Miel Crapouile': 'Je l\'aime.',
    'Vtubers Fr': 'Je les aimes',
    'Pourquoi Myzkii': 'End.',
    'there is nooo': 'Run.',
    '7h06': 'C\'est là où tout à commencé',
    'C\'est là où tout à commencé': 'err=logout.null',
    '706': 'C\'est là où tout à commencé',
    'err=hi.null': 'Hi.',
    'Nabla': '\u2f1f \u2395\u25cd\u21ef\u22cf\u22c9\u22cf \u22c9\u25cd \u2a00\u2337\u2337\u22d4\u22d4',
    'See time still': 'Home',
    'Void': 'Null.',
    'Freedom': '[?][?][?]',
    'The end is near': 'It\'s me',
    'why are you doing this ?': 'err=log.access_ ∇_node',
    'success=log.access_ ∇_node': '49 27 6d 20 63 6f 6d 69 6e 67 2e',
    'press nifty': 'Huho.',
    'end': 'It\'s me',
    'time': 'home',
    'chaos': 'home',
    'tenebre': 'home'
  };
  // Commande clear
  if (/^clear$/i.test(command)) {
    // Efface l'historique côté client (le frontend doit vider son historique local)
    return res.json({ type: 'clear', message: '' });
  }
  // Commande cd dossier0X
  let m = command.match(/^cd dossier(0[1-8])$/i);
  if (m) {
    const num = m[1];
    const idx = parseInt(num, 10)-1;
    const delayMs = delays[idx]*24*60*60*1000;
    const end = timerStart + delayMs;
    const now = Date.now();
    console.log(`[API/terminal] cd dossier${num} : now=${now} end=${end} (timerStart=${timerStart} + delayMs=${delayMs})`);
    if (now < end) {
      console.log('[API/terminal] cd dossier : not yet');
      // Pour debug, on renvoie explicitement type=output et PAS type=redirect
      return res.json({ type: 'output', message: 'not yet', debug: { now, end, timerStart, delayMs } });
    }
    const pageNum = String(parseInt(num, 10));
    if (globalProgress['page'+pageNum]) {
      console.log('[API/terminal] cd dossier : déverrouillé, redirection page'+pageNum+'.html');
      return res.json({ type: 'redirect', url: 'page'+pageNum+'.html', message: 'redirected to Dossier '+num });
    } else {
      console.log('[API/terminal] cd dossier : non déverrouillé, redirection jeu', pageMap[num]);
      return res.json({ type: 'redirect', url: pageMap[num], message: 'redirected to Dossier '+num });
    }
  }
  // Commande play dossier0X
  m = command.match(/^play dossier(0[1-8])$/i);
  if (m) {
    const num = m[1];
    const idx = parseInt(num, 10)-1;
    const delayMs = delays[idx]*24*60*60*1000;
    const end = timerStart + delayMs;
    const now = Date.now();
    console.log(`[API/terminal] play dossier${num} : now=${now} end=${end} (timerStart=${timerStart} + delayMs=${delayMs})`);
    if (now < end) {
      console.log('[API/terminal] play dossier : not yet');
      // Pour debug, on renvoie explicitement type=output et PAS type=redirect
      return res.json({ type: 'output', message: 'not yet', debug: { now, end, timerStart, delayMs } });
    }
    console.log('[API/terminal] play dossier : redirection jeu', pageMap[num]);
    return res.json({ type: 'redirect', url: pageMap[num], message: 'redirected to Dossier '+num });
  }
  // Commande spéciale accès_grant
  if (command === 'access_grant --token="Δ-FRACTURE" --protocol=706') {
    return res.json({ type: 'redirect', url: 'countdown.html', message: 'auth=success ∇_link.hook' });
  }
  // Commandes customMap (insensible à la casse)
  const lowerCommand = command.toLowerCase();
  const customKey = Object.keys(customMap).find(k => k.toLowerCase() === lowerCommand);
  if (customKey) {
    return res.json({ type: 'output', message: customMap[customKey] });
  }
  // Commande cd..
  if (/^cd\.\.$/i.test(command)) {
    return res.json({ type: 'redirect', url: 'dashboard.html', message: 'Redirected to Homepage' });
  }
  // Commande inconnue
  return res.json({ type: 'output', message: 'invalid.' });
};
