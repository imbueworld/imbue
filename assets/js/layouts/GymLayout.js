import React, { useEffect } from 'react'
import { StyleSheet, ScrollView, View, Image } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomCapsule from '../components/CustomCapsule'
import { publicStorage } from '../backend/HelperFunctions'



/**
 * props
 * .data -- gym data
 * .containerStyle
 * .innerContainerStyle
 * .children
 */
export default function GymLayout(props) {
    // let cache = props.cache
    let gym = props.data

    // useEffect(() => {
    //     const init = async() => {
    //     }
    //     init()
    // }, [])

    useEffect(() => {}, [])
    
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            <CustomCapsule
                containerStyle={[
                    styles.container,
                    props.containerStyle,
                ]}
                innerContainerStyle={[
                    styles.innerContainer,
                    props.innerContainerStyle,
                ]}
            >

                <Image
                    style={styles.image}
                    source={{ uri: publicStorage(gym.image_uris[0]) }}
                />
                
                <View style={{
                    paddingHorizontal: 10,
                }}>
                    {props.children}
                </View>

            </CustomCapsule>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        width: "88%",
        marginVertical: 30,
        alignSelf: "center",
    },
    innerContainer: {
        paddingHorizontal: 0,
    },
    image: {
        width: "100%",
        height: "100%",
        height: 300,
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    }
})