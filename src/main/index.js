import {ipcMain, app, BrowserWindow, Menu} from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// 窗口菜单快捷键
const template = [
    {
        label: "SimpleRedis",
        submenu: [
            {role: "about", label: "关于"},
            {type: "separator"},
            {role: 'hide', label: "隐藏"},
            {role: 'unhide', label: "显示全部"},
            {role: 'hideothers', label: "隐藏其他应用"},
            {type: "separator"},
            {role: 'quit', label: "退出"},
        ]
    },
    {
        label: "编辑",
        submenu: [
            {label: "撤销", role: "undo"},
            {label: "恢复", role: "redo"},
            {type: "separator"},
            {label: "剪切", role: "cut"},
            {label: "复制", role: "copy"},
            {label: "粘贴", role: "paste"},
            {label: "全选", role: "selectAll"}
        ]
    },
    {
        label: "视图",
        submenu: [
            {role: 'reload', label: "刷新"},
            // {role: 'forcereload', label: "强制刷新"},
            {type: 'separator'},
            {role: 'resetzoom', label: "重置"},
            {role: 'zoomin', label: "放大"},
            {role: 'zoomout', label: "缩小"},
            {type: 'separator'},
            {role: 'togglefullscreen', label: "全屏"},
            {type: 'separator'},
            // {role: 'toggledevtools', label: "控制台"}
        ]
    },
    {
        label: '窗口',
        submenu: [
            {role: 'zoom', label: "缩放"},
            {type: 'separator'},
            {role: 'close', label: "关闭"},
            {type: 'separator'},
            {role: 'minimize', label: "最小化"}
        ]
    },
    {
        label: "帮助",
        submenu: [
            {
                label: '更多',
                click: async () => {
                    const {shell} = require('electron');
                    await shell.openExternal('https://electronjs.org')
                }
            },
            {type: 'separator'},
            {
                label: '报告'
            }
        ]
    }
];

// 右键快捷事件
const contextMenuTemplate = [
    {
        label: '撤销',
        role: 'undo',
    },
    {
        label: '恢复',
        role: 'redo',
    },
    {
        type: 'separator',
    },
    {
        label: '截切',
        role: 'cut',
    },
    {
        label: '复制',
        role: 'copy',
    },
    {
        label: '黏贴',
        role: 'paste',
    },
    {
        type: 'separator',
    },
    {
        label: '全选',
        role: 'selectall',
    },
];


if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    //菜单栏快捷键设置
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    mainWindow = new BrowserWindow({
        height: 1000,
        useContentSize: true,
        width: 1000
    });
    // 主进程监听消息
    ipcMain.on('changeWindowSize', (event, arg) => {
        mainWindow && mainWindow.setSize(arg.width, arg.height)
    });

    // 监听右键事件
    ipcMain.on('contextMenu', () => {
        contextMenu.popup(BrowserWindow.getFocusedWindow());
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
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
