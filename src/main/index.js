import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, Menu, MenuItem, app, ipcMain, shell } from 'electron';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';

global.QUOTE = '"';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 920,
    height: 670,
    show: false,
    //autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const menu = new Menu()
menu.append(
  new MenuItem({
    label: 'Electron',
    submenu: [
      {
        role: 'toggleDevTools', // toggleDevTools seçeneğini burada ekliyorsunuz.
        accelerator: 'F8',
        label: 'Geliştirici Konsolu',
        click: () => {
          mainWindow.webContents.toggleDevTools(); // Ana pencerenin webContents nesnesinin toggleDevTools() metodunu çağırarak DevTools'u açıp kapatabilirsiniz.
        }
      },
      {
        role: 'reload', // toggleDevTools seçeneğini burada ekliyorsunuz.
        label: 'Yenile',
        accelerator: 'F5',
      }

    ]
  })
)


Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
