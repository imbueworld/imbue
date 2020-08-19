import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { retrievePaymentMethods } from "../../backend/CacheFunctions"

import CreditCardSelection from "../CreditCardSelection"
import CustomPopup from '../CustomPopup'
import CustomButton from '../CustomButton'
import AppBackground from "../AppBackground"
import CustomCapsule from '../CustomCapsule'


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
                backgroundColor: "#ffffeeB0",
            }}
            innerContainerStyle={{
                paddingLeft: 0,
                paddingRight: 0,
            }}
            onX={props.onX}
        >
            <AppBackground />

            <View style={{
                marginVertical: 20,
                marginHorizontal: 10,
            }}>

                {!props.popupText ? null :
                <Text style={{
                    paddingHorizontal: 24,
                    fontSize: 18,
                    textAlign: "justify",
                }}
                >{props.popupText}</Text>}

                <Text style={{ color: "red" }}>{errorMsg}</Text>

                <View style={{
                    // marginVertical: 20,
                }}>
                    <CreditCardSelection
                        contentContainerStyle={{
                            maxHeight: 300,
                        }}
                        data={creditCards}
                        selectedCard={props.selectedCard}
                        selectCard={props.selectCard}
                    />
                </View>
                
                {/* Proceed / Cancel buttons */}
                <View style={{
                    flexDirection: "row",
                    marginTop: 30,
                    marginHorizontal: 10,
                }}>
                    <CustomButton
                        style={{
                            flex: 1,
                            marginVertical: 0,
                            marginRight: 10,
                        }}
                        title="Cancel"
                        onPress={() => props.onX()}
                    />
                    <CustomButton
                        style={{
                            flex: 1,
                            marginVertical: 0,
                            marginLeft: 10,
                            opacity: props.selectedCard ? 1 : 0.65,
                        }}
                        title="Book"
                        disabled={props.selectedCard ? false : true}
                        onPress={!props.selectedCard ? undefined :
                            () => {
                                try {
                                    props.onProceed()
                                } catch(err) {
                                    setErrorMsg(err.message)
                                }
                            }
                        }
                    />
                </View>
                
            </View>

        </CustomPopup>
    )
}

const styles = StyleSheet.create({
    container: {},
})