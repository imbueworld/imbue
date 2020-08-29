import React, { useEffect } from 'react'
import { View, TouchableWithoutFeedback, BackHandler } from 'react-native'

import CustomCapsule from "../components/CustomCapsule"
import { cache } from '../backend/CacheFunctions'



/**
 * props
 * .onX
 * .children
 * 
 * .containerStyle
 * .innerContainerStyle
 */
export default function CustomPopup(props) {
    useEffect(() => {
        const onXRef = cache("CustomPopup/onX")
        const onXEnabledRef = cache("CustomPopup/onX/enabled")

        onXRef.set(() => {
            if (onXEnabledRef.get()) {
                if (props.onX) props.onX()
                onXEnabledRef.set(false)
                return true
            }
        })

        onXEnabledRef.set(true)
        BackHandler.addEventListener('hardwareBackPress', onXRef.get())

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onXRef.get())
        }
    }, [])

    return (
        <View style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <TouchableWithoutFeedback onPress={props.onX}>
                <View style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backgroundColor: `#00000045`,
                    zIndex: -1000,
                }}/>
            </TouchableWithoutFeedback>
            
            <CustomCapsule
                containerStyle={{
                    width: "94%",
                    maxHeight: "90%",
                    // backgroundColor: "lightgray",
                    ...props.containerStyle,
                }}
                innerContainerStyle={{
                    // height: "100%",
                    ...props.innerContainerStyle,
                }}
            >
                {props.children}
            </CustomCapsule>
        </View>
    )
}