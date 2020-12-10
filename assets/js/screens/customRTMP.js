import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'


import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import GoBackButton from '../components/buttons/GoBackButton'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import { get } from 'react-native/Libraries/Utilities/PixelRatio'
// import { Clipboard } from 'react-native-community/clipboard'

// await this._forcePull()
//         let { stream_key: streamKey } = this.getAll()

export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)
  const [streamKey, setStreamKey] = useState(null)


  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      setStreamKey(user.stream_key)

    }; init()
  }, [])


  if (!user) return <View />

  function UserGreeting(props) {
    return <h1>Welcome back!</h1>;
  }

  function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
  }


  if (user.stream_key) {
    return (
      <>
        <ProfileLayout
          innerContainerStyle={{
            padding: 10,
          }}
          hideBackButton={true}
          buttonOptions={{
            logOut: {
              show: true,
            },
          }}
        >
          <View>
            <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 3, marginBottom: 17 }}>
              Copy and Paste each of these into your prefered brodcasting software.
          </Text>
          </View>
          <View>
            <Text style={{ ...FONTS.heading, textAlign: 'center', marginTop: 3, marginBottom: 17 }}>
              RTMP Link:
        </Text>
          </View>
          <TouchableOpacity >
            <View>
              <Text selectable style={{ ...FONTS.body, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                rtmps://global-live.mux.com:443/app
         </Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={{ ...FONTS.heading, textAlign: 'center', marginTop: 3, marginBottom: 17 }}>
              Stream Key:
    </Text>
          </View>
          <TouchableOpacity>
            <View>
              <Text selectable style={{ ...FONTS.body, textAlign: 'center', marginTop: 3, marginBottom: 17 }}>
                {user.stream_key}
              </Text>
            </View>
          </TouchableOpacity>
        </ProfileLayout>
      </>
    )
  } else {
    <>
      <ProfileLayout
        innerContainerStyle={{
          padding: 10,
        }}
        hideBackButton={true}
        buttonOptions={{
          logOut: {
            show: true,
          },
        }}
      >
        <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 25 }}>
          You must create your first live stream (click go live and start the live stream, then end it after about 10 seconds)
    </Text>

        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/livestream.png")}
            />
          }
          title="Go Live"
          onPress={() => {
            toggleStream,
              props.navigation.navigate(
                "GoLive",
              )
          }}
        />
      </ProfileLayout>
    </>
  }
}


