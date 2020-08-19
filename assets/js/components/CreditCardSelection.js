import React from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import CreditCardBadge from "./CreditCardBadge"
import CustomSmallButton from './CustomSmallButton'



/**
 * props
 * .data -- creditCards ( [{}, {}, ..] )
 * .selectedCard
 * .selectCard -- callback
 * .containerStyle
 */
export default function CreditCardSelection(props) {
    let navigation = useNavigation()
    let CCData = props.data

    const Cards = CCData.map(({ brand, last4, exp_month, exp_year, id }, idx) => 
        <TouchableOpacity
            key={idx}
            onPress={() => props.selectCard(id)}
        >
            <CreditCardBadge
                containerStyle={{
                    backgroundColor: props.selectedCard === id
                        ? "white" : undefined,
                }}
                data={{ brand, last4, exp_month, exp_year }}
            />
        </TouchableOpacity>
    )

    const AddNewCard =
        // <TouchableOpacity
        //     style={[{
        //         marginTop: 10,
        //         alignSelf: "center",
        //         // backgroundColor: "white",
        //     }, styles.buttonSmall]}
        //     onPress={() => navigation.navigate("AddPaymentMethod")}
        // >
        //     <Text style={{
        //         textDecorationLine: "underline",
        //     }}>Add a new card</Text>
        // </TouchableOpacity>
        <CustomSmallButton
            style={{
                marginTop: 30,
            }}
            title="Add a new card"
            onPress={() => navigation.navigate("AddPaymentMethod")}
        />

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            <View style={{
                maxHeight: 450,
                borderRadius: 20,
                overflow: "hidden",
                ...props.contentContainerStyle,
            }}>
                <ScrollView>
                    {Cards}
                </ScrollView>
            </View>
            {AddNewCard}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    // buttonSmall: {
    //     paddingVertical: 10,
    //     paddingHorizontal: 10,
    //     borderRadius: 999,
    // }
})