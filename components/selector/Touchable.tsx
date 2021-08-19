import React from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';

export type TouchableProps = PressableProps & {
  hasOpacityEffect?: boolean;
};

/**
 * Wraps `Pressable` with "touchable" styles
 *
 * @param props {@link PressableProps}
 */
export const Touchable: React.FunctionComponent<TouchableProps> = props => {
  return (
    <Pressable
      pressRetentionOffset={Platform.OS === 'android' ? 20 : 18}
      style={({ pressed }) => [
        {
          opacity: pressed && props.hasOpacityEffect !== false ? 0.5 : 1,
        },
      ]}
      {...props}>
      {props.children}
    </Pressable>
  );
};

export default Touchable;
