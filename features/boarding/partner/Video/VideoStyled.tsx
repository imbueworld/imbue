
import React from 'react';
import styled from 'styled-components/native'
import { View, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { colors } from '../../../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export const VideoContainer = styled(SafeAreaView)`
  flex:1;
  background-color: ${colors.white};
  justify-content: center;
  padding-left: 22px;
  padding-right: 22px;
`;
export const VideoWelcomingText = styled.Text`
  color: ${colors.black};
  font-size: 20px;
  align-self: center;
  font-family: 'LuloCleanW01-One';
`;

const VideoPlaceholder = styled.View`
  height: 220px;
  margin-right: 20px;
  margin-left: 20px;
  justify-content: center;
  align-items: center;
`;
const VideoTileCover = styled(Image)`
  width: 300px;
  height: 160px;
  border-radius: 10px;
`;

const RowView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PlayImage = styled(Image)`
  width: 50px;
  height: 50px;
`;

const VideoLabel = styled.View`
  position: absolute;
  background-color: rgba(0,0,0,0.1);
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 160px;
  border-radius: 10px;
`;
const VideoPlyer = styled.View`
  color: ${colors.white};
  font-size: 16px;
`;
export type IVideoTypeProp = {
  VideoImage?: any;
  onPress?: () => void;
};
export const VideoTile: React.FC<IVideoTypeProp> = ({
  VideoImage,
  onPress,
}) => (
  <TouchableScale
    style={{ flex: 0.6 }}
    activeScale={0.9}
    tension={50}
    friction={7}
    useNativeDriver
    onPress={onPress}>
    <VideoPlaceholder>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <VideoTileCover source={VideoImage} />
        <VideoLabel>
          <VideoPlyer><PlayImage source={require('../../../../assets/icons/play.png')} resizeMode={'contain'} /></VideoPlyer>
        </VideoLabel>
      </View>
    </VideoPlaceholder>
  </TouchableScale>
);
export const VideoTitleWrapper = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
`;
export const VideoTitle = styled.Text`
  color: ${colors.white};
  font-size: 20px;
`;
