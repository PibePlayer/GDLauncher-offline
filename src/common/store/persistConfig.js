import * as localForage from 'localforage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'gdlauncher',
  version: 1.0,
  storeName: 'gdlauncher_persist'
});

export default {
  key: 'root',
  storage: createElectronStorage({
    electronStoreOpts: {
      name: 'config',
      // This is used to ensure integrity, not for security reasons
      encryptionKey: 'KoalaLauncher',
      fileExtension: ''
    }
  }),
  whitelist: ['settings', 'app']
};
