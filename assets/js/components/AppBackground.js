import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import ImageSlideshow from './ImageSlideshow'
import { colors } from '../contexts/Colors'



export default function AppBackground(props) {
    // For use with pulling from web
    // const images = [
    //     "workout-10.jpeg",
    //     "workout-11.jpg",
    //     "workout-12.jpg",
    //     "workout-13.jpg",
    //     "workout-14.jpg",
    // ]
    // Local
    // const images = [
    //     require("./img/workout-20.jpg"),
    //     require("./img/workout-21.jpg"),
    //     require("./img/workout-22.jpg"),
    //     require("./img/workout-23.jpg"),
    //     require("./img/workout-24.jpg"),
    //     require("./img/workout-25.jpg"),
    //     require("./img/workout-kinda.jpg"),
    //     require("./img/workout-27.jpg"),
    // ]

    // return (
    //     <View style={{
    //         width: "100%",
    //         height: "100%",
    //         position: "absolute",
    //         zIndex: -1000,
    //     }}>
    //         <ImageSlideshow
    //             imageStyle={{
    //                 width: "100%",
    //                 height: "100%",
    //                 // position: "absolute",
    //             }}
    //             disableUserControl
    //             randomizeFirstImage
    //             local
    //             imageInterval={40000}
    //             data={images}
    //         />
    //     </View>
    // )

    return (
        <View style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: colors.bg,
            zIndex: -110,
        }}/>
    )
}