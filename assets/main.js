// JS extrait de index.html, sans commentaires
const sons = [
  'Sons/Son1.MP3',
  'Sons/Son2.MP3',
  'Sons/Son3.MP3',
  'Sons/Son4.MP3',
  'Sons/Son5.MP3',
  'Sons/Son6.MP3',
  'Sons/Son7.MP3',
  'Sons/Son8.MP3',
  'Sons/Son9.MP3'
];
function playRandomSon() {
  const randomIndex = Math.floor(Math.random() * sons.length);
  const son = sons[randomIndex];
  const audio = new Audio(son);
  audio.volume = 1.0;
  audio.play();
}
let sonAutoEnabled = false;
function enableAutoSon() {
  if (sonAutoEnabled) return;
  sonAutoEnabled = true;
  playRandomSon();
  setTimeout(() => {
    playRandomSon();
    setInterval(playRandomSon, 10 * 60 * 1000);
  }, 10 * 60 * 1000);
  document.removeEventListener('click', enableAutoSon);
  if (window.loginBtn) loginBtn.removeEventListener('click', enableAutoSon);
}
document.addEventListener('click', enableAutoSon);
if (window.loginBtn) loginBtn.addEventListener('click', enableAutoSon);
const glitchWords = [
  /vtuberfr/gi,
  /vtubers/gi,
  /vtuber/gi,
  /virtuel(le)?s?/gi,
  /informatique/gi,
  /programmation/gi,
  /code/gi,
  /hacker/gi,
  /ordinateur/gi,
  /serveur/gi,
  /logiciel/gi,
  /script/gi,
  /bot/gi
];
function wrapGlitchWords(node) {
  if (node.nodeType === 3) {
    let replaced = false;
    let text = node.nodeValue;
    glitchWords.forEach(re => {
      text = text.replace(re, match => {
        replaced = true;
        return `<span class=\"glitch-link\">${match}</span>`;
      });
    });
    if (replaced) {
      const temp = document.createElement('span');
      temp.innerHTML = text;
      while (temp.firstChild) node.parentNode.insertBefore(temp.firstChild, node);
      node.parentNode.removeChild(node);
    }
  } else if (node.nodeType === 1 && node.childNodes && !['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT'].includes(node.tagName)) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      wrapGlitchWords(node.childNodes[i]);
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  wrapGlitchWords(document.body);
  glitchifyElementText('#loginBtn');
  glitchifyElementText('#loginModal h2');
  glitchifyElementText('#loginModal p');
  // Login popup management
  const loginBtn = document.getElementById('loginBtn');
  const loginOverlay = document.getElementById('loginOverlay');
  const cancelBtn = document.getElementById('cancelBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorMessage = document.getElementById('errorMessage');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const modal = document.getElementById('loginModal');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginOverlay.style.display = 'flex';
      errorMessage.style.display = 'none';
      setTimeout(() => { usernameInput.focus(); }, 100);
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      loginOverlay.style.display = 'none';
      errorMessage.style.display = 'none';
    });
  }
  if (loginOverlay) {
    loginOverlay.addEventListener('click', (e) => {
      if (e.target === loginOverlay) {
        loginOverlay.style.display = 'none';
        errorMessage.style.display = 'none';
      }
    });
  }
  function handleLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
  // Secure authentication via backend API
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) {
        window.location.href = 'dashboard.html';
      } else {
        errorMessage.style.display = 'block';
        modal.style.animation = 'shake 0.5s';
        setTimeout(() => { modal.style.animation = ''; }, 500);
      }
    })
    .catch(() => {
      errorMessage.style.display = 'block';
      modal.style.animation = 'shake 0.5s';
      setTimeout(() => { modal.style.animation = ''; }, 500);
    });
  }
  if (submitBtn) submitBtn.addEventListener('click', handleLogin);
  [usernameInput, passwordInput].forEach(input => {
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleLogin();
        }
      });
    }
  });
  const style = document.createElement('style');
  style.innerHTML = `@keyframes shake {0% { transform: translateX(0); }20% { transform: translateX(-10px); }40% { transform: translateX(10px); }60% { transform: translateX(-10px); }80% { transform: translateX(10px); }100% { transform: translateX(0); }}`;
  document.head.appendChild(style);
});
function glitchifyElementText(selector) {
  document.querySelectorAll(selector).forEach(el => {
    if (!el.classList.contains('glitch-link')) {
      el.classList.add('glitch-link');
      el.dataset.original = el.textContent;
    }
  });
}
function toBinary(str) {
  return str.split('').map(c => c === ' ' ? ' ' : Math.round(Math.random()) ).join('');
}
function toGlitch(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?/[]{}|~';
  return str.split('').map(c => {
    if (c === ' ') return ' ';
    if (Math.random() < 0.5) return chars[Math.floor(Math.random() * chars.length)];
    return c;
  }).join('');
}
function animateGlitchLinks() {
  document.querySelectorAll('.glitch-link').forEach(span => {
    if (!span.dataset.original) {
      span.dataset.original = span.textContent;
    }
    const r = Math.random();
    if (r < 0.9) {
      span.textContent = span.dataset.original;
    } else if (r < 0.95) {
      span.textContent = toBinary(span.dataset.original);
    } else {
      span.textContent = toGlitch(span.dataset.original);
    }
  });
}
setInterval(animateGlitchLinks, 200);
