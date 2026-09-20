 * Script to assign Firebase Custom Claim { "admin": true } to yuvrajsinghtomar0987@gmail.com
 * using the Firebase Admin SDK.
 * 
 * Usage:
 *   node backend/scripts/set-admin-claim.js [email]
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { setAdminCustomClaimByEmail } = require('../src/config/firebase');

const targetEmail = process.argv[2] || process.env.ADMIN_EMAIL || 'yuvrajsinghtomar0987@gmail.com';

async function main() {
  console.log('====================================================');
  console.log(`Setting Firebase Custom Claim { admin: true }`);
  console.log(`Target User: ${targetEmail}`);
  console.log('====================================================');

  try {
    const result = await setAdminCustomClaimByEmail(targetEmail, true);
    console.log('\nSUCCESS!');
    console.log(`- UID: ${result.uid}`);
    console.log(`- Email: ${result.email}`);
    console.log(`- Custom Claims: ${JSON.stringify(result.customClaims)}`);
    console.log('\nIMPORTANT NOTE:');
    console.log('Firebase Custom Claims are embedded in the user\'s ID Token (JWT).');
    console.log('The user must sign out and sign in again, or execute:');
    console.log('  auth.currentUser.getIdToken(true)');
    console.log('to refresh the token and receive the new { admin: true } claim.');
    process.exit(0);
  } catch (error) {
    console.error('\nFAILED to set admin claim:');
    console.error(error.message);
    if (error.code === 'auth/user-not-found') {
      console.error(`User with email "${targetEmail}" does not exist in Firebase Auth yet.`);
      console.error('Please create or register the user in Firebase Auth first.');
    }
    process.exit(1);
  }
}

main();
