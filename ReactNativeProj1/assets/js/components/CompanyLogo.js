import React from 'react'
import { StyleSheet, Text, View, Button, Image } from 'react-native'



export default function CompanyLogo(props) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require("./img/imbue-logo.webp")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    imageContainer: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#00000044",
    },
    image: {
        width: 325, // "325px", // "143px",
        height: 325, // "325px", // "143px",
    },
})