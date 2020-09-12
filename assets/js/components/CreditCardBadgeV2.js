import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { imageSourceFromCCBrand } from '../backend/HelperFunctions'
import Icon from './Icon'
import { colors } from '../contexts/Colors'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { fonts } from '../contexts/Styles'



/**
 * props
 *  .data -- { brand, last4, exp_month, exp_year }
 */
export default function CreditCardBadgeV2(props) {
    let CC = props.data
    let source = imageSourceFromCCBrand(CC.brand)

    return (
        <View style={[styles.creditCardContainer, props.containerStyle]}>
            <TouchableHighlight
                style={{
                    padding: 20,
                }}
                underlayColor="#00000012"
                delayLongPress={3000}
                onLongPress={() => props.onLongPress(CC.id)}
            >
                <View style={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                }}>
                    <Icon source={source}/>
                    <Text numberOfLines={1} style={styles.creditCardText}>
                        {`**** ${CC.last4}  |  ${CC.exp_month}/${CC.exp_year}`}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    creditCardContainer: {
        borderWidth: 1,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        borderRadius: 30,
        marginTop: 9, // 19
        marginBottom: 1,
        overflow: "hidden",
    },
    creditCardText: {
        marginLeft: 10,
        alignSelf: "center",
        // color: colors.gray,
        color: colors.buttonFill,
        fontSize: 20,
        fontFamily: fonts.default,
    },
})