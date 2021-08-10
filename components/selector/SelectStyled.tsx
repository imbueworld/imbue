import React from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { colors as Colors } from '../../constants/Colors';

type Props = {
  fontSize?: number;
  selected?: boolean;
  red?: string;
};
export const Container = styled.View`
  width: 100%;
  padding: 35px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${Colors.white};
`;
export const Title = styled.Text`
  font-weight: bold;
  font-size: 32px;
  line-height: 37px;
  color: ${Colors.white};
  padding-bottom: 20px;
`;
const ItemText = styled.Text`
  font-size: 20px;
  color: ${Colors.black};
  padding-bottom: 20px;
  padding-top: 5px;
`;
export const Item = ({ onChange, children }: any) => (
  <TouchableOpacity onPress={onChange}>
    <ItemText>{children}</ItemText>
  </TouchableOpacity>
);
export const List = styled(FlatList)`
  width: 100%;
  max-height: 265px;
  flex: 1;
`;
export const SelectButtonText = styled.Text<Props>`
  font-size: ${props => (props.fontSize ? props.fontSize : 20)}px;
  font-weight: bold;
  height: 30px;
  color: ${props =>
    props.red ? Colors.error : props.selected ? Colors.black : Colors.white};
`;
export const SearchBox = styled.TextInput`
  padding-vertical: 0;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  height: 30px;
  color: ${Colors.black};
`;
const KeyboardPlatformView =
  Platform.OS === 'ios' ? KeyboardAvoidingView : View;
const KeyboardViewStyled = styled(KeyboardPlatformView)`
  margin: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  max-height: 400px;
`;
export const KeyboardView = (props: any) => (
  <KeyboardViewStyled behavior={'position'} enabled {...props} />
);
export const BlurBackgroundView = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;
export const RowTouchableOpacity = styled.TouchableOpacity`
  height: 40px;
  flex-direction: row;
  align-items: center;
`;
