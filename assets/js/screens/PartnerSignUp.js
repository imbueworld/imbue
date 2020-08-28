import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import { initializeAccount } from '../backend/BackendFunctions'
import { handleAuthError } from '../backend/HelperFunctions'
import { fonts } from '../contexts/Styles'



export default function PartnerSignUp(props) {
    let cache = props.route.params.cache

    const [redFields, setRedFields] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [gymName, setGymName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    function invalidate() {
        let redFields = []
        if (!first) redFields.push("first")
        if (!last) redFields.push("last")
        if (!email) redFields.push("email")
        if (!gymName) redFields.push("gymName")
        if (!password) redFields.push("password")
        if (!passwordConfirm) redFields.push("passwordConfirm")

        if (redFields.length) {
            console.log(33, redFields)
            setRedFields(redFields)
            return "Required fields need to be filled."
        }

        if (password !== passwordConfirm) {
            setRedFields(["password", "passwordConfirm"])
            setPasswordConfirm("")
            return "Passwords did not match"
        }

        if (password.length < 8
            || !password.match(/[A-Z]/g)
            || !password.match(/[a-z]/g)) {
            setRedFields(["password", "passwordConfirm"])
            return "Password must consist of at least 8 characters, " +
                   "and at least 1 lowercase and uppercase letter."
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <Text style={{
                    marginTop: 20,
                    marginBottom: 20,
                    alignSelf: "center",
                    fontSize: 25,
                    color: colors.gray,
                    fontFamily: fonts.default,
                }}>Partner Sign Up</Text>

                {errorMsg
                    ? <Text style={{ color: "red" }}>{errorMsg}</Text>
                    : <Text style={{ color: "green" }}>{successMsg}</Text>}

                <View>
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("first") ? "red" : undefined,
                        }}
                        placeholder="First Name"
                        value={first}
                        onChangeText={setFirst}
                    />
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("last") ? "red" : undefined,
                        }}
                        placeholder="Last Name"
                        value={last}
                        onChangeText={setLast}
                    />
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("gymName") ? "red" : undefined,
                        }}
                        placeholder="Gym Name"
                        value={gymName}
                        onChangeText={setGymName}
                    />
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("email") ? "red" : undefined,
                        }}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("password") ? "red" : undefined,
                        }}
                        multiline={false}
                        secureTextEntry
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <CustomTextInput
                        containerStyle={{
                            borderColor: redFields.includes("passwordConfirm") ? "red" : undefined,
                        }}
                        multiline={false}
                        secureTextEntry
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                    />
                    <CustomButton
                        style={{
                            marginBottom: 20,
                        }}
                        title="Sign Up"
                        onPress={async () => {
                            setRedFields([])
                            setErrorMsg("")
                            setSuccessMsg("")

                            let errorMsg
                            try {
                                let type = "partner"

                                errorMsg = invalidate()
                                if (errorMsg) throw new Error(errorMsg)
                                
                                await initializeAccount(cache, { first, last, email, password, type })
                                setSuccessMsg("You've been signed up!")

                                await new Promise(r => setTimeout(r, 3000)) // sleep
                                props.navigation.navigate("Boot", { referrer: "PartnerSignUp" })
                            } catch (err) {
                                console.error(err)
                                // If not native (form) error, check for auth error
                                if (!errorMsg) {
                                    let [errorMsg, redFields] = handleAuthError(err)
                                    setRedFields(redFields)
                                    setErrorMsg(errorMsg)
                                    return
                                }
                                // Otherwise...
                                // setRedFields(redFields)
                                setErrorMsg(errorMsg)
                            }
                        }}
                    />
                </View>

            </CustomCapsule>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        width: "88%",
        marginBottom: 30,
        alignSelf: "center",
    },
})