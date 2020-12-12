import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'



export default function CompanyLogo(props) {
    const { width, height } = useDimensions().window
    const image = {
        width: width * 0.85,
        height: width * 0.85,
    }

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            <View style={styles.imageContainer}>
                <Image
                    style={[
                        styles.image,
                        image,
                        props.style,
                    ]}
                    source={require("./img/imbueNewLogo.png")}
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
        width: 200,
        height: 200,
    },
})