import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import ProfileLayout from '../layouts/ProfileLayout'
import NewClassForm from '../components/NewClassForm'
import CustomSmallButton from '../components/CustomSmallButton'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'
import User from '../backend/storage/User'



export default function PartnerUpdateClasses(props) {
  const [page, setPage] = useState("overview")
  const [user, setUser] = useState(null)
  const [classes, setClasses] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()

      const classes = (
        await user.retrieveClasses()
      ).map(it => it.getAll())

      setUser(userDoc)
      setClasses(classes)
    }; init()
  }, [])



  if (!user || !classes) return <View />

  const Classes = classes.map((classDoc, idx) =>
    <View key={idx} style={{
      height: 72,
      marginTop: idx !== 0 ? 10 : 0,
      backgroundColor: colors.buttonFill,
      borderRadius: 30,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Text style={{
        ...FONTS.body,
        color: colors.buttonAccent,
        fontSize: 20,
      }}>{classDoc.name}</Text>
    </View>
  )

  let PageContent
  switch (page) {
    case "overview":
      PageContent =
        <>
          <CustomSmallButton
            title="Create New Class"
            onPress={() => setPage("new_class")}
          />
          {/* <ClassList data={classes} /> */}
          <View>
            <Text style={{
              marginTop: 5,
              marginBottom: 20,
              alignSelf: "center",
              ...FONTS.subtitle,
              fontSize: 20,
            }}>List of Classes</Text>
            {Classes}
          </View>
        </>
      break
    case "new_class":
      PageContent =
        <>
          <CustomSmallButton
            title="See Class List"
            onPress={() => setPage("overview")}
          />
          <NewClassForm />
        </>
      break
  }

  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
    >
      { PageContent }
    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {},
})