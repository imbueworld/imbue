import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'



export default function UserIcon(props) {
    return (
        <View>
            <Image
                style={styles.icon}
                source={require("./img/user-icon-example.png")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        borderRadius: 999,
    },
})