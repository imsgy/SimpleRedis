import {ipcRenderer} from 'electron';

document.addEventListener('contextmenu', function (e) {
    // 右键事件触发
    e.preventDefault();
    ipcRenderer.send('contextMenu');
});

export default [
    {
        path: '/',
        name: 'index-page',
        component: require('@/components/index-page').default,
        beforeEnter: (to, from, next) => {
            ipcRenderer.send('changeWindowSize', {width: 1200, height: 900});
            next()
        }
    },
    {
        path: '/main',
        name: 'main-page',
        component: require('@/components/main-page').default,
        beforeEnter: (to, from, next) => {
            ipcRenderer.send('changeWindowSize', {width: 1200, height: 900});
            next()
        }
    },
]