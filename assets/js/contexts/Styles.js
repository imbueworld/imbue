import { Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors } from "./Colors";
Feather.loadFont();



export const FONTS = {
  ...Platform.select({
    ios: {
      luloClean: {
        fontFamily: 'LuloCleanW01-OneBold',
        fontWeight: 'normal',
        color: colors.accent,
      }
    },
    android: {
      luloClean: {
        fontFamily: 'LuloClean-Bold',
        fontWeight: 'normal',
        color: colors.accent,
      }
    },
  }),
  title: {
    fontFamily: 'PlayfairDisplay-Black',
    fontWeight: '900',
    color: colors.accent,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontWeight: '500',
    color: colors.accent,
  },
  body: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontWeight: '400',
    color: colors.accent,
  },
}