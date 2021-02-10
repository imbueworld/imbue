import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { selectCard } from './CreditCardSelectionV2.backend'
import { useFocusEffect } from '@react-navigation/native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CreditCardBadgeV2 from './CreditCardBadgeV2'
import { FONTS } from '../contexts/Styles'
import User from '../backend/storage/User'
import firestore from '@react-native-firebase/firestore';

 
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
  const {
    title,
    price,
    onCardSelect=() => {},
  } = props

  const [cards, setCards] = useState(null)

  useFocusEffect( 
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        setCards([])
        
        const user = new User()
        getCreditCards(await user.retrieveUser())

        // const cards = await user.retrievePaymentMethods()
        // setCards(cards)

      }; init()
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const getCreditCards = async(thisUser) => {

    let obje
    await firestore()
      .collection('stripe_customers')
      .doc(thisUser.id)
      .collection('payment_methods')
      .get()
       .then((snap) => {
          snap.forEach((doc) => {
            obje = doc.data()
            obje.docId = doc.id
            setCards(cards => [...cards, obje])
          })
      })
  }

  // useEffect(() => {
  //   const init = async () => {
  //     const user = new User()
  //     const cards = await user.retrievePaymentMethods()
  //     setCards(cards)
  //   }; init()
  // }, [])



  if (!cards) return <View />

  const Cards = cards.map((card, idx) => // { brand, last4, exp_month, exp_year, id }
    // console.log("yyy: ", card.docId),
    <CreditCardBadgeV2
      key={idx}
      containerStyle={{
        backgroundColor: "#00000008"
      }}
      data={card}
      onPress={() => selectCard(onCardSelect, card)}
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
        ...FONTS.luloClean,
        textDecorationLine: "underline",
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
        ...FONTS.luloClean,
        textDecorationLine: "underline",
      }}>Cancel</Text>
    </TouchableWithoutFeedback>

  return (
    <View style={[
      props.containerStyle,
    ]}>
      {title
        ? <View style={{
          width: "88%",
          alignSelf: "center",
        }}>
          <Text style={{
            ...FONTS.luloClean,
            textAlign: "center",
            fontSize: 18,
          }}>{title}</Text>
          <Text style={{
            ...FONTS.luloClean,
            textAlign: "center",
            fontSize: 18,
            marginVertical: 10
          }}>{price}</Text>
        </View>
        : null}

      {/* Works on Alert.alert() now so it is commented out */}
      {/* <View style={{
        width: "94%",
        alignSelf: "center",
        marginTop: 6,
        marginBottom: 4,
      }}>
        <Text style={{
          ...FONTS.luloClean,
          textAlign: "justify",
          fontSize: 12,
        }}>
          To confirm, press and hold the card
          that you wish to make the payment with,
          you will be charged insantly after a successful action.
        </Text>
      </View> */}

      <View style={{
        maxHeight: 450,
        borderRadius: 20,
        overflow: "hidden",
        ...props.contentContainerStyle,
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
