import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, ButtonsContainer, ButtonText } from '../../../components/Button';
import { Container, Title } from './MemberStyled';
// in this screen add the userDashboard.js
export const UserDashboard: React.FC = () => {

  return (
    <Container>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled">
        <Title>Your booked classes</Title>
        <ButtonsContainer>
          <Button onPress={() => { console.log('must navigate to the shcudlescreen') }}>
            <ButtonText color={'#000'}>find a class</ButtonText>
          </Button>
        </ButtonsContainer>
        <Title> classes today</Title>
      </KeyboardAwareScrollView>
    </Container>
  );
}
