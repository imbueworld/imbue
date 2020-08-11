import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'



export default function ClassList(props) {
    let filteredData = props.data.filter(({ dateString }) => {
        if (dateString === props.dateString) return true
    })

    const items = filteredData.map(({ formattedDate, formattedTime, name, instructor, onPress }, idx) =>
        <TouchableOpacity
            style={styles.listItem}
            key={idx}
            onPress={onPress}
        >
            <Text>{formattedDate}</Text>
            <Text>{formattedTime}</Text>
            <Text>{name}</Text>
            <Text>{instructor}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            {items}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "85%",
        alignSelf: "center",
    },
    listItem: {
        marginVertical: 10,
        borderRadius: 30,
        backgroundColor: "white",
        alignItems: "center",
    },
})