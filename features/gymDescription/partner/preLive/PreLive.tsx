import React, { useEffect, useState } from 'react';
import moment from 'moment';
import User from '../../../../backend/storage/User';
import { ButtonsContainer, ButtonText, Button } from '../../../../components/Button';
import { Header } from '../../../scheduleClass/createClass/CreateClassStyled';
import { PreLiveContainers, DateOfClass, Content, ClassTime, RowView, CheckBoxTitle, AttendanceTitle, AttendanceImageView } from './PreLiveStyled';
import CheckBox from '@react-native-community/checkbox';
import { FlatList } from 'react-native';
import { CheckBoxValues } from './CheckBoxValues';

export const PreLiveScreen = ({ navigation, route }: any) => {
  const routes = route.params
  const date = routes.date;
  const time = routes.time;
  const { classId, timeId } = routes.classId;
  const getMonth = moment(date).format('MMM YYYY');
  const getDay = moment(date).subtract(2, 'days').format('dddd');
  const getDayByNumber = moment(date).format('DD');
  const [onSelect, setOnSelect] = useState(false);
  const onSelectChange = () => {
    setOnSelect(!onSelect);
  }
  useEffect(() => {
    const init = async () => {
      const user = new User();
      await user.retrieveUser();
    };
    init();
  }, []);
  const onSubmit = () => {
    navigation.navigate('GoLive', { classId, timeId });
  }
  return (
    <PreLiveContainers>
      <Header onPress={() => navigation.goBack()} headetTitle={routes.className} />
      <Content>
        <DateOfClass dayNumber={getDayByNumber} dayTitle={getDay} month={getMonth} />
        <ClassTime>{time}</ClassTime>
        <AttendanceTitle>Attendance</AttendanceTitle>
        <AttendanceImageView />
        <FlatList data={CheckBoxValues} renderItem={({ item }) =>
          <RowView>
            <CheckBox
              onCheckColor="#242429"
              onFillColor="#f9f9f9"
              onTintColor="#f9f9f9"
              tintColor="#f9f9f9"
              value={item.value ? onSelect : true}
              onValueChange={onSelectChange}
            />
            <CheckBoxTitle>{item.title}</CheckBoxTitle>
          </RowView>
        } />
        <ButtonsContainer>
          <Button onPress={onSubmit}>
            <ButtonText color="#242429"> go live</ButtonText>
          </Button>
        </ButtonsContainer>
      </Content>
    </PreLiveContainers >
  );
}
