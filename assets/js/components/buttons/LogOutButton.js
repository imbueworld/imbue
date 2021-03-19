import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '../Icon';
import {simpleShadow} from '../../contexts/Colors';
import {useNavigation} from '@react-navigation/native';
import {logOutAndRedirect} from '../../backend/HelperFunctions';
import config from '../../../../App.config';

/**
 * By default log outs the user from everywhere and redirects to Boot screen.
 */
export default function LogOutButton(props) {
  const navigation = useNavigation();
  const {
    containerStyle = {},
    //
    onPress = () => logOutAndRedirect(navigation),
    onLongPress = config.DEBUG ? () => logOutAndRedirect(navigation) : () => {}, // Why? Because sometimes, when React Native Debugger is enabled, the simple onPress doesn't register.
  } = props;

  return (
    <View
      style={{
        // backgroundColor: "white",
        // borderRadius: 999,
        zIndex: 110,
        // ...simpleShadow,
        // ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          // padding: 10,
          // left: 2,
          // borderRadius: 999,
        }}
        // underlayColor="#00000020"
        onPress={onPress}
        onLongPress={onLongPress}>
        <>
          {/* <Icon
          containerStyle={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          source={require("../img/png/circle.png")}
        /> */}
          <Icon
            containerStyle={{
              width: '100%',
              height: '100%',
              padding: 11,
              left: 2,
            }}
            source={require('../img/png/logout.png')}
          />
        </>
      </TouchableOpacity>
    </View>
  );
}
