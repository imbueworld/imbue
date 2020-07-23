import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'



export default function MenuPanel(props) {
    const [showPanel, setShowPanel] = useState(false)
    function togglePanel() {
        if (showPanel) setShowPanel(false)
        else setShowPanel(true)
    }

    return (
        // <ScrollView
        <View
            style={styles.container}
            // contentContainerStyle={styles.scrollViewContainer}
        >
            <TouchableOpacity
                style={{
                    position: "absolute",
                    zIndex: 100,
                }}
                onPress={togglePanel}
            >
                <Text style={{fontSize: 30}}>{showPanel ? "<" : "+"}</Text>
            </TouchableOpacity>
            <View
                style={[
                    styles.panel,
                    {
                        display: showPanel ? "flex" : "none"
                    }
                ]}
            >
                {props.children}
            </View>
        </View>
        // </ScrollView>
    )
}

const styles = StyleSheet.create({
    // scrollViewContainer: {},
    container: {
        width: "100%",
        position: "absolute",
        zIndex: 100,
    },
    panel: {
        // position: "absolute",
        // top: 40,
    },
})