import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { colors } from '../contexts/Colors'



export default function TransactionView(props) {
    let { description, amount } = props.data

    return (
        <View
            style={{
                marginTop: 10,
                padding: 14,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 30,
                backgroundColor: `#00000008`,
            }}
        >
            <Text style={{
                flex: 2,
                // textAlign: "justify",
                textAlignVertical: "center",
                fontSize: 16,
                fontFamily: 'sans-serif-light',
            }}>{description}</Text>
            <Text style={{
                flex: 1,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 16,
                fontFamily: 'sans-serif-light',
            }}>{`$${currencyFromZeroDecimal(amount)}`}</Text>
        </View>
    )
}

// const styles = StyleSheet.create({})