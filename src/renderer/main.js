import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './App';
import routes from './router';
import store from './store';
import ElementUI from 'element-ui';
import globalTools from './libs/global';
import './assets/element/element-variables.scss';
import './assets/icon/iconfont.css';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.config.productionTip = false;

const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
};

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes
});

Vue.use(globalTools, router);

Vue.use(ElementUI, {size: 'small'});
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');