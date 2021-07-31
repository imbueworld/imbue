import React, { useEffect } from 'react'
import { View, TouchableWithoutFeedback, BackHandler } from 'react-native'

import CustomCapsule from "../components/CustomCapsule"
import cache from '../backend/storage/cache'
import CloseButton from './CloseButton'



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
                <CloseButton
                    containerStyle={{
                    width: 35,
                    height: 35,
                    marginTop: 10,
                    marginRight: 10,
                    position: "absolute",
                    right: 0,
                    }}
                    onPress={props.onX}
                />
                
                {props.children}
            </CustomCapsule>
        </View>
    )
}