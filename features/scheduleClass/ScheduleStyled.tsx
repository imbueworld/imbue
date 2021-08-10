import React from 'react';
import styled from 'styled-components/native'
import { ScrollView } from 'react-native-gesture-handler';
import { width, height } from '../../constants/Layout';
import { colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Text } from 'react-native';
// Note: use the colors from the theme
export const ScheduleContainer = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px
`;
export const MainBackground = styled.View`
  width: ${width * 1.6}px;
  height: ${height - 180}px;
  border-top-left-radius: 300px;
  border-top-right-radius: 300px;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 40px;
  padding-top: 40px;
  background-color:#242429
`;
export const UserImage = styled.View`
  width: 180px;
  height: 180px;
  border-radius: 100px;
  background-color: #c2c2c2;
  z-index: 1;
  top:70px;
`;
export const UserName = styled.Text`
  font-size: 18px;
  line-height: 35px;
  font-family: LuloCleanW01-One;
  color: #fff;
  margin-top:70px;
`;
export const ClassTitle = styled.Text`
  font-size: 10px;
  font-family: LuloCleanW01-One;
  color: #fff;
  margin:20px;
`;
const CalendarContainer = styled.TouchableOpacity <{ isSelected?: boolean }>`
  flex-direction: column;
  border-color: ${colors.gray};
  background-color: ${props =>
    props.isSelected ? colors.white : 'transparent'};
  width:  40px;
  height: 70px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;
const DayTitle = styled.Text<{ isSelected?: boolean }>`
  font-size: 18px;
  color: ${props => (props.isSelected ? colors.black : colors.white)};
`;
const Title = styled.Text<{ isSelected?: boolean }>`
  font-size: 18px;
  color: ${colors.white};
`;
const DayNumber = styled.Text<{ isSelected?: boolean }>`
  font-size: 15px;
  color: ${props => (props.isSelected ? colors.black : colors.white)};
`;
type PickDateTypeProps = {
  Day: string;
  numberOfDays: number;
  onPress?: () => void;
  isSelected?: boolean;
};
export const Calendar: React.FC<PickDateTypeProps> = ({
  Day,
  numberOfDays,
  onPress,
  isSelected,
}) => (<>
  <CalendarContainer
    isSelected={isSelected}
    activeOpacity={0.8}
    onPress={onPress}>
    <DayTitle isSelected={isSelected}>{numberOfDays}</DayTitle>
    <DayNumber isSelected={isSelected}>
      {Day}
    </DayNumber>
  </CalendarContainer>
</>
);
export const DateList = styled(ScrollView)`

`;
export const ClassButtonContaianer = styled.TouchableOpacity`
  background-color:${colors.white};
  border-radius:14px;
  flex-direction:row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin: 8px;
  /* width: 400px; */
`;
export const ClassesButton = () => (
  <ClassButtonContaianer>
    <View>
      <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Abs and Core</Text>
      <Text style={{ color: 'black' }}>
        <Text>
          people 20
        </Text>
      </Text>
    </View>
    <View>
      <Text style={{ color: 'black' }}>13:00</Text>
      <Text style={{ color: 'black' }}>13:00</Text>
    </View>
  </ClassButtonContaianer>
)
