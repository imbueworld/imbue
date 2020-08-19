import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler'
import { simpleShadow, colors } from '../contexts/Colors'
import ClockInputPopup from './ClockInputPopup'
import ClockInputPopupField from './ClockInputPopupField'



export default function ClockInput(props) {
    let width = 60
    let height = 60
    if (props.style) {
        if (props.style.width) width = props.style.width
        if (props.style.height) height = props.style.height
    }

    const [Hours, HoursCreate] = useState(null)
    const [Minutes, MinutesCreate] = useState(null)

    const [popup, setPopup] = useState(true)

    const [h, setH] = useState(0)
    const [m, setM] = useState(0)

    // let popupWidth = width
    // let popupHeight = 216 // for now, just triple the height

    useEffect(() => {
        let hours = []
        for (let i = -1; i <= 1 + 12; i++) {
            hours.push(
                <ClockInputPopupField
                    width={width}
                    height={width}
                    style={{
                        opacity: i === -1 || i === 13 ? 0 : 1,
                    }}
                    key={`h${i}`}
                    onPress={() => {
                        setH(i)
                        // setPopup(false)
                        // props.onClose()
                    }}
                >
                    {i}
                </ClockInputPopupField>
            )
        }
        HoursCreate(hours)
    
        let minutes = []
        for (let i = 0; i <= 1 + 59 + 1; i++) {
            let item = i - 3
            item = `${i}`.length > 1 ? i : `0${i}`
            minutes.push(
                <ClockInputPopupField
                    width={width}
                    height={width}
                    style={{
                        // for the offset that is apparently needed, because
                        // it is not perfectly centered otherwise
                        paddingBottom: 0.3 * i,
                        opacity: i === 61 || i === 0 ? 0 : 1,
                    }}
                    key={`h${i}`}
                    onPress={() => {
                        setM(i + 1)
                        // setPopup(false)
                        // props.onClose()
                    }}
                >
                    {item}
                </ClockInputPopupField>
            )
        }
        MinutesCreate(minutes)
    }, [])

    useEffect(() => {
        if (props.forceClose) setPopup(false)
    }, [props.forceClose])

    function formatTime(unit) {
        if (`${unit}`.length === 1) unit = `0${unit}`
        return unit
    }



    if (!Hours || !Minutes) return <View />

    return (
        <View style={{
            backgroundColor: "white",
            zIndex: 1000,
            ...props.containerStyle,
        }}>
            <View style={{
                width: "100%",
                height: popup ? height * 3 : height,
                ...props.innerContainerStyle,
            }}>
                {!popup ?
                <TouchableHighlight style={{
                    height,
                    // width,
                    // height,
                    // backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                    underlayColor="#00000008"
                    onPress={() => {
                        // setPopup(!popup)
                        setPopup(true)
                        if (props.onOpen) props.onOpen()
                    }}
                >
                    <Text style={{
                        fontSize: 20,
                    }}>{h} : {formatTime(m)}</Text>
                </TouchableHighlight> : null}

                {popup ?
                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                }}>
                    <ClockInputPopup
                        style={{ flex: 36 }}
                        // width={width}
                        // height={height * 3}
                    >
                        {Hours}
                    </ClockInputPopup>
                    <Text style={{ alignSelf: "center", fontSize: 45, paddingBottom: 5 }}>:</Text>
                    <ClockInputPopup
                        style={{ flex: 36 }}
                        // width={width}
                        // height={height * 3}
                    >
                        {Minutes}
                    </ClockInputPopup>
                    <View style={{
                        flex: 28,
                        height: "100%",
                    }}>
                        <TouchableHighlight
                            style={{ height: "100%" }}
                            onPress={() => {
                                setPopup(false)
                                if (props.onChange) props.onChange(h, m)
                            }}
                            underlayColor="#0000000C"
                        >
                            <Text style={{
                                height: "100%",
                                backgroundColor: "#00000009",
                                textAlign: "center",
                                textAlignVertical: "center",
                                fontSize: 25,
                            }}>Ok</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})