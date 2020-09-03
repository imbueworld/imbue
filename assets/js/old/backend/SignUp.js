import { defIcons } from "../contexts/Links"
import firebase from "firebase/app"
import 'firebase/auth'



export async function signUp(form) {
    try {
        const em = form.email // sanitizeEmail(form.email)
        const pw = form.password // sanitizePassword(form.password)
        const { user } = await firebase.auth().createUserWithEmailAndPassword(em, pw)
        // await user.updateProfile({
        //     displayName: `${form.first} ${form.last}`,
        //     photoURL: defIcons[0],
        // })
        return "200 OK"
    } catch(err) {
        console.log("////////")
        console.log(err.code)
        console.log(err.message)
        console.log("////////")
        return err.code
    }
}

// function sanitizeEmail(email) {
//     return email
// }

// function sanitizePassword(password) {
//     return password
// }
