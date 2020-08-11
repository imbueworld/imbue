import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { retrievePaymentMethods } from "../../backend/CacheFunctions"

import CreditCardSelection from "../CreditCardSelection"
import CustomPopup from '../CustomPopup'
import CustomButton from '../CustomButton'


//taken out
//.data -- has to have { id, price }

/**
 * props
 * .cache -- props.route.params.cache forwarded from a top-level component (screen) in the routing stack
 * .popupText
 * .selectedCard -- const
 * .selectCard -- callback
 * .onProceed -- callback of purchaseMembership(), purchaseClass() or such
 * .onX -- callback
 */
export default function PopupPurchase(props) {
    let cache = props.cache
    // let data = props.data

    const [creditCards, setCreditCards] = useState([])

    const [errorMsg, setErrorMsg] = useState(null)
    
    useEffect(() => {
        const init = async() => setCreditCards( await retrievePaymentMethods(cache) )
        init()
    }, [])

    return (
        <CustomPopup
            containerStyle={{
                padding: 0,
                paddingVertical: 30,
            }}
            onX={props.onX}
        >
            <View style={{
                marginHorizontal: 20,
            }}>

                <View style={{
                }}>
                    <Text style={{
                        fontSize: 20,
                    }}
                    >{props.popupText}</Text>
                </View>

                <Text style={{ color: "red" }}>{errorMsg}</Text>

                <View style={{
                    marginVertical: 20,
                }}>
                    <CreditCardSelection
                        data={creditCards}
                        selectedCard={props.selectedCard}
                        selectCard={props.selectCard}
                    />
                </View>
                
                <View style={{
                    flexDirection: "row",
                    marginTop: 10,
                }}>
                    <CustomButton
                        style={{
                            flex: 1,
                            marginVertical: 0,
                            marginRight: 10,
                            opacity: props.selectedCard ? 1 : 0.5,
                        }}
                        title="Book"
                        onPress={() => {
                            try {
                                props.onProceed()
                            } catch(err) {
                                setErrorMsg(err.message)
                            }
                        }}
                    />
                    <CustomButton
                        style={{
                            flex: 1,
                            marginVertical: 0,
                            marginLeft: 10,
                        }}
                        title="Cancel"
                        onPress={() => props.onX()}
                    />
                </View>
                
            </View>

        </CustomPopup>
    )
}

const styles = StyleSheet.create({
    container: {},
})