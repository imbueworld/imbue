import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInput from "../components/CustomTextInput"



export default function Component(props) {
    return (
        <View style={styles.container}>
            <CustomTextInput
                placeholder="Credit Card Number"
            />
            <CustomTextInput
                placeholder="CCV"
            />
            <CustomTextInput
                placeholder="Expire Date"
            />
            <CustomTextInput
                placeholder="ZIP Code"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
})