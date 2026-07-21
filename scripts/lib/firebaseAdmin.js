// Shared Admin SDK bootstrap for one-off scripts. Reuses the currently
// logged-in `firebase login` session (via the Firebase CLI's own public
// OAuth client) instead of requiring a separate service account key per
// project — run `firebase login` first if this errors.
//
// The underlying @google-cloud/firestore client only reads ADC from a file
// on disk (GOOGLE_APPLICATION_CREDENTIALS), so we materialize one here.
const fs = require('fs');
const path = require('path');
const os = require('os');
const admin = require('firebase-admin');

const PROJECTS = {
  prod: 'hanguk-learning-app',
  qa: 'hanguk-learning-qa',
};

let adcPath = null;

function useFirebaseToolsAdc() {
  if (adcPath) return adcPath;
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  const { tokens } = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const adc = {
    client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
    client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
    refresh_token: tokens.refresh_token,
    type: 'authorized_user',
  };
  adcPath = path.join(os.tmpdir(), 'hanguk-scripts-adc.json');
  fs.writeFileSync(adcPath, JSON.stringify(adc));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = adcPath;
  return adcPath;
}

function cleanupAdc() {
  if (adcPath) fs.rmSync(adcPath, { force: true });
}

const apps = {};
function getDb(projectKeyOrId) {
  const projectId = PROJECTS[projectKeyOrId] ?? projectKeyOrId;
  useFirebaseToolsAdc();
  if (!apps[projectId]) {
    apps[projectId] = admin.initializeApp(
      { credential: admin.credential.applicationDefault(), projectId },
      projectId
    );
  }
  return apps[projectId].firestore();
}

module.exports = { PROJECTS, useFirebaseToolsAdc, cleanupAdc, getDb };
