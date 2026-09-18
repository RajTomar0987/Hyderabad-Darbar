const admin = require('firebase-admin');
const config = require('./index');

let firebaseApp = null;
let firebaseAuth = null;

try {
  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
  } else {
    // 1. Check if explicit service account json/path is supplied
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch {
        // Assume file path
        serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      }
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
      });
    } else {
      // 2. Initialize with Project ID (or Google Application Default Credentials)
      const projectId = process.env.FIREBASE_PROJECT_ID || 'hyderabad-darbar-restro';
      firebaseApp = admin.initializeApp({
        projectId
      });
    }
  }

  firebaseAuth = admin.auth(firebaseApp);
  console.log('[Firebase Admin] Initialized successfully for project:', firebaseApp.options.projectId || 'hyderabad-darbar-restro');
} catch (err) {
  console.warn('[Firebase Admin] Warning during initialization:', err.message);
  try {
    firebaseAuth = admin.auth();
  } catch {
    firebaseAuth = null;
  }
}

/**
 * Verifies a Firebase ID token using Firebase Admin SDK
 * @param {string} idToken 
 * @returns {Promise<admin.auth.DecodedIdToken>}
 */
const verifyFirebaseToken = async (idToken) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK is not initialized.');
  }
  return await firebaseAuth.verifyIdToken(idToken);
};

module.exports = {
  admin,
  firebaseAuth,
  verifyFirebaseToken
};
