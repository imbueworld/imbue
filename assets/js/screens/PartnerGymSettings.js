import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const [gymName, setGymName] = useState("")
    const [gymDesc, setGymDesc] = useState("")
    const [gymAddress, setGymAddress] = useState("")

    function moreInfo() {}
    function updateMemberships() {
        props.navigation.navigate("PartnerUpdateMemberships")
    }
    function done() {}

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <CustomTextInput
                    placeholder="Gym Name"
                    value={gymName}
                    onTextChange={setGymName}
                />
                <CustomTextInput
                    placeholder="Gym Description"
                    value={gymDesc}
                    onTextChange={setGymDesc}
                />
                <CustomTextInput
                    placeholder="Gym Address"
                    value={gymAddress}
                    onTextChange={setGymAddress}
                />
                <CustomButton
                    title="Update Memberships"
                    onPress={updateMemberships}
                />
                <CustomButton
                    title="More Information"
                    onPress={moreInfo}
                />
                <CustomButton
                    title="Done"
                    onPress={done}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "100%",
    },
    container: {
        width: "85%",
        alignSelf: "center",
    },
})