import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import LivestreamLayout from '../layouts/LivestreamLayout'
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import config from '../../../App.config'


function getPlaybackLink(playbackId) {
  return `https://stream.mux.com/${playbackId}.m3u8` 
}

// (m3u8, webm, mp4) are guarantted to work with <Video />
export default function Livestream(props) {
  const { gymId } = props.route.params

  const [user, setUser] = useState(null)
  const [playbackLink, setPlaybackLink] = useState(null)
  const [playbackId, setPlaybackId] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()

      setUser(await user.retrieveUser())
      const gym = new Gym()

      console.log("gymId: ", gymId)
      // const { playback_id } = await gym.retrieveGym(gymId) 

      const playback_id  =  firestore()
        .collection('gyms')
        .doc(gymId)
        .get()
        .then(documentSnapshot =>  {      
          setPlaybackLink(getPlaybackLink(documentSnapshot.data().playback_id))
          console.log('playbackLink: ', playbackLink)
          // setPlaybackId(documentSnapshot.data().playback_id)
        });
      
        // const partnersCollection = firestore()
        // .collection('partners')
        // .get()
        // .then(querySnapshot => {
        //   querySnapshot.forEach(documentSnapshot => {
        //     // converting icon_uris to download urls
        //     perfectFeaturedPartnersList(documentSnapshot.data())
        //   });
        // });
      
  // const { stripe_account_id: destination } = (
  //   await partners
  //     .doc(partnerId)
  //     .get()
  // )
  // .data()
      
      // console.log('playbackId: ', playbackId) // DEBUG

    }; init()
  }, [])



  if (!user) return <View />
 

  return (
    <>
    <LivestreamLayout
      gymId={gymId}
      user={user}
    />

    {   playbackLink
        ?
        <Video   
          style={styles.video} 
          source={{ uri: playbackLink }} 
          onBuffer={() => { console.log("Buffering video...") }}
          onError={() => { console.log("Error on video!") }}
          paused={false}
          resizeMode={"contain"}
          repeat={true}
      />
      : null}
    </>
  )
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -100,
  },
})