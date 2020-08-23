import React, { useEffect } from 'react'
import { StyleSheet, ScrollView, View, Image } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomCapsule from '../components/CustomCapsule'
import { publicStorage } from '../backend/HelperFunctions'
import GoToCalendarButton from '../components/buttons/GoToCalendarButton'
import AddToCalendarButton from '../components/buttons/AddToCalendarButton'
import CalendarSuccessButton from '../components/buttons/CalendarSuccessButton'
import GoBackButton from '../components/buttons/GoBackButton'
import ImageSlideshow from '../components/ImageSlideshow'



/**
 * props
 * .data -- gym data
 * .containerStyle
 * .innerContainerStyle
 * .children
 */
export default function GymLayout(props) {
  // let cache = props.cache
  let gym = props.data
  const buttonOptions = props.buttonOptions
    || {
      // not really in use = always show
      // backButton: {
      //   show: true,
      // },
      addToCalendar: {
        show: false,
        // state: ...
        // onPress: ...
      },
      goToCalendar: {
        show: false,
      },
    }

  
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

      <CustomCapsule
        containerStyle={[
          styles.container,
          props.containerStyle,
        ]}
        innerContainerStyle={[
          styles.innerContainer,
          props.innerContainerStyle,
        ]}
      >
        {/* <Image
          style={styles.image}
          source={{ uri: publicStorage(gym.image_uris[0]) }}
        /> */}
        <ImageSlideshow
          imageStyle={styles.image}
          data={gym.image_uris}
        />

        <View style={{
          position: "absolute",
          top: 7,
          left: 7,
        }}>
          <GoBackButton
            imageContainerStyle={{
              width: 42,
              height: 42,
            }}
          />
        </View>

        <View style={{
          position: "absolute",
          top: 7,
          right: 7,
          flexDirection: "row",
        }}>
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
          {buttonOptions.goToCalendar.show
          ? <GoToCalendarButton
              {...buttonProps}
            /> : null}
        </View>

        <View style={{
          paddingHorizontal: 10,
        }}>
          {props.children}
        </View>

      </CustomCapsule>
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
    height: 300,
    borderRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }
})