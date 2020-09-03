import firebase from 'firebase/app'
// import 'firebase/analytics'
import 'firebase/auth'



export function initFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyBjP2VSTSNfScD2QsEDN1loJf8K1IlM_xM",
        authDomain: "spring-ranger-281214.firebaseapp.com",
        databaseURL: "https://spring-ranger-281214.firebaseio.com",
        projectId: "spring-ranger-281214",
        storageBucket: "spring-ranger-281214.appspot.com",
        messagingSenderId: "736868821",
        appId: "1:736868821:web:58fd8a8cb3d868cac5e55c",
        measurementId: "G-0FYZ1KH1H5",
    }

    firebase.initializeApp(firebaseConfig)
    // firebase.analytics()
}