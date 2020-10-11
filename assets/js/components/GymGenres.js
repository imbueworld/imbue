import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



export default function GymGenres(props) {
  const {
    containerStyle={},
    style={},
    textStyle={},
    //
    data: genres=[],
    gapSize=10,
    maxGenres=3,
  } = props



  const Genres = genres.map((genreName, idx) => {
    if (idx >= maxGenres) return

    return (
      <View
        key={genreName}
        style={{
          borderColor: colors.accent,
          borderWidth: 1,
          borderRadius: 999,
          padding: 5,
          marginLeft: idx != 0 ? gapSize : 0,
          ...style,
        }}
      >
        <Text style={{
          ...FONTS.body,
          ...textStyle,
        }}>{ genreName }</Text>
      </View>
    )
  })

  return (
    <View style={{
      flexDirection: 'row',
      ...containerStyle,
    }}>
      { Genres }
    </View>
  )
}