import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { colors } from '../contexts/Colors'
import { fonts } from '../contexts/Styles'



export default function LivestreamMessages(props) {
    let chat = props.chat
    const user = props.user

    // Sort the data by timestamp
    chat = chat.sort((a, b) => {
        let ts1 = a.timestamp
        let ts2 = b.timestamp
        return ts1 - ts2
    })

    const Message = props =>
        <View style={{ flexDirection: props.stickToRight ? "row-reverse" : "row" }}>
            <View style={props.containerStyle}>
                <Text style={{
                    fontFamily: fonts.default,
                    ...props.labelStyle,
                }}>{props.name}</Text>
                <Text style={{
                    fontFamily: fonts.default,
                    ...props.style,
                }}>{props.message}</Text>
            </View>
        </View>
    
    return chat.map(({ name, message, uid }, idx) =>
        <Message
            // Message text style
            containerStyle={
                uid === user.id
                ?   styles.selfMsg
                :   styles.msg
            }
            labelStyle={styles.label}
            style={
                uid === user.id
                ?   styles.selfMsgText
                :   styles.msgText
            }
            stickToRight={
                uid === user.id
                ?   true
                :   false
            }
            name={name}
            message={message}
            key={idx}
        />
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
    },
    msg: {
        maxWidth: "88%",
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#00000008",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 30,
    },
    msgText: {
        textAlign: "justify",
        fontSize: 17,
    },
    selfMsg: {
        maxWidth: "88%",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "flex-end",
        backgroundColor: "white",
        borderRadius: 30,
    },
    selfMsgText: {
        textAlign: "justify",
        fontSize: 17,
    },
})