import React from 'react'
import { Marker } from 'react-native-maps'
import GymBadgeV2 from './GymBadgeV2'



export function CreateMarkers(gyms, setSelectedGymId) {
  const ImbueMarkers = []

  for (let gym of gyms) {
    let {
      hidden_on_map,
      coordinates,
      id,
    } = gym
    if (hidden_on_map || !coordinates) continue
    let { latitude, longitude } = coordinates

    ImbueMarkers.push(
      <Marker
        coordinate={{ latitude, longitude }}
        key={id}
        onPress={() => setSelectedGymId(id)}
      />
    )
  }

  return ImbueMarkers
}

export function CreateBadge(gyms, setSelectedGymId, selectedGymId, navigation={ navigate: () => {} }) {
  for (let gym of gyms) {
    if (gym.id == selectedGymId) {
      return <GymBadgeV2
        containerStyle={{ bottom: 40 }}
        gym={gym}
        onProceed={() => {
          navigation.navigate('GymDescription', { gymId: gym.id })
        }}
        onX={() => setSelectedGymId(null)}
      />
    }
  }
}