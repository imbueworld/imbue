import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'



export default function MenuPanel(props) {
    const [showPanel, setShowPanel] = useState(false)

    return (
        <>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    zIndex: 110,
                }}
                onPress={() => setShowPanel(!showPanel)}
            >
                <Text style={{
                    fontSize: 40,
                    margin: 20,
                }}>{showPanel ? "<" : "+"}</Text>
            </TouchableOpacity>

            <View style={{
                width: showPanel ? "100%" : 0,
                height: showPanel ? "100%" : 0,
                position: "absolute",
                zIndex: 100,
            }}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContainer}
                    style={[
                        styles.panelContainer,
                        {
                            display: showPanel ? "flex" : "none"
                        }
                    ]
                }>
                    {props.children}
                </ScrollView>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        // height: "100%",
        // flex: 1,
    },
    panelContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        // zIndex: 100,
    },
})