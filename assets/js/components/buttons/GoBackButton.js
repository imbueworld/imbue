import React from 'react';
import {View} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from '../Icon';
import {simpleShadow} from '../../contexts/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function GoBackButton(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    containerStyle = {},
    imageContainerStyle = {},
    imageStyle = {},
    //
    onPress = () => {
      console.log(route.name);
      if (
        Object.getOwnPropertyNames(route.params).length === 1 &&
        route.name === 'GymDescription'
      ) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Boot'}],
        });
      } else {
        navigation.goBack();
      }
    },
  } = props;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 999,
        zIndex: 110,
        // ...simpleShadow,
        ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          borderRadius: 999,
        }}
        // underlayColor="#00000020"
        onPress={onPress}>
        <Icon
          containerStyle={{
            width: 50,
            height: 50,
            ...imageContainerStyle,
          }}
          imageStyle={imageStyle}
          source={require('../img/png/back-button-3.png')}
        />
      </TouchableOpacity>
    </View>
  );
}
