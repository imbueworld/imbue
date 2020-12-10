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
  const [isLive, setIsLive] = useState(true)
  const [gymName, setGymName] = useState(null)
  const [gymImage, setGymImage] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);

  const { width, height } = useDimensions().window
  const cardIconLength = width / 4

  const onRefresh = React.useCallback(() => {
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
      console.log("classDoc(useEffect): ", classDoc)

      const user = new User()

      setUser(await user.retrieveUser())
      const gym = new Gym()

      console.log("user: ", user)
      console.log("gym: ", gym)
      // const { playback_id } = await gym.retrieveGym(gymId) 

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
      
        console.log("gymImage: ", gymImage)
    }; init()
  }, [])


   // getsGymImage
  const getGymImage = async (data) => {
     console.log("data: ", data)
      let promises = []
      promises.push(publicStorage(data))
      const res = await Promise.all(promises)
     console.log("res: ", res)
      var profileImg = res[0] 
     setGymImage(profileImg)
     console.log("profileImg: " , profileImg)
  }


  if (!user) return <View />

  return (
    <>
       {/* <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      > */}
        <LivestreamLayout 
          gymId={gymId} 
          user={user}
          isLive={isLive}
          gymImageUri={gymImage}
          gymName={gymName}
        />
  
      {   playbackLink && isLive === true
          ?
          <Video   
            style={styles.video} 
            source={{ uri: playbackLink }} 
            onBuffer={() => { console.log("Buffering video...") }}
            // onError={() => {
            //   console.log("Error on video!")
            // }}
            onError={() => {
              setIsLive(false)
            }}
            paused={false}
            resizeMode={"contain"}
            repeat={true}
        />
          : null}
        
       {/* </ScrollView> */}
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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