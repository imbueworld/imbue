import { Platform } from "react-native";



export const fonts = {
    default: Platform.OS === "android"
        ?   'sans-serif-light'
        :   'Avenir-Light',
    android: 'sans-serif-light',
    iOS: 'Avenir-Light',
}