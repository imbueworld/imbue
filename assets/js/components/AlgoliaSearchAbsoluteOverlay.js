import React, {useState} from 'react';
import {View} from 'react-native';
import {back} from 'react-native/Libraries/Animated/src/Easing';
import {colors} from '../contexts/Colors';
import AlgoliaSearchBar from './AlgoliaSearchBar';
import AlgoliaSearchResultsTab from './AlgoliaSearchResultsTab';

export default function AlgoliaSearchAbsoluteOverlay(props) {
  const {containerStyle = {}} = props;

  const [searchResults, setSearchResults] = useState([]);
  const [resultPanelIsOpen, setResultPanelIsOpen] = useState(false);

  return (
    <View
      style={{
        width: '100%',
        // position: 'absolute',
        ...containerStyle,
      }}>
      <View>
        <AlgoliaSearchBar
          containerStyle={{
            marginHorizontal: 10,
            marginVertical: 5,
            backgroundColor: "#242429",
            marginVertical: 20,
          }}
          onX={() => setResultPanelIsOpen(false)}
          onSearchResult={({hits}) => {
            setSearchResults(hits);
            setResultPanelIsOpen(true);
          }}
        />
      </View>

      <AlgoliaSearchResultsTab
        open={resultPanelIsOpen}
        containerStyle={{margin: 10}}
        cardContainerStyle={{margin: 10}}
        data={searchResults}
        backgroundColor={colors.bg}
      />
    </View>
  );
}
