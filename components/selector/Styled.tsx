import styled from 'styled-components/native';

import React from 'react';
import { Dimensions } from 'react-native';
import { colors } from '../../constants/Colors';
import FastImage from 'react-native-fast-image';

export const AbsoluteCenteredView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
  align-content: center;
  align-self: stretch;
  z-index: 100;
`;

export const ShadowView = styled.View`
  shadow-color: #000;
  shadow-offset: 0 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65;
  elevation: 8;
`;

const NoResultsView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NoResultsText = styled.Text`
  text-align: center;
  font-size: 18;
  align-self: center;
  justify-content: center;
  position: absolute;
  top: 10;
`;

export const NoResults: React.FC = ({ children }) => (
  <NoResultsView>
    <NoResultsText>{children}</NoResultsText>
  </NoResultsView>
);

export const HorizontalView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InputLabelView = styled.View`
  position: absolute;
  top: 4px;
  left: 10px;
  height: 20px;
  width: auto;
  font-size: 7;
`;

export type LabelTextProps = { backgroundColor?: string; color?: string };

const LabelText = styled.Text<LabelTextProps>`
  position: absolute;
  top: 0px;
  left: -2px;
  color: ${props => props.color || colors.white};
  background-color: ${props => props.backgroundColor || colors.white};
  padding-horizontal: 5px;
  font-size: 12;
`;

/**
 * An absolute positioned view that places a label over the {@link InputBorderView}
 * @see {@link TextInputButton}
 * @typedef InputLabel
 * @param param0 Text children
 * @returns {View}
 */
export const InputLabel: React.FC<{ labelTextProps?: LabelTextProps }> = ({
  children,
  labelTextProps,
}) => (
  <InputLabelView>
    <LabelText {...labelTextProps}>{children}</LabelText>
  </InputLabelView>
);

/**
 * Text used as save button in header
 */
export const SaveHeaderText = styled.Text`
  color: ${colors.gray};
  margin-right: 20;
  font-weight: bold;
  font-size: 17;
`;
const { height } = Dimensions.get('window');

export const RoomChatContainer = styled.View`
  margin-top: 50px;
  height: ${height * 0.8};
`;
