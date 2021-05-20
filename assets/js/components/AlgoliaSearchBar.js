import React, { useState } from 'react'
import { Keyboard, View } from 'react-native'
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler'
import { algoliaSearch } from '../backend/BackendFunctions'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'
import Icon from './Icon'



export default function AlgoliaSearchBar(props) {
  const {
    containerStyle={},
    textStyle={},
    //
    onSearchStateChange=() => {}, // returns bool
    onSearchResult=() => {}, // returns search result data
    onX=() => {}, // returns void
  } = props

  const [searchText, setSearchText] = useState('')
  const [searchIsInProgress, setSearchIsInProgress] = useState(false)

  const search = async query => {
    setSearchIsInProgress(true)
    onSearchStateChange(true)

    const res = await algoliaSearch(query)
    onSearchResult(res)

    setSearchIsInProgress(false)
    onSearchStateChange(false)
  }

  const closeSearch = () => {
    setSearchText('')
    Keyboard.dismiss()
    onX()
  }



  return (
    <View style={{
      height: 55,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: colors.textInputFill,
      borderRadius: 25,
      paddingLeft: 15,
      overflow: 'hidden',
      
      ...containerStyle,
    }}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
      }}>
        <TextInput
          style={{
            color: colors.textInputPlaceholderLight,
            flex: 1,
            ...FONTS.body,
            fontSize: 8,
            ...textStyle,
            
          }}
          placeholder={'Search for an influencer...'}
          placeholderTextColor = {colors.textInputPlaceholderLight}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <View style={{
            height: '100%',
            position: 'absolute',
            right: 0,
            alignSelf: 'center',
            backgroundColor: '#00000012',
            color: '#000'
            
          }}>
            <TouchableHighlight onPress={closeSearch} underlayColor='#00000012' style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
              <Icon
                containerStyle={{
                  width: 30,
                  height: 30,
                  color: "#fff"
                }}
                source={require('../components/img/png/x-3.png')}
              />
            </TouchableHighlight>
          </View>
        ) : null}
      </View>

      <TouchableHighlight
        onPress={() => search(searchText)}
        underlayColor={colors.accent}
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 15,
          paddingLeft: 15,
          backgroundColor: colors.accent,
        }}
      >
        <Icon
          containerStyle={{
            width: 30,
            height: 30,
          }}
          source={require('../components/img/png/search-white.png')}
        />
      </TouchableHighlight>
    </View>
  )
}