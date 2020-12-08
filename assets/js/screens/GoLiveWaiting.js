import React, { useState, useEffect} from 'react'
import {Stylesheet, View} from 'react-native'
import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'

import User from '../backend/storage/User'



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
<Text
            style={styles.profileName}
            numberOfLines={2}
            >
            {user.name} + "'s class is starting soon"
          </Text>
