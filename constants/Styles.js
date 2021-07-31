import { Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();



export const FONTS = {
  ...Platform.select({
    ios: {
      luloClean: {
        fontFamily: 'LuloCleanW01-OneBold',
        fontWeight: 'normal',
      },
      title: {
        fontFamily: 'LuloCleanW01-OneBold',
      },
      subtitle: {
        fontFamily: 'LuloCleanW01-One',
      },
      textInput: {
        fontFamily: 'PlayfairDisplay-Black',
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
    },
    android: {
      luloClean: {
        fontFamily: 'LuloClean-Bold',
        fontWeight: 'normal',
      },
      title: {
        fontFamily: 'LuloClean-Bold',
      },
      subtitle: {
        fontFamily: 'LuloCleanThin',
      },
      body: {
        fontFamily: 'LuloCleanThin',
      },
      textInput: {
        fontFamily: 'PlayfairDisplay-Black',
      },
      heading: {
        fontFamily: 'LuloClean-Bold', 
        fontSize: 20,
      },
      cardTitle: {
        fontFamily: 'LuloClean-Bold',
        fontSize: 12,
      },
      cardBody: {
        fontFamily: 'LuloCleanThin',
        fontSize: 7,
      },
    },
  })
}