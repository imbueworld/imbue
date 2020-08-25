import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { fonts } from '../contexts/Styles'
import { highShadow } from '../contexts/Colors'



export default function TouchableMenu(props) {
    const [active, setActive] = useState(false)
    let shadow = active ? highShadow : {}

    return (
        <View style={{
            borderRadius: 10,
            ...shadow,
            ...props.containerStyle,
            backgroundColor: "#ffffff00", // needed for shadow to activate; reason unknown
        }}>
            {active ?
            <>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    backgroundColor: "#68cc75",// "#15c12c80",
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
                justifyContent: "space-around",
                backgroundColor: "#00000030", //"#00000060",
                zIndex: 110,
                ...props.style,
            }}>
                <TouchableHighlight
                    style={{
                        borderRadius: 999,
                    }}
                    underlayColor="#00000012"
                    onPress={props.onProceed || undefined}
                >
                    <Text style={{
                        ...styles.button,
                        backgroundColor: "red",
                    }}>{/*Confirm*/}Remove</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{
                        borderRadius: 999,
                    }}
                    underlayColor="#00000012"
                    onPress={() => setActive(false)}
                >
                    <Text style={styles.button}>Cancel</Text>
                </TouchableHighlight>
            </View>
            </> : null}
            <TouchableHighlight
                style={{
                    ...props.style,
                    zIndex: 100,
                }}
                delayLongPress={3500}
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
        backgroundColor: "white",
        borderRadius: 999,
        padding: 10,
        fontFamily: fonts.default,
    },
})