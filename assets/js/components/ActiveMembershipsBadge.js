import React from 'react'
import { StyleSheet, Text, View } from 'react-native'



export default function ActiveMembershipBadge(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.name}
            </Text>
            <View>
                {/* <Image /> */}
            </View>
            <View style={styles.X}>
                <Text style={[
                    {
                        fontSize: 20,
                    }
                ]}>
                    X
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 999,
        backgroundColor: "lightgray",
    },
    X: {
        width: 50,
        height: 50,
        marginRight: 20,
        borderRadius: 999,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginLeft: 20,
        fontSize: 20,
    },
})