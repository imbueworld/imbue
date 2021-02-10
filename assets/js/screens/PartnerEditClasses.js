import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'

import ProfileLayout from '../layouts/ProfileLayout'
import NewClassForm from '../components/NewClassForm'
import CustomSmallButton from '../components/CustomSmallButton'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'
import User from '../backend/storage/User'



export default function PartnerEditClasses(props) {
  const [page, setPage] = useState("overview")
  const [user, setUser] = useState(null)
  const [classes, setClasses] = useState([])


  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        console.log("useFocusEffect called")
        const user = new User()
        const userDoc = await user.retrieveUser()
        setUser(userDoc)
        firestore()
          .collection('classes')
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
              if (documentSnapshot.data().partner_id == userDoc.id) {
                setClasses(prevArray => [...prevArray, documentSnapshot.data()])
              }
            });
          });
      }; init()
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );


  // useEffect(() => {
  //   const init = async () => { 
  //     const user = new User()
  //     const userDoc = await user.retrieveUser()

  //     const classes = (
  //       await user.retrieveClasses()
  //     ).map(it => it.getAll())

  //     setUser(userDoc)
  //     setClasses(classes)

  //   }; init()
  // }, [])

  if (!user || !classes) return <View />

  const Classes = classes.map((classDoc, idx) =>
    
    <TouchableOpacity style={{ borderRadius: 30,  }} onPress={() =>
      props.navigation.navigate(
        "EditClassForm",
        { classDoc: classDoc })}
    >
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
  </TouchableOpacity>

  ) 

  let PageContent
  PageContent = 
  <>

    {/* <ClassList data={classes} /> */}
    <View>
      <Text style={{
        marginTop: 20,
        marginBottom: 20,
        alignSelf: "center", 
        ...FONTS.subtitle,
        fontSize: 20,
      }}>My Classes</Text>
      {Classes}  
    </View>  
  </> 
 
 
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