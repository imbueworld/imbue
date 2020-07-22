import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomLabel from "../components/CustomLabel"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    function bookClass() {
        console.log("BOOK A CLASS ACTION")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.genres}>
                    <CustomLabel style={styles.genreLabel}>Genre 1</CustomLabel>
                    <CustomLabel style={styles.genreLabel}>Genre 2</CustomLabel>
                    <CustomLabel style={styles.genreLabel}>Genre 3</CustomLabel>
                </View>
                    <CustomLabel>(DESCRIPTION) | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</CustomLabel>
                <CustomButton
                    title="Book A Class"
                    onPress={bookClass}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    content: {
        width: "85%",
    },
    genres: {
        flexDirection: "row",
        flex: 0,
        flexGrow: 0,
    },
    genreLabel: {
        paddingVertical: 4,
        marginRight: 10,
    },
})