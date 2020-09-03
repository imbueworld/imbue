import React from 'react'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { GoogleLogin } from '../../backend/GoogleLogin'
import Icon from '../Icon'



export default function GoogleLoginButton(props) {
    let cache = props.cache
    const accountType = props.accountType
    const onAuthChange = props.onAuthChange

    return (
        <TouchableHighlight
            style={{
                borderRadius: 999,
                ...props.containerStyle,
            }}
            underlayColor="#00000020"
            onPress={() => GoogleLogin(cache, accountType, onAuthChange)}
        >
            <Icon
                containerStyle={props.imageStyle}
                source={require("../img/google.png")}
            />
        </TouchableHighlight>
    )
}