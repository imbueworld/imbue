import { BlurView } from '@react-native-community/blur';
import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import { Container, Item, KeyboardView, List, Title } from './SelectStyled';

import { LabelTextProps } from './Styled';
import TextInputButton, { TextInputButtonProps } from './TextInputButton';

export type SelectItem = {
  id: string;
  name: string;
  date?: Date;
};

/**
 * @typedef SelectProps
 */
export type SelectProps = {
  /**
   * Label displayed above the clickable element
   */
  label?: string;
  /**
   * Placeholder displayed in the clickabel element when there's no value
   */
  placeholder?: string;
  /**
   * Title displayed in the popup sheet
   */
  title?: string;
  items: ReadonlyArray<string>;
  // items: ReadonlyArray<SelectItem>;
  onChange?: (item: SelectItem) => void;
  fontSize?: number;
  value?: SelectItem;
  style?: StyleProp<ViewStyle>;
  /**
   * Optional props for TextInputButton
   */
  textInputProps?: Partial<TextInputButtonProps>;
  icon?: React.ReactNode;
  labelProps?: LabelTextProps;
  color?: string;
  background?: string;
};

/**
 * Opens a bottom sheet with provided items so the user can select a value.
 *
 * @example
      <Select
        label={<InputLabel>What do you like?</InputLabel>}
        title={'Pick something'}
        onChange={(val) => onChange(val)}
        items={myArray.map((i) => ({
          id: i.key,
          name: i.name,
        }))}
        value={value !== undefined && {id: value, name: value}}
      />
 * @param {SelectProps} props `label`, `items`, `onChange` and `value` are required.
 * @returns
 */
export const Select: React.FC<SelectProps> = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectState, setSelectState] = useState<SelectItem | undefined>(
    props.value,
  );

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleChange = (item: SelectItem) => {
    Keyboard.dismiss();
    if (props.onChange) {
      props.onChange(item);
    }

    setSelectState(item);
    toggleModal();
  };

  // todo check effect of removing style={{ flex: 1 }} from container view
  return (
    <View style={props.style}>
      {props.children ? (
        props.children
      ) : (
        <TextInputButton
          onPress={() => toggleModal()}
          viewProps={{ style: props.style }}
          placeholder={selectState?.name || props.placeholder}
          background={props.background}
          color={props.color}
          label={props.label}
          labelProps={props.labelProps}
          {...props.textInputProps}>
          {props.icon}
        </TextInputButton>
      )}
      <Modal
        isVisible={modalVisible}
        hideModalContentWhileAnimating
        useNativeDriver
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{ margin: 0 }}
        customBackdrop={Platform.select({
          ios: (
            <BlurView
              style={{ flex: 1 }}
              blurType={'dark'}
              blurAmount={100}
              blurRadius={100}>
              <TouchableWithoutFeedback style={{ flex: 1 }} onPress={toggleModal}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
            </BlurView>
          ),
          android: null,
        })}>
        <KeyboardView>
          <Container>
            {props.title && <Title>{props.title}</Title>}
            <List
              contentContainerStyle={{ paddingBottom: 30 }}
              removeClippedSubviews
              maxToRenderPerBatch={10}
              data={props.items}
              // data={props.items.filter(item => item?.name) as SelectItem[]}
              renderItem={({ item }) => (
                <Item onChange={() => handleChange(item as SelectItem)}>
                  {(item as SelectItem)?.name}
                </Item>
              )}
              keyExtractor={item => (item as SelectItem).id.toString()}
              keyboardDismissMode={'on-drag'}
            />
          </Container>
        </KeyboardView>
      </Modal>
    </View>
  );
};

export default Select;
