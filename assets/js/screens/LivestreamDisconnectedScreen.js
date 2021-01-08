import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl, Platform } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'
import CustomButton from "../components/CustomButton"

import { useNavigation } from '@react-navigation/native'
import GoHomeButton from '../components/buttons/GoHomeButton'
import config from '../../../App.config' 
import User from '../backend/storage/User'
import Icon from '../components/Icon'
import { colors } from "../contexts/Colors"
import { FONTS } from '../contexts/Styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { publicStorage } from '../backend/BackendFunctions'


export default function LivestreamDisconnectedScreen(props) {
  const { gymId } = props.route.params
  const { classDoc } = props.route.params
  let navigation = useNavigation()

  const { width, height } = useDimensions().window
  const cardIconLength = width / 4

  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [r, refresh] = useState(0)
  const [liveStatus, setLiveStatus] = useState(null)
  const [gymImage, setGymImage] = useState(null)
  const [fillerText, setFillerText] = useState(null)

  const [refreshing, setRefreshing] = React.useState(false);
  const [gymName, setGymName] = useState(null)
  const [playbackLink, setPlaybackLink] = useState(null)


  useEffect(() => {
    const init = async () => {
      const user = new User()

      setUser(await user.retrieveUser())
      setUserId(user.uid)
      
      await firestore()
        .collection('gyms')
        .doc(gymId)
        .get()
        .then(documentSnapshot =>  {      
          setGymName(documentSnapshot.data().name)
          setFillerText(`${documentSnapshot.data().name} is not live. Try pulling down to refresh...`)
          getGymImage(documentSnapshot.data().image_uri)
        });

        // Get livestatus
        getLiveStatus()


    }; init()
  }, [])


  const getLiveStatus = async() => {
    let thisPlaybackId
    await firestore()
      .collection('gyms')
      .doc(gymId)
      .get()
      .then(documentSnapshot =>  {      
        thisPlaybackId  = documentSnapshot.data().playback_id
      });

    let docu
    const snapshot = await firestore().collection('partners').where('playback_id', '==', thisPlaybackId).get();
    snapshot.forEach(doc => {
      docu = doc
    });

    switch(docu.data().liveStatus) {
      case 'video.live_stream.connected':
        navigation.navigate('Livestream', { gymId: gymId, classDoc: classDoc } )
        break;
      case 'video.live_stream.disconnected':
        setFillerText(`The livestream has been disconnected. Try refreshing the page. The influencer may have ended the video`)
        break;
      default: 
        break;
    }
  }


  // Refresh
  const onRefresh = React.useCallback(async() => {
    setRefreshing(true);

    getLiveStatus()

    wait(2000).then(() => setRefreshing(false));
  }, []);


   const getGymImage = async (data) => {
      let promises = []
      promises.push(publicStorage(data))
      const res = await Promise.all(promises)
      var profileImg = res[0] 
      setGymImage(profileImg)
  }

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  return (
    <>
    <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={{
        position: "absolute",
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        }} />

        {/* Go Home */}
        <View style={{
          position: "absolute",
          top: 50,
          left: 10,
            }}>
              
            <GoHomeButton />
          </View>

          <View style={{
            height: 100,
            width: 300,
            flex: 1,
            marginTop: hp('5%'),
            marginLeft: wp('2%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon
              containerStyle={{
                width: 100,
                height: 100,
                borderRadius: 50,
                overflow: 'hidden', 
              }}
              source={{ uri: gymImage}}
            />
            <Text style={{
              color: "#fff",
              marginTop: 20,
              ...FONTS.body,
              textAlign: "center"
            }}>
              {fillerText}
            </Text>
            <CustomButton
              style={{
                marginBottom: 0,
                marginTop: 20,
                paddingHorizontal: 50, 
                backgroundColor: colors.buttonAccent
              }}
              styleIsInverted={true}
              textStyle={colors.darkButtonText}
              title="Refresh"
              onPress={() => {
                onRefresh()
              }}
              />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "black"
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -100,
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
  },
})