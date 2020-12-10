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

  },
  subtitle: {
    fontFamily: 'LuloCleanW01-One',
  },
  body: {
    fontFamily: 'LuloCleanW01-One',
  },
  heading: {
    fontFamily: 'LuloCleanW01-OneBold',
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