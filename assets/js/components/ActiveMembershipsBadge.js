import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../contexts/Colors'
import { fonts } from '../contexts/Styles'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from './Icon'
import { publicStorage } from '../backend/HelperFunctions'



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
            <Icon
                containerStyle={{
                    width: 54,
                    height: 54,
                }}
                imageStyle={{
                    borderRadius: 999,
                }}
                source={{ uri: publicStorage(membership.icon_uri) }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 84,
        // paddingVertical: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    text: {
        flex: 1,
        fontSize: 20,
        fontFamily: fonts.default,
    },
})