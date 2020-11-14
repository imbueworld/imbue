import { useDimensions } from '@react-native-community/hooks'
import React from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AlgoliaSearchResultsCard from './AlgoliaSearchResultCard'



export default function AlgoliaSearchResultsTab(props) {
  const {
    containerStyle={},
    cardContainerStyle={},
    data: gyms,
    open=true,
  } = props
  const { window: { height } } = useDimensions()



  if (!open) return <View />

  const ResultCards = gyms.map(gym => {
    // if (gym.hidden_on_map) return
    // // Skip ones that don't have certain fields
    // if (!gym.name || !gym.formatted_address) return

    return (
      <AlgoliaSearchResultsCard
        key={gym.id}
        data={gym}
        containerStyle={cardContainerStyle}
      />
    )
  })

  return (
    <KeyboardAwareScrollView style={{
      height: height - 55, // 55 == the height of <AlgoliaSearchBar />
      borderRadius: 15,
      overflow: 'hidden',
    }} contentContainerStyle={containerStyle}>
      { ResultCards }
    </KeyboardAwareScrollView>
  )
}
