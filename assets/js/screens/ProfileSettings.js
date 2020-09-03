import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Keyboard } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import auth from "@react-native-firebase/auth"
import { retrieveUserData } from '../backend/CacheFunctions'
import { updateUser } from '../backend/BackendFunctions'
import { handleAuthError } from '../backend/HelperFunctions'



export default function ProfileSettings(props) {
    let cache = props.route.params.cache
    console.log(cache)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
        }
        init()
    }, [])

    useEffect(() => {
        if (!user) return

        setFirstNameField(user.first)
        setLastNameField(user.last)
        setEmailField(user.email)
    }, [user])

    const [redFields, setRedFields] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [changing, change] = useState("safeInfo") // || "password"

    const [firstNameField, setFirstNameField] = useState("")
    const [lastNameField, setLastNameField] = useState("")
    const [emailField, setEmailField] = useState("")
    const [passwordField, setPasswordField] = useState("")

    const [changePasswordField, setChangePasswordField] = useState("")
    const [changePasswordFieldConfirm, setChangePasswordFieldConfirm] = useState("")

    async function updateSafeInfo() {
        setRedFields([])
        setErrorMsg("")
        setSuccessMsg("")
        let redFields = []

        // if (firstNameField.length === 0) setRedFields([...redFields, "first"])
        // if (lastNameField.length === 0) setRedFields([...redFields, "last"])
        // if (emailField.length === 0) setRedFields([...redFields, "email"])
        // if (passwordField.length === 0) setRedFields([...redFields, "main_password"])
        if (firstNameField.length === 0) redFields.push("first")
        if (lastNameField.length === 0) redFields.push("last")
        if (emailField.length === 0) redFields.push("email")
        if (passwordField.length === 0) redFields.push("main_password")

        setRedFields(redFields)
        if (redFields.length) {
            setErrorMsg("Required fields need to be filled.")
            return
        }

        try {
            await auth().signInWithEmailAndPassword(user.email, passwordField)
            let updatables = {}

            if (firstNameField !== user.first) updatables.first = firstNameField
            if (lastNameField !== user.last) updatables.last = lastNameField
            if (emailField !== user.email) {
                updatables.email = emailField
                await auth().currentUser.updateEmail(emailField)
            }

            if (!Object.keys(updatables).length) {
                setSuccessMsg("All information is up to date.")
                return
            }

            await updateUser(cache, updatables),

            setSuccessMsg("Successfully updated profile information.")
            setPasswordField("")
            Keyboard.dismiss()
        } catch(err) {
            let [errorMsg, redFields] = handleAuthError(err)
            setRedFields(redFields)
            setErrorMsg(errorMsg)
        }
    }

    async function updatePassword() {
        setRedFields([])
        setErrorMsg("")
        setSuccessMsg("")
        let redFields = []

        if (changePasswordField.length === 0) redFields.push("change_password")
        if (changePasswordFieldConfirm.length === 0) redFields.push("change_password_confirm")
        if (passwordField.length === 0) redFields.push("main_password")

        if (redFields.length) {
            setErrorMsg("Required fields need to be filled.")
            setRedFields(redFields)
            return
        }

        if (changePasswordField !== changePasswordFieldConfirm) {
            setErrorMsg("Passwords do not match.")
            setRedFields(["change_password", "change_password_confirm"])
            return
        }
        
        try {
            await auth().signInWithEmailAndPassword(user.email, passwordField)
            await auth().currentUser.updatePassword(changePasswordField)
            setSuccessMsg("Successfully changed password.")
            setChangePasswordField("")
            setChangePasswordFieldConfirm("")
            setPasswordField("")
            Keyboard.dismiss()
        } catch(err) {
            let [errorMsg, redFields] = handleAuthError(err)
            setRedFields(redFields)
            setErrorMsg(errorMsg)
        }
    }

    if (!user) return <View />

    return (
        <>
        {/* { pwForm
        ?   <View style={{
                width: "85%",
                height: "100%",
                position: "absolute",
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 200,
            }}>
                <PasswordConfirmation
                    onSuccess={changePassword}
                    onX={() => setPwForm(false)}
                />
            </View>
        :   <View />} */}

        {/* <PasswordConfirmation
            capsuleStyle={{
                // marginTop: 10,
                marginVertical: 10,
            }}
            onSuccess={changePassword}
            onFail={setFormState}
            onX={() => setPwForm(false)}
        /> */}

        <ProfileLayout
            cache={cache}
            innerContainerStyle={{
                paddingBottom: 10,
            }}
            data={{ name: user.name , iconUri: user.icon_uri_full }}
            buttonOptions={{
                editPfp: {
                    show: true,
                },
            }}
        >
            {changing === "safeInfo"
            ?   <CustomButton
                    style={styles.button}
                    textStyle={styles.buttonText}
                    title="Change password"
                    onPress={() => change("password")}
                />
            :   <CustomButton
                    style={styles.button}
                    textStyle={styles.buttonText}
                    title="Change profile data"
                    onPress={() => change("safeInfo")}
                />}

            {errorMsg
            ?   <Text style={{ color: "red" }}>{errorMsg}</Text>
            :   <Text style={{ color: "green" }}>{successMsg}</Text>}

            {changing === "safeInfo"
            ?   <>
                <CustomTextInput
                    containerStyle={{
                        borderColor: redFields.includes("first")
                            ? "red" : undefined
                    }}
                    placeholder="First Name"
                    value={firstNameField}
                    onChangeText={setFirstNameField}
                />
                <CustomTextInput
                    containerStyle={{
                        borderColor: redFields.includes("last")
                            ? "red" : undefined
                    }}
                    placeholder="Last Name"
                    value={lastNameField}
                    onChangeText={setLastNameField}
                />
                <CustomTextInput
                    containerStyle={{
                        borderColor: redFields.includes("email")
                            ? "red" : undefined
                    }}
                    placeholder="Email"
                    value={emailField}
                    onChangeText={setEmailField}
                />
                </>
            :   null}

            {changing === "password"
            ?   <>
                <CustomTextInput
                    containerStyle={{
                        borderColor: redFields.includes("change_password")
                            ? "red" : undefined
                    }}
                    placeholder="Password"
                    value={changePasswordField}
                    onChangeText={setChangePasswordField}
                />
                <CustomTextInput
                    containerStyle={{
                        borderColor: redFields.includes("change_password_confirm")
                            ? "red" : undefined
                    }}
                    placeholder="Password Confirmation"
                    value={changePasswordFieldConfirm}
                    onChangeText={setChangePasswordFieldConfirm}
                />
                </>
            :   null}
            
            
            <CustomTextInput
                containerStyle={{
                    borderColor: redFields.includes("password")
                        ? "red" : undefined
                }}
                placeholder="Current Password"
                value={passwordField}
                onChangeText={setPasswordField}
            />
            {/* <CustomTextInput
                placeholder="Confirm Password"
                value={confPasswordField}
                onChangeText={setConfPasswordField}
            /> */}

            <CustomButton
                style={styles.button}
                title="Save"
                onPress={() => {
                    if (changing === "safeInfo") {
                        updateSafeInfo()
                    } else if (changing === "password") {
                        updatePassword()
                    }
                }}
            />
        </ProfileLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        marginHorizontal: 30,
    },
    buttonText: {
        fontSize: 14,
    },
})