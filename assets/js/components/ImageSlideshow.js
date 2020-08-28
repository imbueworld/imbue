import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { publicStorage } from '../backend/HelperFunctions'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'



export default function ImageSlideshow(props) {
    let image_uris = props.data
    const imageInterval = props.imageInterval || 3500
    const firstImageIdx = props.randomizeFirstImage
        ?   Math.floor(Math.random() * image_uris.length)
        :   0

    const [cIdx, setCurrentIdx] = useState(firstImageIdx) // current idx

    function nextImage() {
        if (cIdx + 1 < image_uris.length) setCurrentIdx(cIdx + 1)
        else setCurrentIdx(0)
    }

    function previousImage() {
        if (cIdx - 1 >= 0) setCurrentIdx(cIdx - 1)
        else setCurrentIdx(image_uris.length - 1)
    }

    // [comment upon DEBUG start]
    // useEffect(() => {
    //     let itrvl = setInterval((cIdx => {
    //         if (cIdx[0] + 1 < image_uris.length) {
    //             setCurrentIdx(idx => idx + 1)
    //             cIdx[0]++
    //         } else {
    //             setCurrentIdx(0)
    //             cIdx[0] = 0
    //         }
    //     }).bind(null, [cIdx]), imageInterval)
        
    //     return () => clearInterval(itrvl)
    // }, [cIdx])
    // [uncomment upon DEBUG end]

    const IndicatingDots = image_uris.map((irlvnt, idx) => 
        <View
            style={{
                flexDirection: "row",
            }}
            key={idx}
        >
            <View style={{
                width: 8,
                height: 8,
                backgroundColor: idx === cIdx ? `#ffffffA0` : "#00000012",
                borderRadius: 999,
                borderWidth: 0.5,
                borderColor: colors.gray,
            }}/>
            {idx !== image_uris.length - 1
            ?   <View style={{
                    width: 15,
                }}/>
            :   null}
        </View>
    )

    return (
        <View style={{ zIndex: -100 }}>
            {props.disableUserControl ? null :
            <>
            <View style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 10,
            }}>
                <TouchableWithoutFeedback
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    onPress={nextImage}
                />
            </View>
            
            <View style={{
                position: "absolute",
                bottom: 0,
                paddingBottom: 15,
                flexDirection: "row",
                alignSelf: "center",
                zIndex: 9,
            }}>
                { IndicatingDots }
            </View>
            </>
            }

            <Image
                style={{
                    width: 200,
                    height: 200,
                    ...props.imageStyle,
                }}
                source={props.local
                    ?   image_uris[cIdx]
                    :   { uri: publicStorage(image_uris[cIdx]) }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})