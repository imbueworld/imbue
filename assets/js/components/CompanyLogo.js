import React from 'react'
import { StyleSheet, Text, View, Button, Image } from 'react-native'



export default function CompanyLogo(props) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require("./img/imbue-logo.png")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    imageContainer: {},
    image: {
        width: 500,
        height: 500,
    },
})