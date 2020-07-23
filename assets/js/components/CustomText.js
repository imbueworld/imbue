import React from 'react'
import { StyleSheet, Text, View } from 'react-native'



export default function CustomText(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            <View style={styles.innerContainer}>

                <Text style={styles.content}>
                    {props.children}
                </Text>

                {
                props.label
                ?
                <Text style={styles.label}>
                    {props.label}
                </Text>
                :
                <View></View>
                }
            
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        overflow: "hidden",
        backgroundColor: "lightgray",
    },
    innerContainer: {
        padding: 10,
    },
    content: {
        // paddingVertical: 13,
        textAlign: "center",
        fontSize: 20,
    },
    label: {
        paddingVertical: 2,
        borderColor: "gray",
        borderTopWidth: 1,
        textAlign: "center",
        fontSize: 14,
    },
})