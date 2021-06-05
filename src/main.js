import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue2Editor from "vue2-editor";
import firebase from "firebase/app";
import "firebase/auth"

Vue.use(Vue2Editor);

Vue.config.productionTip = false;


// this bit of code will address the problem with the application and firebase not being in sync
let app;
firebase.auth().onAuthStateChanged(() => {
    // if app is not true means the app is not initialized yet
    if (!app) {
        // then we go and initialized our application here
        new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount("#app");
    }
})

