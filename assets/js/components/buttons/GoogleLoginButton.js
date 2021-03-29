import React from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {GoogleLogin} from '../../backend/GoogleLogin';
import Icon from '../Icon';

export default function GoogleLoginButton(props) {
  const {
    accountType,
    onAuthChange = () => {},
    onError = () => {},
    setLoading = () => {},
  } = props;

  return (
    <TouchableHighlight
      style={{
        borderRadius: 999,
        ...props.containerStyle,
      }}
      underlayColor="#00000020"
      onPress={() => {
        setLoading(true);
        GoogleLogin(accountType, onAuthChange, onError).finally(() =>
          setLoading(false),
        );
      }}>
      <Icon
        containerStyle={props.imageStyle}
        source={require('../img/google.png')}
      />
    </TouchableHighlight>
  );
}
