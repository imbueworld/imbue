import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

import ProfileLayout from '../layouts/ProfileLayout';
import NewClassForm from '../components/NewClassForm';
import CustomSmallButton from '../components/CustomSmallButton';
import {colors} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';
import User from '../backend/storage/User';

export default function PartnerCreateClass(props) {
  const [page, setPage] = useState('overview');
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = new User();
      const userDoc = await user.retrieveUser();

      const classes = (await user.retrieveClasses()).map((it) => it.getAll());

      setUser(userDoc);
      setClasses(classes);
      //console.log('classDoc: ' + JSON.stringify(classDoc));
    };
    init();
  }, []);

  if (!user || !classes) return <View />;

  const Classes = classes.map((classDoc, idx) => (
    <View
      key={idx}
      style={{
        height: 72,
        marginTop: idx !== 0 ? 10 : 0,
        backgroundColor: colors.buttonFill,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableHighlight onPress={() => console.log('pressed')}>
        <Text
          style={{
            ...FONTS.body,
            color: colors.buttonAccent,
            fontSize: 20,
          }}>
          {classDoc.name}
        </Text>
      </TouchableHighlight>
    </View>
  ));

  let PageContent;
  PageContent = (
    <>
      <NewClassForm />
    </>
  );

  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}>
      {PageContent}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
  },
  container: {},
});
