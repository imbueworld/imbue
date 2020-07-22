import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function Component(props) {
    return (
        <ScrollView>
            <View style={styles.container}></View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {},
})