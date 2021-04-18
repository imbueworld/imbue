import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FONTS} from '../contexts/Styles';
import CloseButton from './CloseButton';
import Icon from './Icon';
import {publicStorage} from '../backend/BackendFunctions';
import {colors, simpleShadow} from '../contexts/Colors';

export default function GymBadgeV2(props) {
  const {
    containerStyle = {},
    //
    gym,
    proceedText = 'More Info',
    onX = () => {},
    onProceed = () => {},
  } = props;

  // Extracting information from the standard gym object
  let {name, description, icon_uri: icon_id} = gym;

  const [icon_uri, setIconUri] = useState();

  // Either fetches from Firebase Storage or gets the cached link,
  // upon every render
  useEffect(() => {
    const retrieve = async () => {
      setIconUri(await publicStorage(icon_id));
    };
    retrieve();
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <CloseButton containerStyle={styles.X} onPress={onX} />

      <View style={styles.main}>
        <Icon containerStyle={styles.icon} source={{uri: icon_uri}} />
        <View style={styles.section__Description}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.description} numberOfLines={4}>
            {description}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.proceedButton} onPress={onProceed}>
        <Text style={styles.proceedText}>{proceedText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '88%',
    alignSelf: 'center',
  },
  X: {
    position: 'absolute',
    width: 35,
    height: 35,
    top: 10,
    right: 10,
  },
  main: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  section__Description: {
    height: 100,
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    textAlign: 'justify',
  },
  name: {
    ...FONTS.title,
    fontSize: 20,
  },
  description: {
    ...FONTS.body,
    fontSize: 15,
  },
  icon: {
    width: 75,
    height: 75,
    borderRadius: 999,
    overflow: 'hidden',
    // ...simpleShadow,
  },
  proceedButton: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonFill,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  proceedText: {
    ...FONTS.body,
    fontSize: 13,
    color: colors.buttonAccent,
  },
});
