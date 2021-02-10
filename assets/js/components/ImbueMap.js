// import { useNavigation } from '@react-navigation/native'
// import React, { useEffect, useState } from 'react'
// import { StyleSheet } from 'react-native'
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
// import config from '../../../App.config'
// import GymsCollection from '../backend/storage/GymsCollection'
// import { mapStyle3 } from '../contexts/MapStyle'
// import RetryButton from './buttons/RetryButton'
// import { CreateMarkers, CreateBadge } from './ImbueMap.backend'



// export default function ImbueMap(props) {
//   const { 
//     style={},
//     //
//     initialRegion={
//       latitude: 37.78825,
//       longitude: -122.4324,
//       latitudeDelta: 0.1,
//       longitudeDelta: 0.1,
//     },
//   } = props

//   const navigation = useNavigation()
//   const [gyms, setGyms] = useState([])
//   const [currentMapCoords, setCurrentMapCoords] = useState(initialRegion)
//   const [selectedGymId, setSelectedGymId] = useState()
//   const [mapRefresh, refreshMap] = useState(0)

//   // Init
//   useEffect(() => {
//     const init = async () => {
//       const gyms = await (new GymsCollection)
//         .retrieveGymsBasedOnLocation(currentMapCoords)
//       setGyms(gyms)
//     }; init()
//   }, [mapRefresh])



//   const ImbueMarkers = CreateMarkers(gyms, setSelectedGymId)
//   const GymBadge = CreateBadge(gyms, setSelectedGymId, selectedGymId, navigation)

//   return (
//     <>
//     {/* <RetryButton
//       containerStyle={styles.RetryButton}
//       onPress={() => refreshMap(c => c + 1)}
//     /> */}
//     { GymBadge }
//     <MapView
//       style={[styles.map, style]}
//       initialRegion={initialRegion}
//       customMapStyle={mapStyle3}
//       provider={PROVIDER_GOOGLE}
//       onRegionChangeComplete={setCurrentMapCoords}
//     >
//       { ImbueMarkers }
//     </MapView>
//     </>
//   )
// }

// const styles = StyleSheet.create({
//   map: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   RetryButton: {
//     ...config.styles.GoBackButton_rightSide_screenDefault,
//     width: 64,
//     height: 64,
//   },
// })