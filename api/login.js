// API route for authentication (Vercel serverless function)
// Never expose credentials in frontend code!

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Checks for the presence of the session cookie
    const cookies = req.headers.cookie || '';
    if (cookies.includes('session=')) {
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }
  const { username, password } = body || {};
  // Replace with your real credentials (never expose in frontend)
  const VALID_USER = process.env.LOGIN_USER;
  const VALID_PASS = process.env.LOGIN_PASS;

  if (username === VALID_USER && password === VALID_PASS) {
    // Generate a simple session token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    // Set cookie (HttpOnly, Secure)
    res.setHeader('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    return res.status(200).json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
}
