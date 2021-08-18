import React from 'react';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { colors } from '../../../constants/Colors';

export const CreateClassContainer = styled(SafeAreaView)`
  flex: 1;
  background-color:#242429;
  padding: 22px;
`;
export const HeaderContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const BackIcon = styled(FastImage)`
  height: 50px;
  width: 50px;
`;
const HeaderTitle = styled.Text`
  color:${colors.white};
  font-family: 'LuloCleanW01-One';
  font-size: 20px;
`;
export type IHeaderTypeProp = {
  headetTitle?: string;
  onPress?: () => void;
}
export const Header: React.FC<IHeaderTypeProp> = ({ headetTitle, onPress }) => (
  <HeaderContainer onPress={onPress}>
    <BackIcon source={require('../../../assets/icons/back.png')} resizeMode={FastImage.resizeMode.center} />
    <HeaderTitle>{headetTitle}</HeaderTitle>
  </HeaderContainer>
);
export const Title = styled.Text`
  font-size: 14px;
  color:#BCC1CD;
  line-height: 21px;
  align-self: center;
  margin-top:30px;
  margin-bottom: 16px;
`;
const AreaPlaceholder = styled.View`
  background-color:${colors.white};
  border-radius: 16px;
  padding:20px;
  margin-bottom:10px;
`;
const ClassName = styled.Text`
  color:${colors.black};
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 5px;
`;
const ClassDescription = styled.Text`
  color:${colors.black}
`
export type ICreateClassTypeProp = {
  name: string,
  description: string,
}
export const AddedClassesArea: React.FC<ICreateClassTypeProp> = ({ name, description }) => (
  <AreaPlaceholder>
    <ClassName>{name}</ClassName>
    <ClassDescription>{description}</ClassDescription>
  </AreaPlaceholder>
);
export const ModalContentContainer = styled.View`
  width: 100%;
  padding: 20px;
  /* flex:1; */
  /* height: 400px; */
  border-radius: 20px;
  /* border-top-right-radius: 20px; */
  /* position: relative; */
  /* top:-100px; */
  /* z-index: 99999999; */
  /* bottom:300px; */
  background-color: #c2c2c2;
`;
