import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import ImageSlideshow from './ImageSlideshow'



export default function AppBackground(props) {
    const images = [
        "workout-10.jpeg",
        "workout-11.jpg",
        "workout-12.jpg",
        "workout-13.jpg",
        "workout-14.jpg",
    ]

    return (
        <View style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: -1000,
        }}>
            <ImageSlideshow
                imageStyle={{
                    width: "100%",
                    height: "100%",
                    // position: "absolute",
                }}
                disableUserControl
                randomizeFirstImage
                imageInterval={40000}
                data={images}
            />
        </View>
    )

    return (
        <Image
            style={styles.image}
            source={require("./img/imbue-screen-bg.png")}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -100,
    },
})