import React from 'react';
import { ScrollView } from 'react-native';

export const Body: React.FC = props => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    {...props}
    contentContainerStyle={{ paddingBottom: 100 }}
  />
);
