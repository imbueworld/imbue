import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { FONTS } from '../contexts/Styles'



export default function ClockInputPopup(props) {
    // const [itemIdx, selectItemIdx] = useState(0)
    const cItemIdx = props.value // current item idx

    function onScroll({ nativeEvent }) {
        // Layout simultaneously shows exactly three items
        let itemHeight = nativeEvent.layoutMeasurement.height / 3
        let offsetY = nativeEvent.contentOffset.y
        let newItemIdx = Math.round(offsetY / itemHeight)
        if (cItemIdx !== newItemIdx) {
            // selectItemIdx(newItemIdx)
            props.onItemIdxChange(newItemIdx)
        }
    }

    const scrollViewRef = useRef(null)
    // An unoptimal way of doing things, but currently
    // this is going to be the way to scroll to correct pos when user
    // opens the clock input.
    const currentPredictedItemHeight = 59.93650817871094

    useEffect(() => {
        const ref = scrollViewRef.current

        if (ref) {
            ref.scrollTo({
                y: currentPredictedItemHeight * cItemIdx,
                animated: true,
            })
        }
    }, [])

    return (
        <View
            style={{
                // width: props.width,
                // height: props.height,
                // position: "absolute",
                // backgroundColor: "white",
                // ...simpleShadow,
                zIndex: 110,
                ...props.style,
                ...FONTS.body
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                snapToInterval={60} // item height
                decelerationRate="fast"
                fadingEdgeLength={200}
                ref={scrollViewRef}
                onScroll={onScroll}
                style={FONTS.body}
            >
                {props.children}
            </ScrollView>
            {/* <FlatList
                data={props.children}
                renderItem={({ item }) => item}
                

                showsVerticalScrollIndicator={false}
                snapToInterval={60} // item height
                decelerationRate="fast"
                fadingEdgeLength={200}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({})