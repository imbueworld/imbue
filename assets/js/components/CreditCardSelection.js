import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'



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

    const Cards = CCData.map((doc, idx) => 
        <TouchableOpacity
            style={[
                styles.creditCardContainer,
                {
                    backgroundColor:
                        props.selectedCard === doc.id
                        ? "white" : "lightgray",
                },
            ]}
            key={idx}
            onPress={() => props.selectCard(doc.id)}
        >
            <Text style={styles.creditCardText}>
                {`${doc.brand}  |  ending in ${doc.last4}`}
            </Text>
        </TouchableOpacity>
    )

    const AddNewCard =
        <TouchableOpacity
            style={[{
                marginTop: 10,
                alignSelf: "center",
                // backgroundColor: "white",
            }, styles.buttonSmall]}
            onPress={() => navigation.navigate("AddPaymentMethod")}
        >
            <Text style={{
                textDecorationLine: "underline",
            }}>Add a new card</Text>
        </TouchableOpacity>

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            {Cards}
            {AddNewCard}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    creditCardContainer: {
        marginTop: 15,
        paddingVertical: 15,
        borderRadius: 999,
    },
    creditCardText: {
        paddingLeft: 20,
        fontSize: 18,
    },
    buttonSmall: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 999,
    }
})