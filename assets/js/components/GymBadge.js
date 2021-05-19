import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {colors, simpleShadow} from '../contexts/Colors';
import Icon from './Icon';
import CloseButton from './CloseButton';
import {FONTS} from '../contexts/Styles';

export default function GymBadge(props) {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View
        style={{
          padding: 12,
          backgroundColor: '#FFFFFF',
          borderRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}>
        <View style={styles.infoContainer}>
          <Icon
            containerStyle={{
              width: 75,
              height: 75,
              borderRadius: 999,
              overflow: 'hidden',
              // ...simpleShadow,
            }}
            source={{uri: props.iconUri}}
          />
          <View style={styles.desc}>
            <Text style={styles.name} numberOfLines={1}>
              {props.name}
            </Text>
            <Text style={styles.slogan} numberOfLines={4}>
              {props.desc}
            </Text>
          </View>
        </View>

        {/* <View style={styles.infoContainer}>
                    <Text style={styles.font}>
                        {props.rating}
                    </Text>
                    <Text style={styles.font}>
                        {props.relativeDistance}
                    </Text>
                </View> */}
      </View>

      <TouchableOpacity
        style={styles.moreInfoContainer}
        onPress={props.onMoreInfo}>
        <Text
          style={{
            ...styles.moreInfoText,
            ...styles.font,
          }}>
          More Info
        </Text>
      </TouchableOpacity>

      <CloseButton containerStyle={styles.X} onPress={props.onX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '88%',
    position: 'absolute',
    alignSelf: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desc: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    textAlign: 'justify', // Android reqs: Android Oreo (8.0) or above (API level >= 26)
  },
  name: {
    ...FONTS.title,
    fontSize: 20,
  },
  slogan: {
    ...FONTS.body,
    fontSize: 15,
  },
  // subInfoContainer: {},
  moreInfoContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#000',

    // borderColor: `${colors.gray}80`,
    borderColor: `${colors.buttonFill}80`,
    borderTopWidth: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  moreInfoText: {
    fontSize: 13,
    color: '#fff',
  },
  font: {
    ...FONTS.body,
  },
  X: {
    width: 35,
    height: 35,
    position: 'absolute',
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
});
