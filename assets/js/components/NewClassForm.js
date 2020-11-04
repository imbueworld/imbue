import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import CustomTextInput from './CustomTextInput'
import CustomButton from './CustomButton'
import CustomSelectButton from './CustomSelectButton'
import { snatchNewClassForm } from '../backend/TemporaryCacheFunctions'
import DropDownPicker from "react-native-dropdown-picker"
import { GENRES } from '../contexts/Constants'
import { simpleShadow, colors } from '../contexts/Colors'
import { zeroDecimalFromCurrency } from '../backend/HelperFunctions'
import User from '../backend/storage/User'
import Class from '../backend/storage/Class'



export default function NewClassForm(props) {
  const [initialized, setInitialized] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [redFields, setRedFields] = useState([])

  const [dropDownGyms, setDropDownGyms] = useState([])

  const [gym_id, setGymId] = useState(null)
  const [instructor, setInstructor] = useState(null)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [genres, setGenres] = useState(null)
  const [type, setType] = useState(null)
  const [price, setPrice] = useState("$0.00")

  useEffect(() => {
    const init = async () => {
      const newClassForm = snatchNewClassForm()

      setInstructor(newClassForm.instructor)
      setName(newClassForm.name)
      setDescription(newClassForm.description)
      setGenres(newClassForm.genres || [])
      setType(newClassForm.type || "studio")
      setGymId(newClassForm.gym_id || null)

      const user = new User()
      const gyms = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())

      let dropDownGyms = gyms.map(gym => ({ label: gym.description, value: gym.id }))
      setDropDownGyms(dropDownGyms)

      setInitialized(true)
    }
    init()
  }, [successMsg])

  // Updates, in the local session cache, the fields for the form,
  // in case of an accidental back button press or such.
  useEffect(() => {
    const form = snatchNewClassForm()
    form.instructor = instructor
    form.name = name
    form.description = description
  }, [instructor, name, description])
  useEffect(() => {
    const form = snatchNewClassForm()
    form.gym_id = gym_id
    form.genres = genres
    form.type = type
  }, [gym_id, genres, type])

  // if (!instructor || !name || !description || !gym_id ||
  //     !genres || !type) return <View />

  function validate() {
    let redFields = []
    if (!gym_id) redFields.push("gym_id")
    if (!instructor) redFields.push("instructor")
    if (!name) redFields.push("name")
    if (!description) redFields.push("description")
    if (!genres) redFields.push("genres")
    if (!type) redFields.push("type")
    if (!price) redFields.push("price")

    if (redFields.length) {
      setRedFields(redFields)
      throw new Error("Required fields must be filled.")
    }

    if (instructor.length < 3 || instructor.length > 50) {
      setRedFields(["instructor"])
      throw new Error("Instructor's name must be between 3 and 50 characters long.")
    }
    if (name.length < 3 || name.length > 120) {
      setRedFields(["name"])
      throw new Error("Class name must be between 3 and 120 characters long.")
    }
    if (description.length < 3 || description.length > 500) {
      setRedFields(["description"])
      throw new Error("Description of the class must be between 3 and 500 characters long.")
    }
    if (genres.length < 2 || genres.length > 5) {
      setRedFields(["genres"])
      throw new Error("Must have selected between 2 and 5 genres.")
    }

    let priceError = false
    let signs = price.match(/[$]/g)
    let commas = price.match(/[.]/g)
    let letters = price.match(/[A-Za-z]/g)
    if (signs && signs.length !== 1) priceError = true
    if (price[0] !== "$") priceError = true
    if (commas && commas.length > 1) priceError = true
    if (letters) priceError = true
    if (priceError) {
      setRedFields(["price"])
      throw new Error("Price must follow format: $xx.xx")
    }
  }

  function format(form) {
    let zeroDecimalPrice = zeroDecimalFromCurrency(price.slice(1))
    if (!zeroDecimalPrice) {
      setRedFields(["price"])
      throw new Error("Price must follow format: $xx.xx")
    }

    form.price = zeroDecimalPrice
    return form
  }



  if (!initialized) return <View />

  /* quick little logic for first <DropDownPicker defaultValue /> */
  let defaultGym = gym_id
  if (!gym_id) {
    if (dropDownGyms.length === 1) {
      defaultGym = dropDownGyms[0].value
      setGymId(defaultGym)
    }
  }


  return (
    <View style={styles.container}>

      {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}

      
      <DropDownPicker
        style={{
          ...styles.picker,
          borderColor: redFields.includes("gym_id") ? "red" : undefined,
        }}
        itemStyle={styles.pickerItem}
        labelStyle={styles.pickerLabel}
        dropDownStyle={styles.pickerDropDown}
        items={dropDownGyms}
        defaultValue={defaultGym}
        dropDownMaxHeight={285}
        placeholder="Select gym"
        onChangeItem={({ value }) => setGymId(value)}
      />

      <CustomTextInput
        containerStyle={{
          borderColor: redFields.includes("instructor") ? "red" : undefined,
        }}
        placeholder="Instructor's Name"
        value={instructor}
        onChangeText={setInstructor}
      />
      <CustomTextInput
        containerStyle={{
          borderColor: redFields.includes("name") ? "red" : undefined,
        }}
        placeholder="Class Name"
        value={name}
        onChangeText={setName}
      />
      <CustomTextInput
        containerStyle={{
          height: undefined,
          maxHeight: 400,
          borderColor: redFields.includes("description") ? "red" : undefined,
        }}
        style={{
          fontSize: 15,
          textAlign: "left",
          textAlignVertical: "top",
          paddingVertical: 8,
          paddingHorizontal: 10,
        }}
        multiline
        numberOfLines={5}
        placeholder="Description of the class..."
        value={description}
        onChangeText={setDescription}
      />

      <DropDownPicker
        style={[styles.picker, {
          borderColor: redFields.includes("genres") ? "red" : undefined,
        }]}
        itemStyle={styles.pickerItem}
        labelStyle={styles.pickerLabel}
        dropDownStyle={styles.pickerDropDown}
        items={GENRES}
        defaultValue={genres}
        max={5}
        multiple
        multipleText={"%d items have been selected."}
        dropDownMaxHeight={335}
        searchable
        placeholder={"Select at least 2 genres,\nup to 5 maximum"}
        onChangeItem={array => setGenres(array)}
        onOpen={() => setDropDown(true)}
        onClose={() => setDropDown(false)}
      />

      {/* in order to give some space for the drop down menu */}
      <View style={{
        height: dropDown ? 150 : 0,
      }} />

      <CustomSelectButton
        containerStyle={{
          // Should never happen, unless code bugged
          backgroundBorder: redFields.includes("type") ? "red" : undefined,
        }}
        options={{ studio: "In Studio", online: "Online" }}
        value={type}
        onChange={type => setType(type)}
      />

      <CustomTextInput
        containerStyle={{
          borderColor: redFields.includes("price") ? "red" : undefined,
        }}
        placeholder="Price"
        value={price}
        onChangeText={text => {
          let newText = text
          let signs = text.match(/[$]/g)
          let commas = text.match(/[.]/g)
          let letters = text.match(/[A-Za-z]/g)
          if (signs && signs.length !== 1) newText = price
          if (commas && commas.length > 1) newText = price
          if (letters) newText = price
          setPrice(newText)
        }}
      />

      <CustomButton
        title="Create Class"
        onPress={async () => {
          setRedFields([])
          setErrorMsg("")
          setSuccessMsg("")

          try {
            validate()

            let form = format({ instructor, name, description, genres, type, gym_id, price })

            const classObj = new Class()
            classObj.create(form)

            setSuccessMsg("Successfully created class.")
          } catch (err) {
            setErrorMsg(err.message)
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  optionText: {
    color: "#1b1b19", // edited
    textAlign: "center",
    fontSize: 20,
  },
  picker: {
    height: 72,
    marginVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    backgroundColor: "#ffffff00",
  },
  pickerDropDown: {
    ...simpleShadow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  pickerItem: {
    paddingHorizontal: 20,
  },
  pickerLabel: {
    textAlign: "center",
  },
})