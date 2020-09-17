import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { publicStorage } from '../backend/CacheFunctions'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'



export default function ImageSlideshow(props) {
    let rawImageUris = props.data
    const imageCount = props.data.length
    const imageInterval = props.imageInterval || 3500
    const firstImageIdx = props.randomizeFirstImage
        ?   Math.floor(Math.random() * imageCount)
        :   0

    const [cIdx, setCurrentIdx] = useState(firstImageIdx) // current idx

    const [imageUris, setImageUris] = useState(null)

    useEffect(() => {
        if (!props.local) {
            const init = async () => {
                let promises = []
                rawImageUris.forEach(uri => promises.push(publicStorage(uri)))
                setImageUris(await Promise.all(promises))
            }
            init()
        } else {
            setImageUris(rawImageUris)
        }
    }, [])

    function nextImage() {
        if (cIdx + 1 < imageCount) setCurrentIdx(cIdx + 1)
        else setCurrentIdx(0)
    }

    function previousImage() {
        if (cIdx - 1 >= 0) setCurrentIdx(cIdx - 1)
        else setCurrentIdx(imageCount - 1)
    }

    // [comment upon DEBUG start]
    useEffect(() => {
        let itrvl = setInterval((cIdx => {
            if (cIdx[0] + 1 < imageCount) {
                setCurrentIdx(idx => idx + 1)
                cIdx[0]++
            } else {
                setCurrentIdx(0)
                cIdx[0] = 0
            }
        }).bind(null, [cIdx]), imageInterval)
        
        return () => clearInterval(itrvl)
    }, [cIdx])
    // [uncomment upon DEBUG end]

    console.log("Image URIS: " + imageUris)
    
    if (!imageUris) return <View />

    const IndicatingDots = imageUris.map((irlvnt, idx) => 
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
                // borderColor: colors.gray,
                borderColor: colors.buttonFill,
            }}/>
            {idx !== imageCount - 1
            ?   <View style={{
                    width: 15,
                }}/>
            :   null}
        </View>
    )

    console.log(imageUris[cIdx])
    
    return (
        <View style={props.containerStyle}>
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
                // source={["https://firebasestorage.googleapis.com/v0/b/spring-ranger-281214.appspot.com/o/imbue%20fitness.jpg?alt=media&token=531e2117-b602-4597-83fb-0c4a7c024699","https://firebasestorage.googleapis.com/v0/b/spring-ranger-281214.appspot.com/o/imbue%202.jpg?alt=media&token=8c430e5f-05d3-43f5-9320-0ebe163c99bd"]}
                source={props.local
                    ?   imageUris[cIdx]
                    :   { uri: imageUris[cIdx] }}
            />
        </View>
    )
}