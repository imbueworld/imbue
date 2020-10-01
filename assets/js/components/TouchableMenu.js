import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { FONTS } from '../contexts/Styles'
import { highShadow, colors } from '../contexts/Colors'



export default function TouchableMenu(props) {
    const [active, setActive] = useState(false)
    let shadow = active ? highShadow : {}

    return (
        <View style={{
            borderRadius: 10,
            ...props.containerStyle,
            ...shadow,
        }}>
            {active ?
            <>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    backgroundColor: colors.bg,
                    zIndex: -100,
                    ...props.style,
                }}
            />
            <View style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#00000030", //"#00000060",
                zIndex: 110,
                ...props.style,
            }}>
                <View style={{ flex: 1, marginHorizontal: "10%", }}>
                    <TouchableHighlight
                        style={{
                            borderRadius: 30,
                        }}
                        underlayColor="#00000012"
                        onPress={props.onProceed || undefined}
                    >
                        <Text style={{
                            ...styles.button,
                            backgroundColor: props.confirmColor || "#68cc75",
                            fontWeight: "bold",
                        }}>{props.confirmText || "Confirm"}</Text>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1, marginHorizontal: "10%", }}>
                    <TouchableHighlight
                        style={{
                            borderRadius: 30,
                        }}
                        underlayColor="#00000012"
                        onPress={() => setActive(false)}
                    >
                        <Text style={styles.button}>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </View>
            </> : null}

            <TouchableHighlight
                style={{
                    ...props.style,
                    zIndex: 100,
                }}
                underlayColor="#00000012"
                onLongPress={() => setActive(true)}
            >
                { props.children }
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 999,
        textAlign: "center",
        ...FONTS.body,
    },
})