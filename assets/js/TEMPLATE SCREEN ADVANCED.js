import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"



export default function ClassDescription(props) {
    let classData = props.route.params.data
    const [Title, TitleCreate] = useState(null)
    const [Time, TimeCreate] = useState(null)
    const [Desc, DescCreate] = useState(null)

    useEffect(() => {
        TitleCreate(
            <View>

            </View>
        )
        TimeCreate(
            <View>
                
            </View>
        )
        DescCreate(
            <View>
                
            </View>
        )
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}>
                {Title}
                {Time}
                {Desc}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})