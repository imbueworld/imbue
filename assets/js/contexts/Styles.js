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
    fontFamily: 'LuloCleanW01-OneBold',
    fontWeight: '900',
  },
  subtitle: {
    fontFamily: 'LuloCleanW01-One',
    fontWeight: '500',
  },
  body: {
    fontFamily: 'LuloCleanW01-One',
    fontWeight: '400',
  },
  heading: {
    fontFamily: 'LuloCleanW01-OneBold',
    fontWeight: '900',
    fontSize: 20,
  },
  cardTitle: {
    fontFamily: 'LuloCleanW01-OneBold',
    fontSize: 12,
  },
  cardBody: {
    fontFamily: 'LuloCleanW01-One',
    fontSize: 7,
  },
}