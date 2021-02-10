import { colors } from "./assets/js/contexts/Colors"
import { FONTS } from "./assets/js/contexts/Styles"



const config = {
  DEBUG: false,
  GOOGLE_API_KEY: 'AIzaSyBjP2VSTSNfScD2QsEDN1loJf8K1IlM_xM',
  styles: {
    GoBackButton_screenDefault: {
      position: 'absolute',
      top: 40,
      left: 0,
    },
    GoBackButton_rightSide_screenDefault: {
      position: 'absolute',
      top: 40,
      right: 10,
    },
    title: {
      ...FONTS.title,
      color: colors.accent,
      fontSize: 24,
    },
    subtitle: {
      ...FONTS.subtitle,
      color: colors.accent,
      fontSize: 20,
    },
    body: {
      ...FONTS.body,
      color: colors.accent,
      fontSize: 16,
    }
  },
}

export default config
