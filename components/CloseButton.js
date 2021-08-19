import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from './Icon'



export default function CloseButton(props) {
    return (
        <View style={{...styles.button, ...props.containerStyle}}>
            <TouchableOpacity onPress={props.onPress}>
                <Icon
                    containerStyle={{
                        padding: 12,
                    }}
                    source={require("../components/img/png/x-3.png")}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 999,
        zIndex: 2,
    },
})