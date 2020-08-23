import React from 'react'
import { StyleSheet, View, Image } from 'react-native'



export default function Icon(props) {
    return (
        <View style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            ...props.containerStyle,
        }}>
            <Image
                style={{
                    width: "100%",
                    height: "100%",
                    ...props.imageStyle,
                }}
                source={props.source}
            />
        </View>
    )
}

// const styles = StyleSheet.create({})