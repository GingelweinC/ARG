import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Check the session cookie
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('session=')) {
    res.writeHead(302, { Location: '/index.html' });
    res.end();
    return;
  }
  // Serve the HTML file if authenticated
  const filePath = path.join(process.cwd(), 'dashboard.html');
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).end(html);
  } catch (e) {
    res.status(500).end('Erreur serveur');
  }
}
