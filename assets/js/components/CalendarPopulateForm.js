import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { retrievePartnerClasses } from '../backend/CacheFunctions'
import DateSelector from './DateSelector'
import ClockInput from './ClockInput'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
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
  const [redFields, setRedFields] = useState(null)

  const [forceCloseClock, setForceCloseClock] = useState(false)
  const [dismissOverlay, setDismissOveraly] = useState(true)

  const [dropDownClasses, setDropDownClasses] = useState(null)

  const [beginClock, setBeginClock] = useState(null)
  const [endClock, setEndClock] = useState(null)
  console.log("beginClock", beginClock)
  console.log("endClock", endClock)
  const [dateStringList, setDateStringList] = useState(null)

  const [class_id, setClassId] = useState(null)
  const [active_dates, setActiveDates] = useState(null)

  useEffect(() => {
    const init = async () => {
      let classes = await retrievePartnerClasses(cache)
      console.log(444, classes)
      let dropDownClasses = classes.map(entity => (
        { label: entity.name, value: entity.id }
      ))
      setDropDownClasses(dropDownClasses)

      setInitialized(true)
    }
    init()
  }, [])

  function validate() {
    let redFields = []
    if (!class_id) redFields.push("class_id")
    if (!dateStringList.length) redFields.push("dateStringList")

    if (redFields.length) {
      setRedFields(redFields)
      throw new Error("Required fields need to be filled.")
    }

    if (dateStringList.length > 50) {
      setRedFields(["calendar"])
      throw new Error("Currently we allow adding only 50 classes at once.")
    }
  }

  function format() {
    let hB = beginClock[0] * 3600000 // hours ===> milliseconds
    let mB = beginClock[1] * 60000 // minutes ===> milliseconds
    let hE = endClock[0] * 3600000 // hours ===> milliseconds
    let mE = endClock[1] * 60000 // minutes ===> milliseconds

    let activeDates = []
    dateStringList.forEach(dateString => {
      activeDates.push({
        begin_time: ( new Date(dateString) ).getTime() + hB + mB,
        end_time: ( new Date(dateString) ).getTime() + hE + mE
      })
    })
    setActiveDates(activeDates)
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

      {errorMsg
      ?   <Text style={{ color: "red" }}>{errorMsg}</Text>
      :   <Text style={{ color: "green" }}>{successMsg}</Text>}

      <CustomDropDownPicker
        containerStyle={{...styles.dropDownPickerContainerStyle, ...styles.layoutMargin}}
        style={styles.dropDownPicker}
        items={dropDownClasses}
        placeholder="Select your class"
        onChangeItem={item => setClassId(item)}
      />

      <DateSelector
        containerStyle={styles.calendarContainerStyle}
        innerContainerStyle={styles.calendarInnerContainerStyle}
        onDayPress={dates => setDateStringList(dates)}
      />

      <View style={styles.layoutMargin}>
        <ClockInput
          containerStyle={styles.clockInput}
          // forceClose={forceCloseClock}
          // onOpen={() => setDismissOveraly(true)}
          // onClose={() => setDismissOveraly(false)}
          onChange={(h, m) => {
            setBeginClock([h, m])
          }}
        />

        <ClockInput
          containerStyle={styles.clockInput}
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
            setErrorMsg("")
            setSuccessMsg("")
            
            try {
              validate()
              format()
              await populateClass(cache,
                  { class_id, active_dates })
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
  dropDownPickerContainerStyle: {},
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