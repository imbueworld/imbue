import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'
import { publicStorage } from '../backend/BackendFunctions'
import { FONTS } from '../contexts/Styles'
import GymGenres from './GymGenres'
import Icon from './Icon'
import { colors } from '../contexts/Colors'
import { useNavigation } from '@react-navigation/native'
import { TouchableHighlight } from 'react-native-gesture-handler'



export default function AlgoliaSearchResultsCard(props) {

  console.log("props: ", props.data)
  const { 
    containerStyle={},
  } = props

  const {
    image_uri: gymIconUri, 
    genres,
    formatted_address,
    description,
    name,
    id: gymId,
  } = props.data


  const {
    window: { width, height },
  } = useDimensions()
  const cardIconLength = width / 3.75
  const navigation = useNavigation()

  const [iconUri, setIconUri] = useState('')

  // Init
  useEffect(() => {
    const init = async () => {
      let promises = []
      promises.push(publicStorage(gymIconUri))
      const res = await Promise.all(promises)
      setIconUri(res[ 0 ])
    }; init()
  }, [])


  console.log("gymId: " + gymId)

  return (
    <View style={{
      height: cardIconLength * 1,
      backgroundColor: colors.buttonFill,
      borderRadius: 25,
      overflow: 'hidden',
      ...containerStyle,
    }}>
      <TouchableHighlight
        underlayColor='#F9F9F9'
        style={{ height: '100%' }}
        onPress={() => navigation.navigate('GymDescription', props.data )}
      >
        <>

          <View style={{
            height: cardIconLength,
            flexDirection: 'row',
          }}>
            <Icon
              containerStyle={{
                width: cardIconLength * .85,
                height: cardIconLength * .85,
                marginTop: 7,
                marginLeft: 5,
                borderRadius: 25,
                overflow: 'hidden',
              }}
              source={{ uri: iconUri }} 
            />

            <View style={{
              flex: 1,
              padding: 5,
            }}>
              <Text numberOfLines={1} style={styles.title}>{ name }</Text>
              {/* <GymGenres data={genres} /> */}
              <Text numberOfLines={2} style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              ...styles.body,
            }}>{ description }</Text>
              {/* <Text numberOfLines={1} style={styles.body}>{ formatted_address }</Text> */}
            </View>
          </View>

          {/* <View>
            <Text numberOfLines={2} style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              ...styles.body,
            }}>{ description }</Text>
          </View> */}

        </>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.title,
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 15,
    color: "#F9F9F9"
  },
  body: {
    ...FONTS.body,
    color: "#F9F9F9"
  },
})
