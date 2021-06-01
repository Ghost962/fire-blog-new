import firebase from "firebase/app"
import "firebase/firestore"

var firebaseConfig = {
    apiKey: "AIzaSyB2aH3tQpuDdLhAdKYDEmOsmnPG2w4HGuw",
    authDomain: "fireblogs-79ba1.firebaseapp.com",
    projectId: "fireblogs-79ba1",
    storageBucket: "fireblogs-79ba1.appspot.com",
    messagingSenderId: "775607116933",
    appId: "1:775607116933:web:ba6d2c58d5d99fa3bfb5ec"
};
const fierbaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {timestamp};
export default fierbaseApp.firestore();