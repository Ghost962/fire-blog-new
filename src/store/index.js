import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase/app";
import "firebase/auth"
import db from "../firebase/firebaseInit"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sampleBlogCards: [
            {
                blogTitle: "Blog Card #1",
                blogCoverPhoto: "stock-1",
                blogDate: "May 1, 2021",
            },
            {
                blogTitle: "Blog Card #2",
                blogCoverPhoto: "stock-2",
                blogDate: "May 1, 2021",
            },
            {
                blogTitle: "Blog Card #3",
                blogCoverPhoto: "stock-3",
                blogDate: "May 1, 2021",
            },
            {
                blogTitle: "Blog Card #4",
                blogCoverPhoto: "stock-4",
                blogDate: "May 1, 2021",
            },
        ],
        editPost: null,
        user: null,
        profileAdmin: null,
        profileEmail: null,
        profileFirstName: null,
        profileLastName: null,
        profileUsername: null,
        profileId: null,
        profileInitials: null
    },
    mutations: {
        toggleEditPost(state, payload) {
            state.editPost = payload
            console.log(state.editPost)
        },
        updateUser(state, payload) {
            state.user = payload
        },
        setProfileAdmin(state, payload) {
            state.profileAdmin = payload;
            console.log(state.profileAdmin)
        },
        setProfileInfo(state, doc) {
            // the values doc.id & doc.data().email ...etc comes from our collection on firebase
            state.profileId = doc.id;
            state.profileEmail = doc.data().email;
            state.profileFirstName = doc.data().firstName;
            state.profileLastName = doc.data().lastName;
            state.profileUsername = doc.data().username;
        },
        setProfileInitials(state) {
            state.profileInitials =
                state.profileFirstName.match(/(\b\S)?/g).join("") +
                state.profileLastName.match(/(\b\S)?/g).join("");
        },
        changeFirstName(state, payload) {
            state.profileFirstName = payload
        },
        changeLastName(state, payload) {
            state.profileLastName = payload
        },
        changeUsername(state, payload) {
            state.profileUsername = payload
        },
    },
    actions: {
        async getCurrentUser({commit}, user) {
            // this bit of code will go and reach out to our collection, and its going to get the collection that
            // has the current user id that is logged into our application
            const dataBase = await db.collection("users").doc(firebase.auth().currentUser.uid);
            const dbResult = await dataBase.get(); // get the current user
            commit("setProfileInfo", dbResult);
            commit("setProfileInitials");
            const token = await user.getIdTokenResult();
            const admin = await token.claims.admin; // will return true if the user is admin
            console.log(token)
            console.log(admin)
            commit('setProfileAdmin', admin)
        },

        async updateUserSettings({commit, state}) {
            const dataBase = await db.collection("users").doc(state.profileId);
            await dataBase.update({
                firstName: state.profileFirstName,
                lastName: state.profileLastName,
                username: state.profileUsername
            });
            commit("setProfileInitials")
        }
    },
    modules: {}
})
