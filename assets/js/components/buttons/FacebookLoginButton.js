import React from 'react'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { FacebookLogin } from '../../backend/FacebookLogin'
import Icon from '../Icon'



export default function FacebookLoginButton(props) {
    let accountType = props.accountType
    
    return (
        <TouchableHighlight
            style={{
                borderRadius: 999,
                ...props.containerStyle,
            }}
            underlayColor="#00000020"
            onPress={() => FacebookLogin(accountType)}
        >
            <Icon
                containerStyle={props.imageStyle}
                source={require("../img/facebook.png")}
            />
        </TouchableHighlight>
    )
}