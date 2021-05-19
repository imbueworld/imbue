import React from 'react'
import { StyleSheet, View } from 'react-native'



export default function CustomCapsule(props) {
    /**
     * CustomCapsule no longer to be a thing,
     * so just return an arbitrary <View /> container
     */
    const Children = props.children
    return (
        <View ref={props.containerRef} style={[
            props.style,
            props.containerStyle,
        ]}>
            <View style={[
                props.innerContainerStyle,
            ]}>
                { Children }
            </View>
        </View>
    )

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
        borderRadius: 25,
        backgroundColor: "#FFFFFF", // "#e6e6e6",
        // paddingBottom: 12,
        // paddingRight: 12,
        padding: 12,
    },
    innerContainer: {
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        // paddingHorizontal: 20,
        paddingHorizontal: "6%",
        overflow: "hidden",
    },
})