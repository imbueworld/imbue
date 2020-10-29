import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { colors } from '../../contexts/Colors'
import Icon from '../Icon'



export default function RetryButton(props) {
  const {
    containerStyle={},
    imageStyle={},
    //
    onPress=() => {},
  } = props


  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableHighlight
        underlayColor='#00000020'
        style={{ width: '100%', height: '100%' }}
        onPress={onPress}
      >
        <>
        <Icon
          containerStyle={styles.circle}
          source={require('../img/png/circle.png')}
        />
        <Icon
          containerStyle={styles.retry}
          style={imageStyle}
          source={require('../img/png/redo.png')}
        />
        </>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    backgroundColor: colors.buttonAccent,
    borderRadius: 999,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  retry: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 10,
  },
})