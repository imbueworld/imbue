import { useDimensions } from '@react-native-community/hooks'
import React from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AlgoliaSearchResultsCard from './AlgoliaSearchResultCard'



export default function AlgoliaSearchResultsTab(props) {
  const {
    containerStyle={},
    cardContainerStyle={},
    data: partners,
    open=true,
  } = props
  const { window: { height } } = useDimensions()


  if (!open) return <View />

  const ResultCards = partners.map(partner => {
    // if (partner.hidden_on_map) return
    // Skip ones that don't have certain fields
    // if (!partner.first || !partner.formatted_address) return

    return (
      <AlgoliaSearchResultsCard
        key={partner.id}
        data={partners}
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