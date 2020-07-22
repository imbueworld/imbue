import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ClassListItem from "./ClassListItem"



export default function ClassList(props) {
    const filteredData = props.data.filter(({dateString}) => {
        if (dateString === props.dateString) return true
    })

    const items = filteredData.map(({time, title, trainer, key}) => <ClassListItem
        time={time}
        title={title}
        trainer={trainer}
        key={key}
    />)

    return (
        <View style={styles.container}>
            {items}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "85%",
        alignSelf: "center",
    },
})