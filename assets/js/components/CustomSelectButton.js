import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



export default function CustomSelectButton(props) {
    /**
     * props
     * .options -- {label: repr_string, ..}
     * .info -- transfers information over to parent component
     * .containerStyle -- style of <View /> container
     * .textStyle -- style of text
     */

    let option = Object.keys(props.options).includes(props.value)
    ?   props.value
    :   Object.keys(props.options)[0]

    // const [slctdOpt, setSlctdOpt] = useState(option)

    // if (props.info) props.info[0] = slctdOpt
    const gap = 100 / Object.keys(props.options).length

    let slctdIdx = null
    const options = Object.entries(props.options).map((arr, idx) => {
        if (arr[0] === /*slctdOpt*/props.value) slctdIdx = idx
        // arr[1] is the formatted label
        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    // arr[0] === slctdOpt ? styles.selected : {},
                    {
                        width: `${gap}%`,
                        left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
                onPress={() => {
                    // setSlctdOpt(arr[0])
                    if (props.onChange) props.onChange(arr[0])
                }}
            >
                <Text
                    style={[
                        styles.optionText,
                        arr[0] !== /*slctdOpt*/props.value ? styles.unselectedColor : {},
                        props.textStyle,
                    ]}
                >
                    {arr[1]}
                </Text>
            </TouchableOpacity>
        )
    })

    const highlight =
        <View
            style={[
                styles.highlight,
                {
                    width: `${gap}%`,
                    left: `${gap * slctdIdx}%`,
                }
            ]}
        />

    return (
        <View
            style={[
                styles.container,
                props.containerStyle,
            ]}
        >
            <View style={styles.border}>
            {options}
            </View>
            {highlight}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        borderRadius: 999,
    },
    option: {
        width: "100%",
        height: "100%",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    optionText: {
        ...FONTS.body,
        color: "#1b1b19", // edited
        textAlign: "center",
        fontSize: 20,
    },
    unselectedColor: {
        color: "#696461",
    },
    highlight: {
        height: 60,
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 999,
        borderWidth: 1,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        top: -1,
        zIndex: -100,
    },
    border: {
        width: "100%",
        height: "100%",
    },
})