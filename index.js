const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  // Erstelle das Browser-Fenster.
  win = new BrowserWindow({
    frame: true,
    titleBarStyle: 'customButtonsOnHover',
    width: 1000,
    height: 800
  })

  // und Laden der index.html der App.
  // win.loadURL(url.format({
  //   pathname: path.join(node.__dirname, 'dist/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  win.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
    // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt. 
    // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // Unter macOS ist es üblich für Apps und ihre Menu Bar
  // aktiv zu bleiben bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (win === null) {
    createWindow()
  }
})