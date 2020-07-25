import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function ClassList(props) {
    const filteredData = props.data.filter(({dateString}) => {
        if (dateString === props.dateString) return true
    })

    const items = filteredData.map(({time, title, trainer, key}) =>
        <View
            style={styles.listItem}
            key={key}
        >
            <Text>{time}</Text>
            <Text>{title}</Text>
            <Text>{trainer}</Text>
        </View>
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
        borderRadius: 999,
        backgroundColor: "white",
        alignItems: "center",
    },
})