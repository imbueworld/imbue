import { Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();


export const fonts = {
    default: Platform.OS === "android"
        ?   'sans-serif-light'
        :   'Avenir-Light',
    android: 'sans-serif-light',
    iOS: 'Avenir-Light',
}

export const FONTS = {
    ...Platform.select({
        ios: {
            luloClean: {
                fontFamily: 'LuloCleanW01-OneBold',
                fontWeight: 'normal',
            }
        },
        android: {
            luloClean: {
                fontFamily: 'LuloClean-Bold',
                fontWeight: 'normal',
            }
        },
    }),
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