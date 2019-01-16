import {
  app,
  BrowserWindow
} from 'electron' // eslint-disable-line

const WIDEVINE_VERSION = '4.10.1196.0';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g,
    '\\\\') // eslint-disable-line
}

// Add Widevine support
addWidevine(app);

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
  'http://localhost:9080' :
  `file://${__dirname}/index.html`;

console.log(winURL)

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: false,
    width: 1000,
    webPreferences: {
      plugins: true
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function addWidevine(app) {
  // TODO: make this configurable-by-platform
  app.commandLine.appendSwitch('widevine-cdm-path',
    `${__dirname}/assets/widevine/win64/widevinecdm.dll`);
  app.commandLine.appendSwitch('widevine-cdm-version', WIDEVINE_VERSION);

  // app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
  // app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
}
