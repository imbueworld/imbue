import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { Button, ButtonsContainer, ButtonText } from '../../../components/Button';
import FormTextField from '../../../components/formComponent/FormTextField';
import { KeyboardView } from '../../../components/selector/SelectStyled';
import { ModalContentContainer, SelectDayBackground, Title } from './CreateClassStyled';

type ModalTypeProp = {
  onHide: () => void;
}
const selectedDays = [{ day: 'M', id: 1 }, { day: 'T', id: 2 }, { day: 'W', id: 3 }, { day: 'Th', id: 4 }, { day: 'F', id: 5 }, { day: 'Sa', id: 6 }, { day: 'Su', id: 7 }];
export const ModalForm: React.FC<ModalTypeProp> = ({ onHide }) => {
  const [recurring, setRecurring] = useState(false);
  const [oneTime, setOneTime] = useState(false);
  const [select, setSelect] = useState(null);


  const changeToRecurring = () => {
    setRecurring(!recurring);
  }
  const onTimeSelection = () => {
    setOneTime(!oneTime);
  }
  const onSelectMultiDay = (id: any) => {
    let selectMultidays = [...selectedDays]
    for (let data of selectMultidays) {
      if (data.id == id) {
        data.selected = (data.selected == null) ? true : !data.selected;
        break;
      }
    }
    setSelect(selectMultidays)
  }
  const onSelectDay = (id: any) => {
    setSelect(id)
  }


  return (
    <KeyboardView>
      <ModalContentContainer>
        <TouchableOpacity onPress={onHide} style={{ position: 'absolute', right: 10, top: 10, borderWidth: 2, height: 30, width: 30, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
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
          <TouchableOpacity onPress={changeToRecurring}>
            <Title style={{ color: 'black', fontSize: 17 }}>recurring</Title>
          </TouchableOpacity>
          <TouchableOpacity onPress={onTimeSelection}>
            <Title style={{ color: 'black', fontSize: 17 }}>one time</Title>
          </TouchableOpacity>
        </View>
        <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
        {!!recurring || !oneTime && <Title style={{ color: 'black', fontSize: 17 }}>days of the week</Title>}

        {recurring && <FlatList
          horizontal
          data={selectedDays.map(select => select)}
          keyExtractor={item => item.id.toString()}
          extraData={select}
          renderItem={({ item }) => <TouchableOpacity onPress={() => onSelectMultiDay(item.id)}>
            <SelectDayBackground selected={item.selected} days={item.day} />
          </TouchableOpacity>}
        />}
        {oneTime && <FlatList
          horizontal
          data={selectedDays.map(select => select)}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TouchableOpacity onPress={() => onSelectDay(item.id)}>
            <SelectDayBackground selected={select === item.id} days={item.day} />
          </TouchableOpacity>}
        />}
        <View style={{ height: 1, backgroundColor: '#24242980', width: '100%', marginBottom: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <FormTextField
            BottomColor={'#24242980'}
            name="number_of_class"
            label="# of Class"
            placeholderTextColor={'black'}
            fontColor={'#24242980'}
            color={'#24242980'}
            radius={10}
            style={{ width: '50%', marginBottom: 15 }}
            keyboardType="numeric"
            rules={{
              required: 'number of class is required.',
            }}
          />
          <Title style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>or</Title>
          <FormTextField
            BottomColor={'#24242980'}
            name="end_of_date"
            label="end of date"
            placeholderTextColor={'black'}
            fontColor={'#24242980'}
            color={'#24242980'}
            radius={10}
            style={{ width: '50%', marginBottom: 15 }}
            keyboardType="numeric"
            rules={{
              required: 'end date is required.',
            }}
          />
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
            onPress={onHide}>
            <ButtonText color={'#000'}>Schedule Class</ButtonText>
          </Button>
        </ButtonsContainer>
      </ModalContentContainer>
    </KeyboardView>
  )
}
