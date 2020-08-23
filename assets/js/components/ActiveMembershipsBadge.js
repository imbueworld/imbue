import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../contexts/Colors'
import { fonts } from '../contexts/Styles'



/**
 * props
 * .data -- has to have { name }
 * .onAction -- callback fired when tap on ( X )
 */
export default function ActiveMembershipBadge(props) {
    let membership = props.data

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {membership.name}
            </Text>
            <View>
                {/* <Image /> */}
            </View>
            {/* <TouchableOpacity
                style={styles.X}
                onPress={props.onAction}
            >
                <Text style={[
                    {
                        fontSize: 20,
                    }
                ]}>
                    X
                </Text>
            </TouchableOpacity> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 30,
        // backgroundColor: "lightgray",
        borderWidth: 1,
        borderColor: colors.gray,
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
        flex: 1,
        marginLeft: 20,
        fontSize: 20,
        fontFamily: fonts.default,
    },
})