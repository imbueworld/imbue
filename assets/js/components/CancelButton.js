import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { FONTS } from '../contexts/Styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { colors } from '../contexts/Colors';



export default function CancelButton(props) {
    const title = props.title
    const [holdToExit, helpUser] = useState(false)

    return (
        <View style={{
            backgroundColor: "#00000060",
            borderWidth: 1,
            // borderColor: colors.gray,
            borderColor: colors.buttonFill,
            borderRadius: 999,
        }}>
            {/* {holdToExit
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
                    }}>Hold to Exit</Text>
                </View>
            :   null} */}
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
                // onLongPress={props.onLongPress || undefined}
            >
                <Text style={{
                    color: "white",
                    paddingHorizontal: 10,
                    ...FONTS.body,
                    fontSize: 16,
                    ...props.textStyle,
                }}>{ holdToExit ? "  ".repeat(title.length) : title }</Text>
            </TouchableHighlight>
        </View>
    )
}