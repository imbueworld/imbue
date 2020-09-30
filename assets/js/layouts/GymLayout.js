import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomCapsule from '../components/CustomCapsule'
import GoToCalendarButton from '../components/buttons/GoToCalendarButton'
import AddToCalendarButton from '../components/buttons/AddToCalendarButton'
import CalendarSuccessButton from '../components/buttons/CalendarSuccessButton'
import GoBackButton from '../components/buttons/GoBackButton'
import ImageSlideshow from '../components/ImageSlideshow'
import { StackActions, useNavigation } from '@react-navigation/native'
import GoToLivestreamButton from '../components/buttons/GoToLivestreamButton'
import AttendeesPopup from '../components/popups/AttendeesPopup'
import CustomButton from '../components/CustomButton'



/**
 * props
 * .data -- gym data
 * .containerStyle
 * .innerContainerStyle
 * .children
 */
export default function GymLayout(props) {
  let gym = props.data
  let navigation = useNavigation()

  // const [buttonOptions, setButtonOptions] = useState(null)
  const [customState, setCustomState] = useState({}) // Used only internally, during the lifetime of this component

  // useEffect(() => {
  const buttonOptions = {
    goBackButton: {
      show: true,
      onPress: undefined, // ==> defaults to navigation.goBack()
    },
    addToCalendar: {
      show: false,
      state: "opportunity" || "fulfilled",
      onPress: () => { },
    },
    goToCalendar: {
      show: false,
      onPress: undefined, // ==> defaults to pushing on a stack ScheduleViewer
    },
    goToLivestream: {
      show: false,
      state: "normal" || "inactive",
      onPress: () => {
        const pushAction = StackActions.push("Livestream", { gymId: gym.id })
        navigation.dispatch(pushAction)
      },
    },
    viewAttendees: {
      show: false,
      state: "closed" || "open",
      data: { classId: null, timeId: null },
      onPress: () => { },
    },
  }
  
  // Apply props.buttonOptions to buttonOptions
  if (props.buttonOptions) {
    Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
      Object.entries(instructions).forEach(([key, value]) => {
        buttonOptions[button][key] = value
      })
    })
  }

  // Apply customState to buttonOptions
  Object.entries(customState).forEach(([button, instructions]) => {
    Object.entries(instructions).forEach(([key, value]) => {
      buttonOptions[button][key] = value
    })
  })
  // setButtonOptions(defaultButtonOptions)
  // }, [])



  if (!buttonOptions) return <View />

  const buttonProps = {
    containerStyle: {
      marginLeft: 7,
    },
    imageContainerStyle: {
      width: 42,
      height: 42,
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <AppBackground />

      {buttonOptions.viewAttendees.state === 'open'
      ? <AttendeesPopup
          classId={buttonOptions.viewAttendees.data.classId}
          timeId={buttonOptions.viewAttendees.data.timeId}
          onX={() => setCustomState({
            ...customState,
            viewAttendees: {
              state: 'closed',
            }
          })}
        />
      : null}

      {/* <CustomCapsule
        containerStyle={[
          styles.container,
          props.containerStyle,
        ]}
        innerContainerStyle={[
          styles.innerContainer,
          props.innerContainerStyle,
        ]}
      > */}
        <ImageSlideshow
          containerStyle={{
            zIndex: -100,
          }}
          imageStyle={styles.image}
          imageInterval={5000}
          // data={"https://firebasestorage.googleapis.com/v0/b/spring-ranger-281214.appspot.com/o/imbue%202.jpg?alt=media&token=8c430e5f-05d3-43f5-9320-0ebe163c99bd"}
          data={gym.image_uris}
        />

        <View style={{
          position: "absolute",
          top: 50,
          left: 15,
        }}>
          {buttonOptions.goBackButton.show
          ? <GoBackButton
              imageContainerStyle={{
                width: 42,
                height: 42,
              }}
              onPress={buttonOptions.goBackButton.onPress}
            />
          : null}
        </View>

        <View style={{
          position: "absolute",
          top: 7,
          right: 7,
          flexDirection: "row",
        }}>
          {buttonOptions.goToLivestream.show
          ? buttonOptions.goToLivestream.state === "normal"
            ? <GoToLivestreamButton
                {...buttonProps}
                onPress={buttonOptions.goToLivestream.onPress}
              />
            : <GoToLivestreamButton
                {...buttonProps}
                inactive
              />
          : null}

          {buttonOptions.addToCalendar.show
          ? buttonOptions.addToCalendar.state === "opportunity"
            ? <AddToCalendarButton
                {...buttonProps}
                onPress={buttonOptions.addToCalendar.onPress}
              />
            : <CalendarSuccessButton
                {...buttonProps}
              />
          : null}
          
          {buttonOptions.viewAttendees.show
          ? <CustomButton
              style={{
                marginVertical: 0,
                paddingHorizontal: 10,
                height: 42,
              }}
              textStyle={{
                fontSize: 13,
              }}
              title="Attendees"
              onPress={() => {
                setCustomState({
                  ...customState,
                  viewAttendees: {
                    state: "open",
                  }
                })
              }}
            />
          : null}

          {buttonOptions.goToCalendar.show
          ? <GoToCalendarButton
              {...buttonProps}
              onPress={buttonOptions.goToCalendar.onPress}
            />
          : null}
        </View>

        <View style={{
          paddingHorizontal: 10,
        }}>
          {props.children}
        </View>

      {/* </CustomCapsule> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {
    width: "94%",
    marginVertical: 30,
    alignSelf: "center",
  },
  innerContainer: {
    paddingHorizontal: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    height: 450,
    // borderRadius: 30,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  }
})