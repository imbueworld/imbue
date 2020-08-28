import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import CustomPopup from '../CustomPopup'
import { retrieveAttendees } from '../../backend/CacheFunctions'
import Icon from '../Icon'
import { publicStorage } from '../../backend/HelperFunctions'
import { colors } from '../../contexts/Colors'
import { fonts } from '../../contexts/Styles'
import { ScrollView } from 'react-native-gesture-handler'
import AttendeeCard from '../AttendeeCard'



export default function AttendeesPopup(props) {
    let cache = props.cache

    if (!props.classId || !props.timeId) throw new Error("classId and timeId both need to be provided.")
    let [classId, timeId] = [props.classId, props.timeId]

    const [attendees, setAttendees] = useState(null)
    const [byPurchase, setByPurchase] = useState(null)
    const [bySchedule, setBySchedule] = useState(null)

    const [ByPurchase, ByPurchaseCreate] = useState(null)
    const [BySchedule, ByScheduleCreate] = useState(null)

    useEffect(() => {
        const init = async () => {
            let attendees = await retrieveAttendees(cache, { classId, timeId })
            setAttendees(attendees)
        }
        init()
    }, [])

    // Separates the attendees into two categories:
    //   -  Those who pruchased One Time Class
    //   -  Those who scheduled it on the basis of having a membership
    useEffect(() => {
        if (!attendees) return

        let byPurchase = []
        let bySchedule = []
        attendees.forEach(client => {
            switch (client.purchase_method) {
                case "class":
                    byPurchase.push(client)
                    break
                case "membership":
                    bySchedule.push(client)
                    break
            }
        })
        setByPurchase(byPurchase)
        setBySchedule(bySchedule)
    }, [attendees])

    // const AttendeeCard = ({ icon_uri, first, last }) =>
    //     <View style={{
    //         flexDirection: "row",
    //         flexWrap: "nowrap",
    //         height: 72,
    //         paddingHorizontal: "6%",
    //         justifyContent: "space-between",
    //         alignItems: "center",
    //         backgroundColor: "#00000012",
    //         borderColor: colors.gray,
    //         borderWidth: 1,
    //         borderRadius: 40,
    //     }}>
    //         <Icon
    //             containerStyle={{
    //                 width: 54,
    //                 height: 54,
    //                 borderRadius: 999,
    //                 overflow: "hidden",
    //             }}
    //             source={{ uri: publicStorage(icon_uri) }}
    //         />
    //         <Text style={{
    //             flex: 1,
    //             textAlign: "center",
    //             fontSize: 18,
    //             fontFamily: fonts.default,
    //         }}>{`${first} ${last}`}</Text>
    //     </View>
    
    useEffect(() => {
        if (!byPurchase) return
        if (!bySchedule) return

        ByPurchaseCreate(
            byPurchase.map((attendeeDoc, idx) =>
                <View key={idx} style={{
                    // marginTop: idx !== 0 ? 10 : 0,
                    marginTop: 10,
                }}>
                    <AttendeeCard {...attendeeDoc} />
                </View>
            )
        )

        ByScheduleCreate(
            bySchedule.map((attendeeDoc, idx) =>
                <View key={idx} style={{
                    // marginTop: idx !== 0 ? 10 : 0,
                    marginTop: 10,
                }}>
                    <AttendeeCard {...attendeeDoc} />
                </View>
            )
        )
    }, [byPurchase, bySchedule])


    
    if (!ByPurchase || !BySchedule) return <View />

    const FauxUser = 
        <View style={{
            marginTop: 10,
        }}>
            <AttendeeCard {...{
                first: `Your future client`,
                last: `\n(will show up here)`,
                icon_uri: "default-icon.png",
            }} />
        </View>

    return (
        <CustomPopup onX={props.onX}>
            <ScrollView>
                <View style={{
                    marginVertical: 20,
                }}>
                    <Text style={styles.title}>
                        People who have purchased the class
                    </Text>
                    {ByPurchase.length === 0
                    ? FauxUser
                    : ByPurchase}
                    
                    <View style={{
                        height: 20,
                    }}/>

                    <Text style={styles.title}>
                        People who have this class on their schedule
                    </Text>
                    <Text style={styles.subtitle}>
                        (excludes people in the list above)
                    </Text>
                    {BySchedule.length === 0
                    ? FauxUser
                    : BySchedule}
                </View>
            </ScrollView>
        </CustomPopup>
    )
}

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: "6%",
        textAlign: "center",
        fontSize: 20,
        fontFamily: fonts.default,
    },
    subtitle: {
        paddingHorizontal: "6%",
        textAlign: "center",
        fontSize: 14,
        fontFamily: fonts.default,
    },
})