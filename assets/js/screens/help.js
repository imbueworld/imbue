import React, { useEffect, useState } from 'react'
import { View, Text, Linking, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Communications from 'react-native-communications';

import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import GoBackButton from '../components/buttons/GoBackButton'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'


export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)


  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

    }; init()
  }, [])


  if (!user) return <View />

  return (
    <ProfileLayout
      innerContainerStyle={{
        padding: 10,
      }}
      hideBackButton={false}
      buttonOptions={{
        logOut: {
          show: false,
        },
      }}
    >

      <View>
        <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 50, marginBottom: 17 }}>
          We're here to help!
          </Text>
          <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 0, marginBottom: 17, fontSize: 8 }}>
          send us an email or shoot us a text with the links below. We will get back to you as soon as possible.
          </Text> 
      </View>

      <View>
        
          <CustomButton
            onPress={() => Communications.email(['influencer@imbuefitness.com'],null,null,'I Need Help','I have really been struggling with: (explain here)')}
            title="Email"
        />
         
        <View style={{flex: 1, flexDirection: 'row'}}>
          <CustomButton
            onPress={() => Communications.text('9522928738')}
          title="Text"
          style={{width: wp('40%'), marginRight: 5}}
        />
          <CustomButton
            onPress={() => Communications.phonecall('(952) 292 8738', true)}
            title="Call"
            style={{width: wp('40%'), marginLeft: 5}}
          />
        </View>
{/*         
        <TouchableOpacity onPress={() => Communications.phonecall('(952) 292 8738', true)}>
          <Text selectable style={{ ...FONTS.heading, textAlign: 'center', marginTop: 15, marginBottom: 17 }}>
            (952) 292 8738
          </Text>
        </TouchableOpacity> */}

      </View>


    </ProfileLayout>
  )

}