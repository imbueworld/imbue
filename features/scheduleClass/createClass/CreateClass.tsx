import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Body } from '../../../components/Body';
import { Button, ButtonsContainer, ButtonText } from '../../../components/Button';
import FormTextField from '../../../components/formComponent/FormTextField';
import { AddedClassesArea, CreateClassContainer, Header, Title } from './CreateClassStyled';

interface IClassProp {
  name: string;
  description: string;
}
export const CreateClass: React.FC = ({ navigation }: any) => {
  const createClassMethod = useForm<IClassProp>({
    defaultValues: {
      name: '',
      description: ''
    },
  });


  function onSubmit(model: IClassProp) {
    console.warn('form submitted', model);
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
