import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import ProfileLayout from '../layouts/ProfileLayout'
import CalendarPopulateForm from '../components/CalendarPopulateForm'
import User from '../backend/storage/User'



export default function SchedulePopulate(props) {
<<<<<<< HEAD
  const [user, setUser] = useState(null)git --version
=======
  const [user, setUser] = useState(null)
>>>>>>> removedFlipper

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
        paddingHorizontal: 0,
        paddingBottom: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <CalendarPopulateForm
        containerStyle={{
          // backgroundColor: "red",
        }}
      />
    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {},
})