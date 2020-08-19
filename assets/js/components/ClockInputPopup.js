import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView, FlatList } from 'react-native-gesture-handler'



export default function ClockInputPopup(props) {
    let hours = []
    for (let i = 0; i <= 59; i++) {
        hours.push({ id: i, title: i })
    }

    return (
        <View
            style={{
                // width: props.width,
                // height: props.height,
                // position: "absolute",
                // backgroundColor: "white",
                // ...simpleShadow,
                zIndex: 110,
                ...props.style,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                snapToInterval={60} // item height
                decelerationRate="fast"
                fadingEdgeLength={200}
                onScroll={event => console.log(event.nativeEvent)}
            >
                {props.children}
            </ScrollView>
            {/* <FlatList
                data={props.children}
                renderItem={({ item }) => item}
                

                showsVerticalScrollIndicator={false}
                snapToInterval={60} // item height
                decelerationRate="fast"
                fadingEdgeLength={200}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({})