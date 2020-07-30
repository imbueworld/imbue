import Firebase from 'firebase/app'
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

    Firebase.initializeApp(firebaseConfig)
    // Firebase.analytics()



    Firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let displayName = user.displayName // null
            // ...
            let providerData = user.providerData // a Dto with lots of info

            console.log("User just signed in!")
            console.log(user.email)
        } else {
            console.log("User just signed out.")
        }
    })
}

function sanitizeEmail(email) {
    return email
}

function sanitizePassword(password) {
    return password
}

export function signUp(email, password) {
    const em = sanitizeEmail(email)
    const pw = sanitizePassword(password)
    return Firebase.auth().createUserWithEmailAndPassword(em, pw)
}

export function signIn(email, password) {
    // Could sanitize as well
    return Firebase.auth().signInWithEmailAndPassword(email, password)
}

// export function runChecker() {
//     Firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             // User is signed in.
//             let displayName = user.displayName // null
//             let email = user.email
//             let emailVerified = user.emailVerified // false
//             let photoURL = user.photoURL // null
//             let isAnonymous = user.isAnonymous // false
//             let uid = user.uid
//             let providerData = user.providerData // a Dto with lots of info
//             console.log("User just signed in!")
//             console.log(email)
//         } else {
//             console.log("User just signed out.")
//         }
//     })
// }