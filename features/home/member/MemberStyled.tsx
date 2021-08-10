import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { colors } from '../../../constants/Colors';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.buttonFill};
  padding-top: ${Platform.OS === 'android' ? 25 : 0}px;
  justify-content: center;
  padding-left: 22px;
  padding-right: 22px;
`;
export const Title = styled.Text`
  color: #FFF;
  text-align: center;
  padding-horizontal: 10px;
  padding-top: 5px;
  font-family:'LuloCleanW01-One';
  font-size:17px;
  margin-top: 20px;
  line-height: 24px;
  margin-bottom: 20px;
`;
