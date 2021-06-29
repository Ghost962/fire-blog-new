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
        blogPosts: [],
        postLoaded: null,
        blogHTML: "Write your blog title here...",
        blogTitle: "",
        blogPhotoName: "",
        blogPhotoFileURL: null,
        blogPhotoPreview: null,
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
    getters: {
        blogPostsFeed(state) {
            return state.blogPosts.slice(0, 2);
        },
        blogPostsCards(state) {
            return state.blogPosts.slice(2, 6);
        },
    },
    mutations: {
        newBlogPost(state, payload) {
            state.blogHTML = payload
        },
        updateBlogTitle(state, payload) {
            state.blogTitle = payload
        },
        fileNameChange(state, payload) {
            state.blogPhotoName = payload
        },
        createFileURL(state, payload) {
            state.blogPhotoFileURL = payload
        },
        openPhotoPreview(state) {
            state.blogPhotoPreview = !state.blogPhotoPreview
        },
        toggleEditPost(state, payload) {
            state.editPost = payload
        },
        setBlogState(state, payload) {
            state.blogTitle = payload.blogTitle;
            state.blogHTML = payload.blogHTML;
            state.blogPhotoFileURL = payload.blogPhotoFileURL;
            state.blogPhotoName = payload.blogCoverPhotoName;
        },
        filterBlogPost(state, payload) {
            state.blogPosts = state.blogPosts.filter((post) => post.blogID !== payload)
        },
        updateUser(state, payload) {
            state.user = payload
        },
        setProfileAdmin(state, payload) {
            state.profileAdmin = payload;
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
            commit('setProfileAdmin', admin)
        },
        async getPost({state}) {
            const dataBase = await db.collection('blogPosts').orderBy('date', 'desc');
            const dbResults = await dataBase.get(); // returns an array of items
            // so to iterate through these we need foreach
            dbResults.forEach((doc) => {
                // make sure if we call this function we dont add the same blog post twice so we add a filter
                if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
                    // post not exist so we will add this post to the blog
                    const data = {
                        blogID: doc.data().blogID,
                        blogHTML: doc.data().blogHTML,
                        blogCoverPhoto: doc.data().blogCoverPhoto,
                        blogTitle: doc.data().blogTitle,
                        blogDate: doc.data().date,
                        blogCoverPhotoName: doc.data().blogCoverPhotoName,
                    };
                    // push this post to the array
                    state.blogPosts.push(data);
                }
            });
            state.postLoaded = true;
        },
        async updatePost({commit, dispatch}, payload) {
            commit("filterBlogPost", payload);
            await dispatch("getPost");
        },
        async deletePost({commit}, payload) {
            const getPost = await db.collection("blogPosts").doc(payload);
            await getPost.delete();
            commit("filterBlogPost", payload)
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
