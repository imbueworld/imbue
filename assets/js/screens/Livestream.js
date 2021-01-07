import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import LivestreamLayout from '../layouts/LivestreamLayout'
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions'
import { useDimensions } from '@react-native-community/hooks'
import { publicStorage } from '../backend/BackendFunctions'
import Video from 'react-native-video'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import config from '../../../App.config'
import { get } from 'react-hook-form';
import GoBackButton from '../components/buttons/GoBackButton'
import { useNavigation } from '@react-navigation/native'


function getPlaybackLink(playbackId) {
  // return `rtmps://global-live.mux.com:443/app/88e75daa-9fd8-d94e-e161-cf2d304d10c7`
  // return `https://stream.mux.com/tS9QgfIFHCsCS689rWJC7UCXGMCVMsWpt1gblcJbc018.m3u8` 
  return `https://stream.mux.com/${playbackId}.m3u8` 
}

// (m3u8, webm, mp4) are guarantted to work with <Video />
export default function Livestream(props) { 
  const { gymId } = props.route.params
  const { classDoc } = props.route.params

  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [playbackLink, setPlaybackLink] = useState(null)
  const [playbackId, setPlaybackId] = useState(null)
  const [liveStatus, setLiveStatus] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [gymName, setGymName] = useState(null)
  const [gymImage, setGymImage] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);

  const { width, height } = useDimensions().window
  const cardIconLength = width / 4

  const [pageWidth, setPageWidth] = useState(width)
  let navigation = useNavigation()


  useEffect(() => {
    const init = async () => {
      setPageWidth(width)
      const user = new User()

      setUser(await user.retrieveUser())
      setUserId(user.uid)

      const gym = new Gym()
      
      firestore()
        .collection('gyms')
        .doc(gymId)
        .get()
        .then(documentSnapshot =>  {      
          setPlaybackLink(getPlaybackLink(documentSnapshot.data().playback_id))
          setGymName(documentSnapshot.data().name)
          getGymImage(documentSnapshot.data().image_uri)
          // setPlaybackId(documentSnapshot.data().playback_id)
        });

      
    }; init()
  }, [])


  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }


  useEffect(() => {
    const init = async () => {
    }; init()
  }, [isLive])


   // getsGymImage
  const getGymImage = async (data) => {
      let promises = []
      promises.push(publicStorage(data))
      const res = await Promise.all(promises)
      var profileImg = res[0] 
     setGymImage(profileImg)
  }

  if (!user) return <View />

  return (
    <>
        <LivestreamLayout 
          gymId={gymId} 
          user={user}
          liveStatus={liveStatus}
          isLive={isLive}
          gymImageUri={gymImage}
          gymName={gymName}
        />

      { playbackLink
          ?
          <Video   
            style={styles.video} 
            source={{ uri: playbackLink }} 
            refreshing={refreshing}
            onReadyForDisplay={() => {
              setIsLive(true)
            }}
            onError={() => {
              console.log("video resulted in an error: ")
            }}
            controls={false}
            paused={false}
            onEnd={()=> {
              navigation.navigate('SuccessScreen')
              // console.log('abc')
            }}
            resizeMode={"cover"}
        />
       : null}  
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
    // zIndex: -999,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
  },
})