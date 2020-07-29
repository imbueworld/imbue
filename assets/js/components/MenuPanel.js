import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'



export default function MenuPanel(props) {
    const [showPanel, setShowPanel] = useState(false)
    function togglePanel() {
        if (showPanel) setShowPanel(false)
        else setShowPanel(true)
    }

    return (
        <>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    zIndex: 110,
                }}
                onPress={togglePanel}
            >
                <Text style={{
                    fontSize: 40,
                    margin: 20,
                    zIndex: 120,
                }}>{showPanel ? "<" : "+"}</Text>
            </TouchableOpacity>

            <View style={{
                width: showPanel ? "100%" : 0,
                height: showPanel ? "100%" : 0,
                position: "absolute",
                zIndex: 100,
            }}>

                <ScrollView
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
        zIndex: 100,
    },
})