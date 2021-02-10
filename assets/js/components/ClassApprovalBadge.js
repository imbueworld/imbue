import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Icon from './Icon'
import Notification from './Notification'



export default function ClassApprovalBadge(props) {
    return (
        <Notification containerStyle={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "beige", // also try bisque
            ...props.containerStyle,
        }}>
            <Icon
                containerStyle={{
                    marginLeft: 15,
                }}
                source={require("./img/png/checkmark-2.png")} // do minus "-2" probably
            />
            <Text style={{
                flex: 1,
                marginLeft: 15,
                paddingVertical: 10,
                paddingRight: 20,
                textAlign: "justify",
                fontSize: 13,
            }}>You have signed up for this class. Now just make sure to be ready for when it goes Live!</Text>
        </Notification>
    )
}

const styles = StyleSheet.create({})