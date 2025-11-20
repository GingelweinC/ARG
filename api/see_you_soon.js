// API route to serve the secret image only if user is allowed
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Check session cookie
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('session=')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  // TODO: check progress (user must have unlocked the image)
  // For demo, always allow if session exists
  const imgPath = path.join(process.cwd(), 'See_you_soon.png');
  if (!fs.existsSync(imgPath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  res.setHeader('Content-Type', 'image/png');
  fs.createReadStream(imgPath).pipe(res);
}
