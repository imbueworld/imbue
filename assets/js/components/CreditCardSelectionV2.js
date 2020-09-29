import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CreditCardBadgeV2 from './CreditCardBadgeV2'
import { fonts } from '../contexts/Styles'
import User from '../backend/storage/User'



//  * .data -- creditCards ( [{}, {}, ..] )
//  * .selectedCard
//  * .selectCard -- callback
/**
 * props
 * .onCardSelect -- callback
 * .containerStyle
 */
export default function CreditCardSelectionV2(props) {
  let navigation = useNavigation()
  const title = props.title

  const [cards, setCards] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const cards = await user.retrievePaymentMethods()

      setCards(cards)
    }; init()
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
    <TouchableWithoutFeedback
      style={{
        padding: 5,
        paddingHorizontal: 15,
      }}
      onPress={() => navigation.navigate("AddPaymentMethod")}
    >
      <Text style={{
        textDecorationLine: "underline",
        fontFamily: fonts.default,
      }}>Add a new card</Text>
    </TouchableWithoutFeedback>

  const Cancel =
    <TouchableWithoutFeedback
      style={{
        padding: 5,
        paddingHorizontal: 15,
      }}
      onPress={props.onX || undefined}
    >
      <Text style={{
        textDecorationLine: "underline",
        fontFamily: fonts.default,
      }}>Cancel</Text>
    </TouchableWithoutFeedback>

  return (
    <View style={[
      styles.container,
      props.containerStyle,
    ]}>
      {title
        ? <View style={{
          width: "88%",
          alignSelf: "center",
        }}>
          <Text style={{
            textAlign: "center",
            fontSize: 20,
            fontFamily: fonts.default,
          }}>{title}</Text>
        </View>
        : null}

      <View style={{
        width: "94%",
        alignSelf: "center",
        marginTop: 6,
        marginBottom: 4,
      }}>
        <Text style={{
          textAlign: "justify",
          fontSize: 12,
          fontFamily: fonts.default,
        }}>
          To confirm, press and hold the card
          that you wish to make the payment with,
          you will be charged insantly after a successful action.
                </Text>
      </View>

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

      <View style={{
        width: "100%",
        paddingVertical: 8,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        {Cancel}
        {AddNewCard}
      </View>
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