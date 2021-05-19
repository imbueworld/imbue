import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'
import Icon from './Icon'
import { publicStorage } from '../backend/BackendFunctions'



/**
 * props
 * .data -- has to have { name }
 * .onAction -- callback fired when tap on ( X )
 */
export default function ActiveMembershipBadge(props) {
    let membership = props.data

    const [iconUri, setIconUri] = useState(null)

    useEffect(() => {
        const init = async () => {
            let iconUri = await publicStorage(membership.icon_uri)
            setIconUri(iconUri)
        }
        init()
    }, [])

    if (!iconUri) return <View />

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
                source={{ uri: iconUri }}
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
        borderRadius: 25,
        borderWidth: 1,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
    },
    text: {
        flex: 1,
        ...FONTS.body,
        fontSize: 20,
    },
})