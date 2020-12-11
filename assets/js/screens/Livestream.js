import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import LivestreamLayout from '../layouts/LivestreamLayout'
import firestore from '@react-native-firebase/firestore';
import { useDimensions } from '@react-native-community/hooks'
import { publicStorage } from '../backend/BackendFunctions'
import Video from 'react-native-video'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import config from '../../../App.config'
import { get } from 'react-hook-form';
import GoBackButton from '../components/buttons/GoBackButton'


function getPlaybackLink(playbackId) {
  return `https://stream.mux.com/${playbackId}.m3u8` 
}

// (m3u8, webm, mp4) are guarantted to work with <Video />
export default function Livestream(props) { 
  const { gymId } = props.route.params
  const { classDoc } = props.route.params

  const [user, setUser] = useState(null)
  const [playbackLink, setPlaybackLink] = useState(null)
  const [playbackId, setPlaybackId] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [gymName, setGymName] = useState(null)
  const [gymImage, setGymImage] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);
  const [classHasPassed, setClassHasPassed] = useState()

  const { width, height } = useDimensions().window
  const cardIconLength = width / 4

  const [pageWidth, setPageWidth] = useState(width)

  useEffect(() => {
    const init = async () => {
      setPageWidth(width)
      const user = new User()

      setUser(await user.retrieveUser())
      const gym = new Gym()
      
      const playback_id  =  firestore()
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


// Refresh
  const onRefresh = React.useCallback(async() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }


  useEffect(() => {
    const init = async () => {
      console.log("isLive (useEffect): ", isLive)
    }; init()
  }, [isLive])


   // getsGymImage
  const getGymImage = async (data) => {
     console.log("data: ", data)
      let promises = []
      promises.push(publicStorage(data))
      const res = await Promise.all(promises)
      var profileImg = res[0] 
     setGymImage(profileImg)
  }

  console.log("isLive: ", isLive)

  if (!user) return <View />

  return (
    <>
       {/* <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      > */}
        <LivestreamLayout 
          gymId={gymId} 
          user={user}
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
            // console.log("hiiiii onReadyForDisplay: ")
              setIsLive(true)
            }}
            onError={() => {
              console.log("hiiiii onError: ")
            }}
            paused={false}
            resizeMode={"cover"}
            repeat={true}
        />
       : null}  
        
       {/* </ScrollView> */}
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
    zIndex: -999,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
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