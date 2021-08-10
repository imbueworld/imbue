
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import Select from '../selector/Select';

import TextValidator from './TextValidator';

type Props = React.ComponentProps<typeof TextValidator> & {
  name: string;
  rules: RegisterOptions;
  isSelectInput?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  background?: string;
  color?: string;
  fontColor?: string;
  radius?: number;
  items?: string[] | undefined;
};
const FormTextField: React.FC<Props> = props => {
  const {
    name,
    rules,
    placeholder,
    style,
    background,
    color,
    fontColor,
    radius,
    items,
    ...restOfProps
  } = props;
  const { control, errors } = useFormContext();
  return props.isSelectInput ? (
    <Controller
      control={control}
      render={({ onChange, value }) => (
        <Select
          background={background}
          color={color}
          style={style}
          placeholder={placeholder}
          items={items.map(i => ({
            id: i,
            name: i,
          }))}

          onChange={val => onChange(val.name)}
          value={
            value !== undefined
              ? { id: value, name: value.toString() }
              : undefined
          }
        />
      )}
      name={name}
      rules={rules}
    />
  ) : (
    <Controller
      control={control}
      render={({ onChange, onBlur, value }) => (
        <TextValidator
          background={background}
          color={color}
          fontColor={fontColor}
          style={style}
          radius={radius}
          // passing everything down to TextField
          // to be able to support all TextInput props
          {...restOfProps}
          errorText={errors[name]?.message}
          onBlur={onBlur}
          onChangeText={valueChange => onChange(valueChange)}
          value={value}
        />
      )}
      name={name}
      rules={rules}
    />
  );
};
export default FormTextField;
