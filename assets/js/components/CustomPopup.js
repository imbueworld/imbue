import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import CustomCapsule from "../components/CustomCapsule"



/**
 * props
 * .onX
 * .children
 * 
 * .containerStyle
 * .innerContainerStyle
 */
export default function CustomPopup(props) {
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