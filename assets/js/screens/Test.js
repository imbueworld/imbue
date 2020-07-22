import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'



export default function Test(props) {
    function home() {
        props.navigation.navigate("Home")
    }

    return (
        <View style={styles.container}>
            <Text>Sample Text</Text>
            <Button
                onPress={home}
                title="Generic Button"
            />
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
})
