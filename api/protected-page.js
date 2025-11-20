// Shared API route to serve a protected page 
// Usage: /api/protected-page?page=1
const fs = require('fs');
const path = require('path');
const { verifySession, checkProgress } = require('./_utils_auth');

module.exports = async (req, res) => {
  const pageParam = req.query.page || (req.url.match(/protected-page\/?(\d+)/)?.[1]);
  const pageNum = parseInt(pageParam, 10);
  if (!pageNum || pageNum < 1 || pageNum > 8) {
    res.status(400).send('Unknown page');
    return;
  }
  const pageKey = `page${pageNum}`;
  const session = await verifySession(req);
  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }
  const unlocked = await checkProgress(session.userId, pageKey);
  if (!unlocked) {
    res.status(403).send('Page not unlocked');
    return;
  }
  const filePath = path.join(__dirname, `../page${pageNum}.html`);
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send('Server error');
  }
};
