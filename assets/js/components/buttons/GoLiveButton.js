import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { colors } from '../../contexts/Colors'
import { FONTS } from '../../contexts/Styles'
import { TouchableHighlight } from 'react-native-gesture-handler'



export default function GoLiveButton(props) {
    const title = props.title
    const [holdToExit, helpUser] = useState(false)

    return (
        <View style={{ 
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: colors.gray,
            borderRadius: 999,
        }}>
            {   holdToExit
            ?   <View style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#00000060",
                    borderRadius: 999,
                }}>
                    <Text style={{
                        ...FONTS.body,
                        color: "white",
                        fontSize: 14,
                    }}>Hold</Text>
                </View>
            :   null }
            <TouchableHighlight
                style={{
                    height: 50,
                    padding: 10,
                    borderRadius: 999,
                    justifyContent: "center",
                    ...props.containerStyle,
                }}
                underlayColor="#00000012"
                // onPress={() => helpUser(true)}
                onPress={props.onPress || undefined}
            >
                <Text style={{
                    ...FONTS.body,
                    color: colors.darkButtonText,
                    paddingHorizontal: 10,
                    fontSize: 16,
                    ...props.textStyle,
                }}>{ holdToExit ? "  ".repeat(title.length) : title }</Text>
            </TouchableHighlight>
        </View>
    )
}