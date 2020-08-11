import React from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { colors, simpleShadow } from '../contexts/Colors'



export default function UserIcon(props) {
    return (
        <View style={{
            borderRadius: 999,
            ...simpleShadow
        }}>
        <Image
            style={[
                styles.icon,
                props.style,
            ]}
            // source={require("./img/user-icon-example.png")}
            source={{uri: props.data.uri}}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 200,
        height: 200,
        borderRadius: 999,
    },
})