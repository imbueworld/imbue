import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, ButtonsContainer, ButtonText } from '../../../../components/Button';
import { VideoContainer, VideoTile, VideoWelcomingText } from './VideoStyled';
// TODO: Add ALEX Video here
export const VideoScreen: React.FC = () => {
  const navigation = useNavigation();
  const videoURL = require('../../../../assets/AlVideo/amazingAl.mp4');
  return (
    <VideoContainer>
      <VideoWelcomingText>Imbue</VideoWelcomingText>
      <VideoWelcomingText>welcome video</VideoWelcomingText>
      <VideoTile VideoImage={require('../../../../assets/icons/1024.png')}
        onPress={() => navigation.navigate('videoPlay', { videoURL })}
      />
      <ButtonsContainer >
        <Button
          borderRadius={20}
          backgroundColor={'#242429'}
          onPress={() => {
            console.log('must navigate to the shcudlescreen');
          }}>
          <ButtonText style={{ fontSize: 17 }}>lets get started</ButtonText>
        </Button>
      </ButtonsContainer>
    </VideoContainer>
  )
}
