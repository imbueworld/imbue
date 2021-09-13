import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import { ViewProps, StyleProp } from 'react-native';
import { colors } from '../constants/Colors';

export const HorizontalView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

/**
 * @typedef {type} ButtonType
 */
export type ButtonType = Omit<TouchableOpacityProps, 'style'> & {
  loading?: boolean;
  backgroundColor?: string;
  width?: number;
  testID?: string;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: number;
  /**
   * Default '100%'
   */
  containerWidth?: number | string;
  alignStart?: boolean;
  spaceAround?: boolean;
  style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  active?: boolean;
};

export const ButtonWrapper = styled.TouchableOpacity<ButtonType>`
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  height: 40px;
  background-color: ${props =>
    props.active ? colors.white : props.backgroundColor || colors.white};
  justify-content: center;
  align-items: center;
  border-radius: ${props => (props.borderRadius ? props.borderRadius : 10)}px;
  align-self: center;
  text-align: center;

  /* flex-direction: row; */
  border: 1px solid ${props => (props.active ? colors.black : 'transparent')};
`;
/**
 * Button that can be used with subcomponents
 *
 * @example
     <ButtonsContainer>
      <Button onClicked={action('clicked-text')}>
        <ButtonText>{text('Button text', 'Hello Button')}</ButtonText>
      </Button>
    </ButtonsContainer>
 */

export const Button: React.FC<ButtonType> = props => (
  <ButtonWrapper activeOpacity={0.8} {...(props as any)}>
    {props.loading && <ActivityIndicator color={'white'} />}
    {!props.loading && props.children}
  </ButtonWrapper>
);
export const ButtonText = styled.Text<{ active?: boolean; color?: string }>`
  color: ${props => (props.color ? colors.black : colors.white)};
  font-size: 14px;
  text-align: center;
  font-family: 'LuloCleanW01-One';
`;
export const ButtonsContainer = styled.View<
  {
    spaceAround?: boolean;
    marginTop?: number;
    starting?: boolean;
    marginBottom?: number;
    containerWidth?: string | number;
    borderRadius?: number;
    titleColor?: string;
  } & ViewProps
  >`
  justify-content: ${props =>
    props.spaceAround ? 'space-around' : 'space-between'};
  margin-bottom: ${props => (props.marginTop ? props.marginTop : 10)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 10)}px;
  width: ${props => props.containerWidth || '100%'};
  margin-left: 10px;
  margin-right: 10px;
  align-items: ${props => (!props.starting ? 'center' : 'flex-start')};
  align-self: ${props => (!props.starting ? 'center' : 'flex-start')};
`;

/**
 * A button with text
 * marginTop={50} for testing
 * @param props @see {ButtonType}
 */
export const TextButton: React.FC<ButtonType & { title?: string, titleColor?: string }> = props => {
  return (
    <ButtonsContainer
      marginTop={props.marginTop || 10}
      containerWidth={props.containerWidth}
      starting={props.alignStart}
      borderRadius={props.borderRadius}
      spaceAround={props.spaceAround}
      marginBottom={props.marginBottom || 10}>
      <Button {...props}>
        <ButtonText   {...(props as any)}>{props.title}</ButtonText>
      </Button>
    </ButtonsContainer>
  );
};

/**
 * Button which takes text as `title` and icon as `children`.
 *
 * @param props `title` and icon as `children`
 * @returns
 */
export const IconButton: React.FC<ButtonType & { title?: string }> = props => {
  return (
    <ButtonsContainer
      marginTop={props.marginTop || 5}
      containerWidth={props.containerWidth}
      starting={props.alignStart}
      spaceAround={props.spaceAround}
      marginBottom={props.marginBottom || 5}>
      <Button {...props}>
        <HorizontalView>
          <IconViewRelative>{props.children}</IconViewRelative>
          <ButtonText numberOfLines={1} {...(props as any)}>
            {props.title}
          </ButtonText>
        </HorizontalView>
      </Button>
    </ButtonsContainer>
  );
};

const IconViewRelative = styled.View`
  margin-right: 10px;
`;
