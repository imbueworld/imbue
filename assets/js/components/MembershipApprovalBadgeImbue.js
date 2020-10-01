import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Notification from './Notification'
import Icon from './Icon'



export default function MembershipApprovalBadgeImbue(props) {
    let gym = props.data
    let text

    if (gym) {
        text =
        `You have the Imbue Universal Gym Membership! ` +
        `You have access to all online content that ${gym.name} provides, ` +
        `as well as in studio classes that they provide.`
    } else {
        text =
        `You have the Imbue Universal Gym Membership! ` +
        `You have access to all online content and in studio classes ` +
        `that gyms partnered with Imbue provide.`
    }
    

    return (
        <Notification containerStyle={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#6d13f2",
            ...props.containerStyle,
        }}>
            <Icon
                containerStyle={{
                    marginLeft: 15,
                }}
                source={require('./img/png/checkmark-3.png')}
            />
            <Text style={{
                flex: 1,
                marginLeft: 15,
                paddingVertical: 10,
                paddingRight: 20,
                color: "white",
                textAlign: "justify",
                fontSize: 13,
            }}>{text}</Text>
        </Notification>
    )
}

const styles = StyleSheet.create({})