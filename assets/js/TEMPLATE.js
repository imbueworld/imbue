import React from 'react'
import { View } from 'react-native'



export default function Component(props) {
    return (
        <View style={{
            ...props.containerStyle,
        }}></View>
    )
}