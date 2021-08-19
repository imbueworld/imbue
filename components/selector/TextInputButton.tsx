import React from 'react';
import { StyleProp, TextStyle, View, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../constants/Colors';

import { HorizontalView, InputLabel, LabelTextProps } from './Styled';
import Touchable from './Touchable';

/**
 * @typedef TextInputButtonProps
 */
export interface TextInputButtonProps {
  label?: string;
  placeholder?: string;
  onPress: () => void;
  viewProps?: ViewProps;
  accessibilityLabel?: string;
  testID?: string;
  textInputStyle?: StyleProp<TextStyle>;
  labelProps?: LabelTextProps;
  disabled?: boolean;
  color?: string;
  background?: string;
}

const TextPlaceholder = styled.Text<{ color?: string }>`
  font-size: 18px;
  text-align-vertical: center;
  text-align: left;
  color: ${props => (props.color ? colors.black : colors.white)};
`;

/**
 * View with border matching RN Paper TextInput in mode "outlined"
 * @see {@link InputLabel}
 * @typedef InputBorderView
 */
export const InputBorderView = styled.View<{ background?: string }>`
  border: 1px solid ${colors.white};
  border-radius: 50px;
  padding-horizontal: 12px;
  height: 50px;
  width: 85px;
  align-content: flex-start;
  justify-content: center;
  margin-vertical: 10px;
  background-color: ${props =>
    props.background ? colors.white : 'transparent'};
  /* border-width: 1px; */
`;

/**
 * A touchable view with border matching a RN Paper TextInput.
 *
 * Children are place horizontally so you can add an icon after the placeholder.
 *
 * @example <label>Clickable element that looks like a TextInput</label>
          <TextInputButton
              viewProps={{style: props.style}}
              onPress={() => setIsOpen(true)}
              label={'What´s it gonna be?'}
              placeholder='Adress'>
                <SvgPin />
          </TextInputButton>
 * @param {TextInputButtonProps} props `onPress`, `label`, `viewProps`, `placeholder`, `children`
 * @returns {Pressable}
 */
const TextInputButton: React.FC<TextInputButtonProps> = props => {
  return (
    <View>
      <Touchable
        onPress={props.onPress}
        testID={props.testID}
        disabled={props.disabled}
        accessibilityLabel={props.accessibilityLabel}>
        <InputBorderView
          background={props.background}
          {...(props.viewProps as any)}>
          <HorizontalView>
            <TextPlaceholder
              color={props.color}
              style={props.textInputStyle as any}>
              {props.placeholder}
            </TextPlaceholder>
            {props.children}
          </HorizontalView>
        </InputBorderView>
        {props.label && (
          <InputLabel labelTextProps={props.labelProps}>
            {props.label}
          </InputLabel>
        )}
      </Touchable>
    </View>
  );
};

export default TextInputButton;
