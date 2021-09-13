import React from 'react';
import { Button, ButtonsContainer, ButtonText } from '../../../components/Button';
import { Header } from '../../scheduleClass/createClass/CreateClassStyled';
import { AttendanceImageView, AttendanceTitle, ClassTime, Content, DateOfClass, PreLiveContainers, RowView } from './preLive/PreLiveStyled';
export const ClassDescription = ({ route, navigation }: any) => {
  const { classId, timeId } = route.params;
  console.log({ classId, timeId }, "Test");
  return (
    <PreLiveContainers>
      <Header onPress={() => navigation.goBack()} headetTitle={'HEader'} />
      <Content>
        <DateOfClass dayNumber={'20'} dayTitle={'23'} month={'wed'} />
        <ClassTime>13:00-14:00</ClassTime>
        <AttendanceTitle>Attendance</AttendanceTitle>
        <AttendanceImageView />
        <RowView style={{ justifyContent: "space-between", alignItems: 'center' }}>
          <ButtonsContainer containerWidth={120}>
            <Button width={150} onPress={() => { }}>
              <ButtonText color="#242429"> go live</ButtonText>
            </Button>
          </ButtonsContainer>
          <ButtonsContainer containerWidth={120}>
            <Button width={150} onPress={() => { }}>
              <ButtonText color="#242429"> go live</ButtonText>
            </Button>
          </ButtonsContainer>
        </RowView>
        {/* Go Live Button */}
        <ButtonsContainer>
          <Button onPress={() => { }}>
            <ButtonText color="#242429"> go live</ButtonText>
          </Button>
        </ButtonsContainer>
        {/* Edit Button */}
        <ButtonsContainer>
          <Button backgroundColor={'#FF3535'} onPress={() => { }}>
            <ButtonText color="#242429"> Edit class</ButtonText>
          </Button>
          {/* Delete Button */}
        </ButtonsContainer>
        <ButtonsContainer>
          <Button backgroundColor={'#FF3535'} onPress={() => { }}>
            <ButtonText color="#242429">Delete class</ButtonText>
          </Button>
        </ButtonsContainer>
      </Content>
    </PreLiveContainers>

  )
}
