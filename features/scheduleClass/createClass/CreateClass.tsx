import { BlurView } from '@react-native-community/blur';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View, Text } from 'react-native';
import Modal from 'react-native-modal';

import { Body } from '../../../components/Body';
import { Button, ButtonsContainer, ButtonText } from '../../../components/Button';
import FormTextField from '../../../components/formComponent/FormTextField';
import { KeyboardView } from '../../../components/selector/SelectStyled';
import { AddedClassesArea, CreateClassContainer, Header, ModalContentContainer, Title } from './CreateClassStyled';

interface IClassProp {
  name: string;
  description: string;
  startTime: string,
  endTime: string,

}
export const CreateClass: React.FC = ({ navigation, value }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectState, setSelectState] = useState(
  //   value,
  // );
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const createClassMethod = useForm<IClassProp>({
    defaultValues: {
      name: '',
      description: '',
      startTime: '',
      endTime: '',
    },
  });


  function onSubmit(model: IClassProp) {
    console.warn('form submitted', model);
    setModalVisible(true)
  }
  return (
    <CreateClassContainer>
      <Header onPress={() => navigation.goBack()} headetTitle={'Classes'} />
      <FormProvider {...createClassMethod}>
        <FormTextField
          name="name"
          label="Class Name"
          placeholder="Class Name"
          placeholderTextColor={'white'}
          fontColor={'#FFF'}
          color={'#FFF'}
          radius={10}
          style={{ width: '100%', marginBottom: 15, marginTop: 30 }}
          keyboardType="default"
          rules={{
            required: 'Class name is required.',
          }}
        />
        <FormTextField
          name="description"
          label="Class Description"
          placeholder="Class Name"
          placeholderTextColor={'white'}
          fontColor={'#FFF'}
          color={'#FFF'}
          radius={10}
          style={{ width: '100%', marginBottom: 15 }}
          keyboardType="default"
          multiline={true}
          rules={{
            required: 'Class Description is required.',
          }}
        />
        {/* Move the Modal to a new file  */}
        {modalVisible && <Modal
          isVisible={modalVisible}
          hideModalContentWhileAnimating
          useNativeDriver
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          style={{ margin: 0 }}
          customBackdrop={Platform.select({
            ios: (
              <BlurView
                style={{ flex: 1, }}
                blurType={'dark'}
                blurAmount={100}
                blurRadius={100}>
                <TouchableWithoutFeedback style={{ flex: 1, }} onPress={toggleModal}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                </TouchableWithoutFeedback>
              </BlurView>
            ),
            android: null,
          })}>
          <KeyboardView>
            <ModalContentContainer>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', right: 10, top: 10, borderWidth: 2, height: 30, width: 30, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20 }}>X</Text>
              </TouchableOpacity>
              <Title style={{ color: 'black', fontSize: 17 }}>class date</Title>
              <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <FormTextField
                  name="startTime"
                  label="startTime"
                  BottomColor={'#24242980'}
                  placeholder="startTime"
                  placeholderTextColor={'black'}
                  fontColor={'#24242980'}
                  color={'#24242980'}
                  radius={10}
                  style={{ width: '50%', marginBottom: 15 }}
                  keyboardType="numeric"
                  rules={{
                    required: 'Start Time is required.',
                  }}
                />
                <FormTextField
                  BottomColor={'#24242980'}
                  name="endTime"
                  label="EndTime"
                  placeholder="EndTime"
                  placeholderTextColor={'black'}
                  fontColor={'#24242980'}
                  color={'#24242980'}
                  radius={10}
                  style={{ width: '50%', marginBottom: 15 }}
                  keyboardType="numeric"
                  rules={{
                    required: 'End Time is required.',
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}>recurring</Title>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}>one time</Title>
                </TouchableOpacity>
              </View>
              <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
              <Title style={{ color: 'black', fontSize: 17 }}>days of the week</Title>
              <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}># of classes</Title>
                  <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
                </TouchableOpacity>
                <Title style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>or</Title>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}>end date</Title>
                  <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}>free</Title>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('add some logic')}>
                  <Title style={{ color: 'black', fontSize: 17 }}>paid</Title>
                </TouchableOpacity>

              </View>
              <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
              <ButtonsContainer style={{ paddingHorizontal: 20 }}>
                <Button
                  width={300}
                  borderRadius={10}
                  onPress={() => setModalVisible(false)}>
                  <ButtonText color={'#000'}>Schedule Class</ButtonText>
                </Button>
              </ButtonsContainer>
            </ModalContentContainer>
          </KeyboardView>
        </Modal>}
      </FormProvider>
      <Body>
        <ButtonsContainer style={{ paddingHorizontal: 20 }}>
          <Button
            width={300}
            borderRadius={10}
            onPress={createClassMethod.handleSubmit(onSubmit)}>
            <ButtonText color={'#000'}>Create Class</ButtonText>
          </Button>
        </ButtonsContainer>
        <Title>Classes you’ve created, click to schedule </Title>
        <AddedClassesArea description={'Abs and Core'} name={'Abs and Core'} />
        <AddedClassesArea description={'Abs and Core'} name={'Abs and Core'} />
      </Body>
    </CreateClassContainer>
  )
};
