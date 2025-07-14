const { app, BrowserWindow, Tray } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  tray = new Tray('stopwatch.png')
  tray.setToolTip("Focus Timer")
  tray.on('click',()=>{
    win.isVisible()?win.hide():win.show();
  })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




