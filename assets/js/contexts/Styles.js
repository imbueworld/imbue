import { Platform } from "react-native";



export const fonts = {
    default: Platform.OS === "android"
        ?   'sans-serif-light'
        :   'Avenir-Light',
    android: 'sans-serif-light',
    iOS: 'Avenir-Light',
}

export const FONTS = {
    luloClean: {
        fontFamily: 'LuloClean-Bold',
        fontWeight: 'normal',
    },
    title: {
        fontFamily: 'PlayfairDisplay-Black',
        fontWeight: '900',
    },
    subtitle: {
        fontFamily: 'PlayfairDisplay-Medium',
        fontWeight: '500',
    },
    body: {
        fontFamily: 'PlayfairDisplay-Regular',
        fontWeight: '400',
    },
}