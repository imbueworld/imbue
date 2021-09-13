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
import { ModalForm } from './ModalForm';

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
          <ModalForm onHide={() => setModalVisible(false)} />
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
