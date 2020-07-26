import { RNDomInstance } from "react-native-dom"
import RCTVideoManager from 'react-native-video/dom/RCTVideoManager' // Add this

// Path to RN Bundle Entrypoint ================================================
const rnBundlePath = "./entry.bundle?platform=dom&dev=true"

// React Native DOM Runtime Options =============================================
const ReactNativeDomOptions = {
  enableHotReload: false,
  nativeModules: [RCTVideoManager] // Add this
}