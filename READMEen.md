# ARG Project — README

## 1. Project Description

This project is an interactive web-based project that supported an ARG (Alternate Reality Game). The repository includes various HTML pages, JavaScript logic, and assets to create animmersive experience for users. The project also features a backend API for managing user sessions, progress tracking, and secure file handling.

Key features:
- Web-based puzzles and challenges
- ARG-inspired gameplay mechanics
- Backend API for session management and progress tracking
- Minimal file security measures to protect sensitive data
- Integration of multimedia assets (audio, video, and images) for an enhanced user experience

Main technologies: HTML, CSS, JavaScript, Firebase Firestore, and Node.js (serverless-style API).

Goal: Provide a platform for users to solve puzzles and progress through an ARG-inspired storyline.

## 2. Learning Outcomes

- **Web Puzzles**
  - **Context**: Needed to design and implement interactive puzzles for users to solve.
  - **Action**: Created various HTML pages with JavaScript logic to handle puzzle mechanics and user interactions.
  - **Result**: Gained experience in designing and implementing web-based puzzles.

- **Understanding ARG Mechanics**
  - **Context**: Explored the principles of Alternate Reality Games to create an immersive experience.
  - **Action**: Integrated ARG elements such as hidden clues, narrative progression, and user engagement strategies.
  - **Result**: Developed a deeper understanding of ARG design and its application in web projects.

- **Basic File Security**
  - **Context**: Needed to ensure minimal security for sensitive files that users shouldn't access directly.
  - **Action**: Implemented measures such as server-side session management and restricted access to certain files.
  - **Result**: Improved knowledge of basic file security practices and their implementation.

- **Progression in JavaScript**
  - **Context**: Enhanced JavaScript programming skills through backend development and API integration.
  - **Action**: Worked on JavaScript-based backend logic for managing user sessions and progress tracking.
  - **Result**: Strengthened JavaScript programming skills and backend development expertise.

## 3. How to Run and Use

To experience the project, simply open the HTML files in a browser. For a complete experience, ensure the backend API is running to handle user sessions and progress tracking.

### Environment Variables (for the API)

Create a `.env` file or set environment variables in your hosting provider with the following values:

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### Run Locally (Development)

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```
3. Open the project in your browser.

## 4. Project Structure

- `index.html`, `page1.html`, `page2.html`, ... — Puzzle pages
- `assets/` — Static assets (CSS, JavaScript, images, audio, video)
- `api/` — Backend API for session management and progress tracking
- `package.json` — Dependency list and start script

## 5. Troubleshooting & Notes

- Ensure all required environment variables are set before running the API — missing Firebase credentials will cause API calls to fail.
- For local testing, use a tool like `http-server` or a similar development server to serve the files.
- If deploying to a platform like Vercel, ensure the `api/` folder is treated as serverless functions.

## 6. License & Credits

See LICENSE file.