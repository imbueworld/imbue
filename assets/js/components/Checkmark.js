import React from 'react'
import { StyleSheet, View, Image } from 'react-native'



export default function Checkmark(props) {
    return (
        <View style={{
            width: 42,
            height: 42,
            ...props.containerStyle,
        }}>
            <Image
                style={{
                    width: "100%",
                    height: "100%",
                    ...props.imageStyle,
                }}
                source={props.source || require("./img/png/checkmark.png")}
            />
        </View>
    )
}

// const styles = StyleSheet.create({})