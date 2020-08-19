import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { imageSourceFromCCBrand } from '../backend/HelperFunctions'
import Icon from './Icon'
import { colors } from '../contexts/Colors'



/**
 * props
 *  .data -- { brand, last4, exp_month, exp_year }
 */
export default function CreditCardBadge(props) {
    let CC = props.data
    let source = imageSourceFromCCBrand(CC.brand)

    return (
        <View
            style={[styles.creditCardContainer, props.containerStyle]}
        >
            <Icon
                source={source}
            />
            <Text numberOfLines={1} style={styles.creditCardText}>
                {`**** ${CC.last4}  |  ${CC.exp_month}/${CC.exp_year}`}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    creditCardContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 30,
        marginTop: 9, // 19
        marginBottom: 1,
        padding: 20,
    },
    creditCardText: {
        marginLeft: 10,
        alignSelf: "center",
        color: colors.gray,
        fontSize: 20,
    },
})