import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import CustomSelectButton from './CustomSelectButton';
import {snatchNewClassForm} from '../backend/TemporaryCacheFunctions';
import DropDownPicker from 'react-native-dropdown-picker';
import {GENRES} from '../contexts/Constants';
import {simpleShadow, colors} from '../contexts/Colors';
import {zeroDecimalFromCurrency} from '../backend/HelperFunctions';
import User from '../backend/storage/User';
import Class from '../backend/storage/Class';
import GoBackButton from '../components/buttons/GoBackButton';
import {useNavigation} from '@react-navigation/native';

import ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import config from '../../../App.config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FONTS} from '../contexts/Styles';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function EditClassForm(props) {
  console.log('props: ', props.route.params.classDoc);
  const classParams = props.route.params.classDoc;

  const [initialized, setInitialized] = useState(false);
  // const [dropDown, setDropDown] = useState(false)
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redFields, setRedFields] = useState([]);

  const [dropDownGyms, setDropDownGyms] = useState([]);
  const [classDoc, setClassDoc] = useState([]);

  const [gym_id, setGymId] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [name, setName] = useState(null);
  const [classId, setClassId] = useState(null);

  const [img, setImg] = useState(null);
  const [description, setDescription] = useState(null);
  // const [genres, setGenres] = useState(null)
  const [type, setType] = useState('online');
  const [priceType, setPriceType] = useState('free');

  const [price, setPrice] = useState('$0.00');
  let navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      // const newClassForm = snatchNewClassForm()
      setClassDoc(classParams);

      setInstructor(classParams.name);
      setName(classParams.name);
      // setImg(newClassForm.img)
      setDescription(classParams.description);
      setPriceType(classParams.priceType);
      setClassId(classParams.id);
      console.log('setPriceType: ', classParams.priceType);

      // setGenres(newClassForm.genres || [])
      // setType(newClassForm.type || "studio")
      setGymId(classParams.gym_id || null);

      const user = new User();
      const gyms = (await user.retrievePartnerGyms()).map(it => it.getAll());

      // as of now each partner only has one associted gym. We automatically set this gymId
      setGymId(gyms[0].id);

      // let dropDownGyms = gyms.map(gym => ({ label: gym.description, value: gym.id }))
      // setDropDownGyms(dropDownGyms)

      setInitialized(true);
    };
    init();
  }, [successMsg]);

  // Updates, in the local session cache, the fields for the form,
  // in case of an accidental back button press or such.
  // useEffect(() => {
  //   const form = snatchNewClassForm()
  //   form.instructor = instructor
  //   form.name = name
  //   form.img = img
  //   form.description = description
  //   form.priceType = priceType
  // }, [instructor, name, description])
  // useEffect(() => {
  //   const form = snatchNewClassForm()
  //   form.gym_id = gym_id
  //   // form.genres = genres
  //   form.type = type
  // }, [gym_id, type])

  // if (!instructor || !name || !description || !gym_id ||
  //     !genres || !type) return <View />

  function validate() {
    let redFields = [];
    if (!gym_id) redFields.push('gym_id');
    // if (!instructor) redFields.push("instructor")
    if (!img) redFields.push('img');
    if (!name) redFields.push('name');
    if (!description) redFields.push('description');
    // if (!genres) redFields.push("genres")
    if (!type) redFields.push('type');
    if (!price) redFields.push('price');

    console.log('type: ', type);

    if (redFields.length) {
      setRedFields(redFields);
      throw new Error('Required fields must be filled.');
    }

    // if (instructor.length < 3 || instructor.length > 50) {
    //   setRedFields(["instructor"])
    //   throw new Error("Instructor's name must be between 3 and 50 characters long.")
    // }
    if (name.length < 3 || name.length > 120) {
      setRedFields(['name']);
      throw new Error('Class name must be between 3 and 120 characters long.');
    }
    if (description.length < 3 || description.length > 500) {
      setRedFields(['description']);
      throw new Error(
        'Description of the class must be between 3 and 500 characters long.',
      );
    }
    // if (genres.length < 2 || genres.length > 5) {
    //   setRedFields(["genres"])
    //   throw new Error("Must have selected between 2 and 5 genres.")
    // }

    let priceError = false;
    let signs = price.match(/[$]/g);
    let commas = price.match(/[.]/g);
    let letters = price.match(/[A-Za-z]/g);
    if (signs && signs.length !== 1) priceError = true;
    if (price[0] !== '$') priceError = true;
    if (commas && commas.length > 1) priceError = true;
    if (letters) priceError = true;
    if (priceError) {
      setRedFields(['price']);
      throw new Error('Price must follow format: $xx.xx');
    }
  }

  function format(form) {
    let zeroDecimalPrice = zeroDecimalFromCurrency(price.slice(1));
    console.log('zeroDecimalPrice: ', zeroDecimalPrice);

    // minimum price of $1.00
    if (zeroDecimalPrice < 100 && priceType !== 'free') {
      setRedFields(['price']);
      throw new Error('minimum class price is $1.00.');
    }

    form.price = zeroDecimalPrice;
    return form;
  }

  if (!initialized) return <View />;

  /* quick little logic for first <DropDownPicker defaultValue /> */
  let defaultGym = gym_id;
  if (!gym_id) {
    if (dropDownGyms.length === 1) {
      defaultGym = dropDownGyms[0].value;
      setGymId(defaultGym);
    }
  }

  function removeClass() {
    // remove from firebase
    firestore()
      .collection('classes')
      .doc(classId)
      .delete()
      .then(() => {
        console.log('class deleted!');
      });

    setSuccessMsg('Successfully removed class.');

    // go back
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }

  function changeClassPhoto(gym) {
    return new Promise(async (resolve, reject) => {
      // Ascertain that all permissions have been granted
      if (Platform == 'android') {
        const unfulfilledPerms = await requestPermissions([
          'CAMERA',
          'READ_EXTERNAL_STORAGE',
        ]);
        if (unfulfilledPerms)
          reject('Missing permissions: ' + unfulfilledPerms.join(', '));
      }

      // Do the image stuff
      ImagePicker.showImagePicker({}, async res => {
        if (res.didCancel) {
          // ...
          if (config.DEBUG)
            console.log('Photo selection canceled:', res.didCancel);
        }
        if (res.error) {
          if (config.DEBUG) console.error(res.error);
          reject('Something prevented the action.');
        }

        // Main portion
        // const {
        //   path: filePath,
        //   fileSize,
        // } = res

        const source = {uri: res.uri};
        const id = Math.random()
          .toString(36)
          .substring(7);
        // const img = source.uri

        // 8MB of file size limit
        // if (fileSize > 8 * 1024 * 1024) {
        //   reject('Image file size must not exceed 8MB.')
        // }

        try {
          const fileRef = storage().ref(id);
          // await fileRef.putFile(filePath)
          await fileRef.putFile(source.uri);

          const url = await (await storage()
            .ref(id)
            .getDownloadURL()).toString();

          console.log('imgUser: ' + url);

          setImg(url);

          console.log('img: ' + img);

          setSuccessMsg('Gym photo updated');

          // await this.push()
        } catch (err) {
          if (config.DEBUG) console.error(err);
          reject('Something prevented upload.');
          console.error(err);
        }
      });
    });
  }

  // Add Class photo
  // const editClassPhoto = async () => {
  //   setErrorMsg('')
  //   const user = new User()
  //   try {
  //     await changeClassPhoto()
  //     // refresh(r => r + 1)
  //   } catch (errorMsg) { setErrorMsg(errorMsg) }
  // }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <GoBackButton containerStyle={styles.GoBackButton} />
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: hp('5%'),
            ...FONTS.body,
            fontSize: 30,
          }}>
          Edit
        </Text>
      </View>

      {/* <DropDownPicker
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
      /> */}

      {/* <CustomTextInput
        containerStyle={{
          borderColor: redFields.includes("instructor") ? "red" : undefined,
        }}
        placeholder="Instructor's Name"
        value={instructor}
        onChangeText={setInstructor}
      /> */}

      {/* <CustomButton
        title="Add Photo"
        onPress={editClassPhoto} 
      />  */}
      <CustomTextInput
        containerStyle={{
          borderColor: redFields.includes('name') ? 'red' : undefined,
          marginTop: hp('10%'),
        }}
        placeholder="Class Name"
        value={name}
        onChangeText={setName}
      />
      <CustomTextInput
        containerStyle={{
          height: undefined,
          maxHeight: 400,
          borderColor: redFields.includes('description') ? 'red' : undefined,
        }}
        style={{
          fontSize: 15,
          textAlign: 'left',
          textAlignVertical: 'top',
          paddingVertical: 8,
          paddingHorizontal: 10,
        }}
        multiline
        numberOfLines={5}
        placeholder="Description of the class..."
        value={description}
        onChangeText={setDescription}
      />

      {/* <DropDownPicker
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
      /> */}

      {/* in order to give some space for the drop down menu */}
      <View
        style={
          {
            // height: dropDown ? 150 : 0,
          }
        }
      />

      {/* <CustomSelectButton
        containerStyle={{
          // Should never happen, unless code bugged
          backgroundBorder: redFields.includes("type") ? "red" : undefined,
        }}
        options={{ studio: "In Studio", online: "Online" }}
        value={type}
        onChange={type => setType(type)}
      /> */}

      {/* Paid or Free Class */}
      <CustomSelectButton
        containerStyle={{
          // Should never happen, unless code bugged
          backgroundBorder: redFields.includes('priceType') ? 'red' : undefined,
        }}
        options={{free: 'free', paid: 'paid'}}
        value={priceType}
        onChange={priceType => setPriceType(priceType)}
      />

      {priceType == 'paid' ? (
        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes('price') ? 'red' : undefined,
          }}
          placeholder="Price"
          value={price}
          onChangeText={text => {
            let newText = text;
            let signs = text.match(/[$]/g);
            let commas = text.match(/[.]/g);
            let letters = text.match(/[A-Za-z]/g);
            if (signs && signs.length !== 1) newText = price;
            if (commas && commas.length > 1) newText = price;
            if (letters) newText = price;
            setPrice(newText);
          }}
        />
      ) : null}

      <View>
        {errorMsg ? (
          <Text style={{color: 'red'}}>{errorMsg}</Text>
        ) : (
          <Text style={{color: 'green'}}>{successMsg}</Text>
        )}
      </View>

      <CustomButton
        title="Save"
        onPress={async () => {
          setRedFields([]);
          setErrorMsg('');
          setSuccessMsg('');

          try {
            // validate()

            await firestore()
              .collection('classes')
              .doc(classId)
              .update({
                name: name,
                description: description,
                price: price,
                priceType: priceType,
              })
              .then(() => {
                console.log('User updated!');
              });

            setTimeout(() => {
              navigation.goBack();
            }, 2000);

            setSuccessMsg('Successfully updated class.');
          } catch (err) {
            setErrorMsg(err.message);
          }
        }}
      />

      {/* Delete Class */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Are you sure you wish to delete this class',
            'All instances of this class will be removed from your schedule',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => removeClass()},
            ],
            {cancelable: false},
          )
        }>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: hp('1%'),
            color: colors.darkButtonText,
            ...FONTS.body,
            fontSize: 10,
          }}>
          Remove
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: hp('0%'),
  },
  optionText: {
    color: '#1b1b19', // edited
    textAlign: 'center',
    fontSize: 20,
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
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
    backgroundColor: '#ffffff00',
  },
  pickerDropDown: {
    // ...simpleShadow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  pickerItem: {
    paddingHorizontal: 20,
  },
  pickerLabel: {
    textAlign: 'center',
  },
});
