import React, { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { Button, ButtonsContainer, ButtonText } from '../../components/Button';
import Select from '../../components/selector/Select';
import { getDay, getMonth } from '../../utils/dates';
import { Calendar, ClassesButton, ClassTitle, DateList, MainBackground, ScheduleContainer, UserImage, UserName } from './ScheduleStyled';
import { View } from 'react-native';
import { Body } from '../../components/Body';

interface ISheduleProp {

  month: string;
}

export const ScheduleClass: React.FC<ISheduleProp> = () => {
  const navigation = useNavigation();
  const [dates1, setDates1] = useState([]);
  const bookingMethods = useForm<ISheduleProp>({
    defaultValues: {
      month: ''
    },
  })
  const monthValue = bookingMethods.watch().month
  const getDaysOfMonthAsList = (n: number, monthValue: any) => { console.log(n, "nnn"); return ([...Array(n)].map((_, i) => getDay(i, monthValue))) }
  const monthsWithYears = useMemo(
    () => [...Array(12)].map((_, i) => getMonth(i + 1)),
    [],
  );
  const currentMonth = moment().month();
  const formatedMonth = getMonth(currentMonth);
  const [selectedDate, setSelectedDate] = useState(formatedMonth);
  useEffect(() => {
    setDates1(getDaysOfMonthAsList(moment(monthValue.id).daysInMonth(), monthValue.id))
  }, [monthValue])

  const onSelectDate = (date: any) => {
    setSelectedDate(date);
  };
  function onSubmit(model: ISheduleProp) {
    console.warn('form submitted', model);
    navigation.navigate('createClass')
  }
  return (
    <ScheduleContainer>
      <UserImage />
      <MainBackground>
        <UserName numberOfLines={2}>Add New USER Name</UserName>
        <Controller
          render={({ onChange, value }) => (<>
            <Select
              style={{
                width: 309,
                borderColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              placeholder="Pick date"
              items={monthsWithYears}
              onChange={val => onChange(val)}
              value={
                value !== undefined
                  ? { id: value, name: value.toString() }
                  : undefined
              }
            />
          </>
          )}
          defaultValue={''}
          control={bookingMethods.control}
          name={'month'}
          rules={{ required: false }}
        />
        {/* <Body> */}
        <View style={{ height: 100 }}>
          <DateList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 120 }}>
            {dates1.map((date, index) => (
              date.day == undefined ? <></> : <>
                <Calendar
                  key={index}
                  Day={date.date}
                  numberOfDays={date.day}
                  onPress={() => onSelectDate(date)}
                  isSelected={selectedDate?.date === date?.date}
                />
              </>
            ))}
          </DateList>
        </View>
        <Body>
          <View style={{ height: 2, backgroundColor: 'white', width: '100%' }} />
          <ButtonsContainer style={{ paddingHorizontal: 20 }}>
            <Button
              width={300}
              borderRadius={10}
              onPress={bookingMethods.handleSubmit(onSubmit)}>
              <ButtonText color={'#000'}>schedule Class</ButtonText>
            </Button>
          </ButtonsContainer>
          <ClassTitle>Class</ClassTitle>
          {/* </Body> */}

          <ClassesButton />
          <ClassesButton />
        </Body>
      </MainBackground>
    </ScheduleContainer>
  );
}
