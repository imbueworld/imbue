import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Notification from './Notification'
import Icon from './Icon'
import { colors } from '../contexts/Colors'



export default function MembershipApproval(props) {
    let gym = props.data

    return (
        <Notification containerStyle={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.checkmarkgreen,
            ...props.containerStyle,
        }}>
            <Icon
                containerStyle={{
                    marginLeft: 15,
                }}
                source={require("./img/png/checkmark.png")}
            />
            <Text style={{
                flex: 1,
                marginLeft: 15,
                paddingVertical: 10,
                paddingRight: 20,
                textAlign: "justify",
                fontSize: 13,
            }}>You have the {gym.name} Gym Online Membership! You have access to all online content that they provide.</Text>
        </Notification>
    )
}

const styles = StyleSheet.create({})