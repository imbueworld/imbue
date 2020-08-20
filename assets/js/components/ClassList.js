import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { addFormattingToClassData, addFunctionalityToClassData } from '../backend/HelperFunctions'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../contexts/Styles'



/**
 * props
 *  .data -- class data
 *  .dateString -- [optional] show a specific date
 */
export default function ClassList(props) {
    let classData = props.data
    let navigation = useNavigation()
    addFormattingToClassData(classData)
    addFunctionalityToClassData(classData, navigation)

    if (!classData) return <View />

    // if (props.dateString) {
    //     classData = classData.filter(({ dateString }) => {
    //         if (dateString === props.dateString) return true
    //     })
    // }

    // const items = classData.map(({ formattedDate, formattedTime, name, instructor, onPress }, idx) =>
    //     <TouchableOpacity
    //         style={styles.listItem}
    //         key={idx}
    //         onPress={onPress}
    //     >
    //         <Text style={styles.text}>{formattedDate}</Text>
    //         <Text style={styles.text}>{formattedTime}</Text>
    //         <Text style={styles.text}>{name}</Text>
    //         <Text style={styles.text}>{instructor}</Text>
    //     </TouchableOpacity>
    // )

    const Items = []
    classData.forEach((doc, idx) => {
        doc.active_times.forEach(({ formattedDate, formattedTime }) => {
            Items.push(
                <TouchableOpacity
                    style={styles.listItem}
                    key={idx}
                    onPress={doc.onPress}
                >
                    <Text style={styles.text}>{formattedDate}</Text>
                    <Text style={styles.text}>{formattedTime}</Text>
                    <Text style={styles.text}>{doc.name}</Text>
                    <Text style={styles.text}>{doc.instructor}</Text>
                </TouchableOpacity>
            )
        })
    })

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            {Items}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "88%",
        alignSelf: "center",
    },
    listItem: {
        marginVertical: 10,
        borderRadius: 30,
        backgroundColor: "white",
        alignItems: "center",
    },
    text: {
        fontFamily: fonts.default,
    },
})