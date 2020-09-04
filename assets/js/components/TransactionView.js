import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { colors } from '../contexts/Colors'
import { fonts } from '../contexts/Styles'



export default function TransactionView(props) {
    let { description, amount } = props.data

    return (
        <View
            style={{
                marginTop: 10,
                padding: 14,
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 30,
                backgroundColor: colors.buttonFill,
            }}
        >
            <Text style={{
                flex: 2,
                color: colors.buttonAccent,
                // textAlign: "justify",
                textAlignVertical: "center",
                fontSize: 16,
                fontFamily: fonts.default,
            }}>{description}</Text>
            <Text style={{
                flex: 1,
                color: colors.buttonAccent,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 16,
                fontFamily: fonts.default,
            }}>{`$${currencyFromZeroDecimal(amount)}`}</Text>
        </View>
    )
}

// const styles = StyleSheet.create({})