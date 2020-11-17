import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import LivestreamLayout from '../layouts/LivestreamLayout'
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

  if (config.DEBUG) console.log('playbackLink', playbackLink)

  useEffect(() => {
    const init = async () => {
      const user = new User()

      const gym = new Gym()

      const { playback_id } = await gym.retrieveGym(gymId)

      setUser(await user.retrieveUser())
      setPlaybackLink(getPlaybackLink(playback_id))
      console.log('playbackLink: ', playbackLink) // DEBUG


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
      ? <Video   
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