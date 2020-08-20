import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { retrieveClassesByUser } from '../backend/CacheFunctions'
import DateSelector from './DateSelector'
import ClockInput from './ClockInput'
import ClockInputDismissOverlay from './ClockInputDismissOverlay'
import CustomButton from './CustomButton'
import { populateClass } from '../backend/BackendFunctions'
import CustomDropDownPicker from './CustomDropDownPicker'
import { colors } from '../contexts/Colors'



export default function CalendarPopulateForm(props) {
  let cache = props.cache

  const [initialized, setInitialized] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [redFields, setRedFields] = useState([])

  const [forceCloseClock, setForceCloseClock] = useState(false)
  const [dismissOverlay, setDismissOveraly] = useState(true)

  const [dropDownClasses, setDropDownClasses] = useState(null)

  const [beginClock, setBeginClock] = useState([0, 0])
  const [endClock, setEndClock] = useState([0, 0])
  const [dateStringList, setDateStringList] = useState([])

  const [class_id, setClassId] = useState(null)
  // const [active_times, setActiveTimes] = useState(null)

  useEffect(() => {
    const init = async () => {
      let classes = await retrieveClassesByUser(cache)
      let dropDownClasses = classes.map(entity => (
        { label: entity.name, value: entity.id }
      ))
      setDropDownClasses(dropDownClasses)

      setInitialized(true)
    }
    init()
  }, [])

  function validate() {
    if (!class_id) {
      setRedFields(["class"])
      throw new Error("A class must be selected.")
    }

    if (!dateStringList.length) {
      setRedFields(["calendar"])
      throw new Error("A date for the class must be selected")
    }

    if (dateStringList.length > 50) {
      setRedFields(["calendar"])
      throw new Error("Currently we allow adding only 50 classes at once.")
    }

    // Date must be in the future
    dateStringList.forEach(dateString => {
      let bH = beginClock[0] * 3600000 // hours ===> milliseconds
      let bM = beginClock[1] * 60000 // minutes ===> milliseconds

      const dateObj = new Date(dateString)
      const dateTsLocal = dateObj.getTime()
        + dateObj.getTimezoneOffset() * 60 * 1000 // minutes ===> milliseconds
        + bH + bM

      console.log("dateTsLocal", dateTsLocal)
      console.log("Date.now()", Date.now())

      if (dateTsLocal < Date.now()) {
        setRedFields(["calendar"])
        throw new Error("The class date and time must be in the future.")
      }
    })

    let bH = beginClock[0] * 60 // hours ===> minutes
    let bM = beginClock[1]
    let eH = endClock[0] * 60 // hours ===> minutes
    let eM = endClock[1]
    // beginning time of class must be before the end of class
    if (bH + bM > eH + eM) {
      setRedFields(["beginClock", "endClock"])
      throw new Error("Class starting time must be before its end time.")
    }
    // Classes must last at least 5 minutes
    if ((eH + eM) - (bH + bM) < 5) {
      setRedFields(["beginClock", "endClock"])
      throw new Error("A class must last at least 5 minutes.")
    }
  }
  
  function format() {
    let bH = beginClock[0] * 3600000 // hours ===> milliseconds
    let bM = beginClock[1] * 60000 // minutes ===> milliseconds
    let eH = endClock[0] * 3600000 // hours ===> milliseconds
    let eM = endClock[1] * 60000 // minutes ===> milliseconds

    let activeTimes = []
    dateStringList.forEach(dateString => {
      const dateObj = new Date(dateString)
      const dateTsLocal = dateObj.getTime()
        + dateObj.getTimezoneOffset() * 60 * 1000 // minutes ===> milliseconds
      console.log("getTimezoneOffset()", dateObj.getTimezoneOffset())
      activeTimes.push({
        begin_time: dateTsLocal + bH + bM,
        end_time: dateTsLocal + eH + eM
      })
    })
    // setActiveTimes(activeTimes)
    return activeTimes
  }



  if (!initialized) return <View />

  return (
    <>
    {/* This right down below is probably a bad idea; too irresponsive and in the way */}
    {/* {dismissOverlay ?
    <ClockInputDismissOverlay
      onPress={() => {
        setForceCloseClock(true)
        setForceCloseClock(false)
        setDismissOveraly(false)
      }}
    /> : null} */}

    <View style={{...props.containerStyle}}>

      <View style={styles.layoutMargin}>
        {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}
      </View>

      <CustomDropDownPicker
        containerStyle={{
          ...styles.dropDownPickerContainerStyle,
          ...styles.layoutMargin
        }}
        style={{
          ...styles.dropDownPicker,
          borderColor: redFields.includes("class") ? "red" : undefined,
        }}
        items={dropDownClasses}
        placeholder="Select your class"
        onChangeItem={item => setClassId(item.value)}
      />

      <DateSelector
        containerStyle={{
          ...styles.calendarContainerStyle,
          borderColor: redFields.includes("calendar") ? "red" : undefined,
        }}
        innerContainerStyle={styles.calendarInnerContainerStyle}
        onDayPress={dates => setDateStringList(dates)}
      />

      <View style={styles.layoutMargin}>
        <ClockInput
          cache={cache}
          containerStyle={{
            ...styles.clockInput,
            borderColor: redFields.includes("beginClock") ? "red" : undefined
          }}
          // forceClose={forceCloseClock}
          // onOpen={() => setDismissOveraly(true)}
          // onClose={() => setDismissOveraly(false)}
          onChange={(h, m) => {
            setBeginClock([h, m])
          }}
        />

        <ClockInput
          cache={cache}
          containerStyle={{
            ...styles.clockInput,
            borderColor: redFields.includes("endClock") ? "red" : undefined
          }}
          // forceClose={forceCloseClock}
          // onOpen={() => setDismissOveraly(true)}
          // onClose={() => setDismissOveraly(false)}
          onChange={(h, m) => {
            setEndClock([h, m])
          }}
        />

        <CustomButton
          style={{ marginTop: 20 }}
          title="Apply"
          onPress={async () => {
            setRedFields([])
            setErrorMsg("")
            setSuccessMsg("")
            
            try {
              validate()
              let active_times = format()
              await populateClass(cache,
                  { class_id, active_times })
              setSuccessMsg("Successfully added class dates to the gym's official calendar.")
            } catch(err) {
              setErrorMsg(err.message)
            }
          }}
        />
      </View>

    </View>
    </>
  )
}

const styles = StyleSheet.create({
  layoutMargin: {
    width: "88%",
    alignSelf: "center",
  },
  calendarContainerStyle: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "white",
  },
  calendarInnerContainerStyle: {},
  dropDownPickerContainerStyle: {
    marginTop: 20,
  },
  dropDownPicker: {
    marginTop: 0,
    marginBottom: 0,
  },
  clockInput: {
    marginTop: 20,
    backgroundColor: undefined,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
    overflow: "hidden",
  },
})