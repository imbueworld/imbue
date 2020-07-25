import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"



export default function Component(props) {
    function bookClass() {
        console.log("BOOK A CLASS ACTION")
    }

    const labels = ["Genre 1", "Genre 2", "Genre 3"].map((txt) => 
        <CustomCapsule
            style={styles.genreContainer}
            key={txt}
        >
            <Text>{txt}</Text>
        </CustomCapsule>
    )

    const desc = `(DESCRIPTION) | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={styles.container}>
                <CustomCapsule>

                    <Image
                        style={styles.gymImg}
                        source={require("../components/img/yoga.png")}
                    />

                    <Text style={{
                        marginVertical: 10,
                        textAlign: "center",
                        fontSize: 20,
                    }}>Corepower Yoga</Text>

                    <View style={styles.genres}>
                        {labels}
                    </View>

                    <CustomCapsule
                        style={styles.descContainer}
                    >
                        <Text>{desc}</Text>
                    </CustomCapsule>

                    <CustomButton
                        title="Book A Class"
                        onPress={bookClass}
                    />

                </CustomCapsule>
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
        paddingVertical: 50,
        alignSelf: "center",
    },
    genres: {
        flexDirection: "row",
    },
    genreContainer: {
        marginVertical: 10,
        marginRight: 10,
        paddingVertical: 5,
        backgroundColor: "lightgray",
        borderRadius: 999,
    },
    descContainer: {
        marginVertical: 10,
        backgroundColor: "lightgray",
    },
    gymImg: {
        flex: 1,
        // width: "100%",
        // height: "100%",
        minHeight: 300,
        maxHeight: 300,
        marginBottom: 10,
        borderRadius: 40,
    }
})