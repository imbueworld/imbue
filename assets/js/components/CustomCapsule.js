import React from 'react'
import { StyleSheet, View } from 'react-native'



export default function CustomCapsule(props) {
    return (
        <View
            style={[
                styles.container,
                props.style,
                props.containerStyle,
            ]}
            ref={props.containerRef}
        >
            <View style={[
                styles.innerContainer,
                props.innerContainerStyle,
            ]}>
                {props.children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        backgroundColor: "#FFFFFF80", // "#e6e6e6",
        // paddingBottom: 12,
        // paddingRight: 12,
        padding: 12,
    },
    innerContainer: {
        // height: "100%",
        borderRadius: 30,
        backgroundColor: "#FFFFFF80",
        paddingHorizontal: 20,
        overflow: "hidden",
    },
})