// API route to serve the secret video only if user is allowed
const fs = require('fs');
const path = require('path');
const { verifySession } = require('./_utils_auth');

module.exports = async function handler(req, res) {
  // Check session cookie (use your real auth logic)
  const session = await verifySession(req);
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  // TODO: check progress if needed
  const videoPath = path.join(process.cwd(), 'Teaser.mp4');
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.setHeader('Content-Type', 'video/mp4');
  const stream = fs.createReadStream(videoPath);
  stream.pipe(res);
};
