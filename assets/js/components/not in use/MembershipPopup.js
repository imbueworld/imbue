import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import CustomPopup from "../CustomPopup"
import CustomButton from "../CustomButton"



export default function MembershipPopup(props) {
    let popup = props.data

    return (
        <CustomPopup
            containerStyle={styles.container}
            onX={props.onX}
        >
            <Text>{popup.name}</Text>
            <Text>Membership</Text>
            <Text>
                Benefits:
                - Includes access to all online classes, that are streamed by the gym.
            </Text>
            <View style={{
                flexDirection: "row",
            }}>
                <CustomButton
                    style={{
                        flex: 1,
                    }}
                    title="Purchase"
                    onPress={props.onProceed}
                />
                <CustomButton
                    style={{
                        flex: 1,
                    }}
                    title="Cancel"
                    onPress={props.onX}
                />
            </View>
        </CustomPopup>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
})