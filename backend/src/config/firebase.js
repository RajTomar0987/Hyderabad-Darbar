const { initializeApp, getApps, getApp, cert, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const admin = require('firebase-admin');

let firebaseApp = null;
let firebaseAuth = null;

/**
 * Parses and formats a private key string, unescaping newlines if necessary.
 * @param {string} key 
 * @returns {string}
 */
const formatPrivateKey = (key) => {
  if (!key) return '';
  let formatted = key.trim();
  // Remove wrapping single or double quotes
  if ((formatted.startsWith('"') && formatted.endsWith('"')) ||
      (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  // Replace literal '\n' sequences with real newlines
  return formatted.replace(/\\n/g, '\n');
};

/**
 * Initializes the Firebase Admin SDK safely using environment variables.
 */
const initializeFirebaseAdmin = () => {
  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseApp = existingApps[0];
      firebaseAuth = getAuth(firebaseApp);
      return;
    }

    let credential = null;
    let projectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID;

    // 1. Check for individual Render environment variables (FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY)
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (clientEmail && privateKeyRaw) {
      const privateKey = formatPrivateKey(privateKeyRaw);
      credential = cert({
        projectId: projectId || 'hyderabad-darbar-restro',
        clientEmail: clientEmail.trim(),
        privateKey
      });
      if (!projectId) {
        projectId = 'hyderabad-darbar-restro';
      }
    }
    // 2. Check for full service account key (JSON string, base64 string, or file path)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
      const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT).trim();
      let serviceAccount = null;

      if (raw.startsWith('{')) {
        serviceAccount = JSON.parse(raw);
      } else {
        // Try base64 decoding first
        try {
          const decoded = Buffer.from(raw, 'base64').toString('utf8');
          if (decoded.trim().startsWith('{')) {
            serviceAccount = JSON.parse(decoded);
          }
        } catch {
          // Fall through to file require
        }

        // If not base64 JSON, try requiring as a file path
        if (!serviceAccount) {
          serviceAccount = require(raw);
        }
      }

      if (serviceAccount) {
        credential = cert(serviceAccount);
        projectId = projectId || serviceAccount.project_id;
      }
    }
    // 3. Check for standard Google Application Default Credentials
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = applicationDefault();
    }

    // Initialize with valid credentials if resolved
    if (credential) {
      firebaseApp = initializeApp({
        credential,
        projectId: projectId || undefined
      });
      firebaseAuth = getAuth(firebaseApp);
      console.log(`[Firebase Admin] Initialized successfully for project: ${projectId || 'default'}`);
    } else {
      // Clear notice when running without server-side credentials
      console.log('[Firebase Admin] Notice: No Firebase Admin credentials found in environment variables.');
      console.log('[Firebase Admin] Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY on Render to enable live token verification.');
    }
  } catch (err) {
    console.error('[Firebase Admin] Initialization error:', err.message);
    firebaseApp = null;
    firebaseAuth = null;
  }
};

// Run initialization once at startup
initializeFirebaseAdmin();

/**
 * Verifies a Firebase ID token using Firebase Admin SDK
 * @param {string} idToken 
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
const verifyFirebaseToken = async (idToken) => {
  if (!firebaseAuth) {
    throw new Error(
      'Firebase Admin SDK is not initialized. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in Render environment variables.'
    );
  }
  return await firebaseAuth.verifyIdToken(idToken);
};

module.exports = {
  admin,
  firebaseApp,
  firebaseAuth,
  initializeFirebaseAdmin,
  verifyFirebaseToken
};
