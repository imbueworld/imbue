import { Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();



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
  heading: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontWeight: '900',
    fontSize: 20,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay-Black',
    fontSize: 12,
  },
  cardBody: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 10,
  },
}