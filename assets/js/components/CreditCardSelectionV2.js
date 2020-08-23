import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import CustomSmallButton from './CustomSmallButton'
import { retrievePaymentMethods } from '../backend/CacheFunctions'
import { TouchableHighlight } from 'react-native-gesture-handler'
import CreditCardBadgeV2 from './CreditCardBadgeV2'



//  * .data -- creditCards ( [{}, {}, ..] )
//  * .selectedCard
//  * .selectCard -- callback
/**
 * props
 * .cache -- required
 * .onCardSelect -- callback
 * .containerStyle
 */
export default function CreditCardSelectionV2(props) {
    let cache = props.cache
    let navigation = useNavigation()

    const [cards, setCards] = useState(null)

    useEffect(() => {
        const init = async () => {
            let cards = await retrievePaymentMethods(cache)
            setCards(cards)
        }
        init()
    }, [])

    if (!cards) return <View />

    const Cards = cards.map((card, idx) => // { brand, last4, exp_month, exp_year, id }
        <CreditCardBadgeV2
            key={idx}
            containerStyle={{
                backgroundColor: "#00000008"
            }}
            // data={{ id, brand, last4, exp_month, exp_year }}
            data={card}
            onLongPress={id => {
                // proceccing payment chowc up
                props.onCardSelect(id)
            }}
        />
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
                // marginTop: 30,
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