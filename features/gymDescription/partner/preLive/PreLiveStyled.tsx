import React from 'react';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const PreLiveContainers = styled(SafeAreaView)`
  background-color: #242429;
  flex: 1;
`;
export const Content = styled.View`
  padding: 22px 26px;
  justify-content: center;
`;
export const RowView = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 10px;
`;
const DayNumber = styled.Text`
  color: #fff;
  font-weight: 500;
  font-size: 44px;
`;
const DayTitle = styled.Text`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
`;
const DateWrapper = styled.View`
  margin-left: 20px;
`;
const DateByMonth = styled.Text`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
`;
type DateViewTypeProp = {
  dayNumber: number | string;
  dayTitle: string | number;
  month: string | number;
}
export const DateOfClass: React.FC<DateViewTypeProp> = ({ dayNumber, dayTitle, month }) => (
  <RowView>
    <DayNumber>
      {dayNumber}
    </DayNumber>
    <DateWrapper>
      <DayTitle>
        {dayTitle}
      </DayTitle>
      <DateByMonth>
        {month}
      </DateByMonth>
    </DateWrapper>
  </RowView>
);
export const ClassTime = styled.Text`
  font-size: 30px;
  color: #BCC1CD;
  font-weight: 500;
  line-height: 45px;
  padding-top: 15px;
  margin-left: 10px;
`;
export const CheckBoxTitle = styled.Text`
font-style: normal;
font-weight: 500;
color: #FFF;
font-size: 16px;
padding-left: 10px;
`;
export const AttendanceTitle = styled.Text`
 font-weight: 500;
 font-size: 16px;
 line-height: 24px;
 color: #FFF;
 margin: 10px;
`;
const AttendanceWrapper = styled.View`
  height:100px;
`
const AttendanceImage = styled(FastImage)`
  width: 32px;
  height: 32px;
  border: 1px solid #FFFFFF;
  border-radius: 17px;
`

export const AttendanceImageView = () => (
  <AttendanceWrapper>
    <AttendanceImage source={require('../../../../assets/icons/avatars-material-man-2.png')} />
  </AttendanceWrapper>
);
