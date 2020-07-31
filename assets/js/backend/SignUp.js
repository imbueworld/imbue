import Firebase from "firebase/app"
import 'firebase/auth'



export function signUp(form) {
    const em = form.email // sanitizeEmail(form.email)
    const pw = form.password // sanitizePassword(form.password)
    Firebase.auth().createUserWithEmailAndPassword(em, pw)
        .then(() => {
            Firebase.auth().currentUser.updateProfile({
                displayName: `${form.first} ${form.last}`,
            })
            .catch(handleErr)
        })
        .catch(handleErr)
}



const handleErr = err => {
    console.log(err.code)
    console.log(err.message)
}

// function sanitizeEmail(email) {
//     return email
// }

// function sanitizePassword(password) {
//     return password
// }
