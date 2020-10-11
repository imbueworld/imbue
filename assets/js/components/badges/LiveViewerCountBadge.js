import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Icon from '../Icon'
import { FONTS } from '../../contexts/Styles'
import cache from '../../backend/storage/cache'
import { colors } from '../../contexts/Colors'



export default function LiveViewerCountBadge(props) {
    const hidden = props.hidden
    const [count, setCount] = useState(null)

    useEffect(() => {
        cache("livestream/functions/setViewerCount").set(setCount)
    }, [])

    useEffect(() => {
        let count = cache("livestream/viewerCount").get() || null
        setCount(count)
    })
    
    let Count
    if (hidden) {
        Count =
            <Text style={{
                fontStyle: "italic",
                fontWeight: "normal",
                color: colors.grayInactive,
            }}>HIDDEN</Text>
    } else {
        Count = count
    }

    return (
        <View style={{
            flexDirection: "row",
            ...props.containerStyle,
        }}>
            <Icon
                containerStyle={{
                    width: 30,
                    height: 30,
                    ...props.imageContainerStyle,
                }}
                source={require("../img/png/livestream-count.png")}
            />
            <Text style={{
                marginLeft: 5,
                ...FONTS.body,
                color: "#ff5259",
                textAlignVertical: "center",
                fontSize: 18,
                fontWeight: "bold",
                ...props.textStyle,
            }}>{ Count }</Text>
        </View>
    )
}