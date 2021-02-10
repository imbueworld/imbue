import React from 'react'
import { StyleSheet, View, Text } from 'react-native'



export default function CreditCardList(props) {
    let CCData = props.data

    const Cards = CCData.map((doc, idx) => 
        <View
            style={styles.creditCardContainer}
            key={idx}
        >
            <Text styles={styles.creditCardText}>
                {`${doc.brand}  |  ending in ${doc.last4}`}
            </Text>
        </View>
    )

    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            {Cards}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
})