import React from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {FacebookLogin} from '../../backend/FacebookLogin';
import Icon from '../Icon';

export default function FacebookLoginButton(props) {
  const {accountType, onAuthChange, setLoading} = props;

  return (
    <TouchableHighlight
      style={{
        borderRadius: 999,
        ...props.containerStyle,
      }}
      underlayColor="#00000020"
      onPress={() => {
        setLoading(true);
        FacebookLogin(accountType, onAuthChange).finally(() =>
          setLoading(false),
        );
      }}>
      <Icon
        containerStyle={props.imageStyle}
        source={require('../img/facebook.png')}
      />
    </TouchableHighlight>
  );
}
