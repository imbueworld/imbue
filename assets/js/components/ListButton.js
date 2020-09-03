import React from 'react'
import { Image, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'



export default function ListButton(props) {
    return (
        <View style={{
            backgroundColor: "#ffffff60",
            borderWidth: 1,
            // borderColor: colors.gray,
            borderColor: colors.buttonFill,
            borderRadius: 999,
        }}>
            <TouchableHighlight
                style={{
                    width: 50,
                    height: 50,
                    padding: 14,
                    borderRadius: 999,
                    ...props.containerStyle,
                }}
                underlayColor="#00000012"
                onPress={props.onPress}
            >
                <Image
                    style={{
                        width: "100%",
                        height: "100%",
                        ...props.imageStyle,
                    }}
                    source={require("./img/png/list-icon-3.png")}
                />
            </TouchableHighlight>
        </View>
    )
}