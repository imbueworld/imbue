import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView, RefreshControl} from 'react-native';
import LivestreamLayout from '../layouts/LivestreamLayout';
import firestore from '@react-native-firebase/firestore';
import {useDimensions} from '@react-native-community/hooks';
import {publicStorage} from '../backend/BackendFunctions';
import Video from 'react-native-video';
import User from '../backend/storage/User';
import Gym from '../backend/storage/Gym';
import config from '../../../App.config';
import {get} from 'react-hook-form';
import GoBackButton from '../components/buttons/GoBackButton';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {FONTS} from '../contexts/Styles';
import {colors} from '../contexts/Colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function getPlaybackLink(playbackId) {
  // return `rtmps://global-live.mux.com:443/app/88e75daa-9fd8-d94e-e161-cf2d304d10c7`
  // return `https://stream.mux.com/tS9QgfIFHCsCS689rWJC7UCXGMCVMsWpt1gblcJbc018.m3u8`
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

// (m3u8, webm, mp4) are guarantted to work with <Video />
export default function Livestream(props) {
  const {gymId} = props.route.params;
  const {classDoc} = props.route.params;
  const {isInternetReachable} = useNetInfo();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [playbackLink, setPlaybackLink] = useState(null);
  const [playbackId, setPlaybackId] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [didPressEnd, setDidPressEnd] = useState(false);
  const [gymName, setGymName] = useState(null);
  const [gymImage, setGymImage] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const {top} = useSafeAreaInsets();
  const {width, height} = useDimensions().window;

  const [pageWidth, setPageWidth] = useState(width);
  let navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      setPageWidth(width);
      const user = new User();

      setUser(await user.retrieveUser());

      const gym = new Gym();

      await firestore()
        .collection('gyms')
        .doc(gymId)
        .get()
        .then((documentSnapshot) => {
          setPlaybackLink(getPlaybackLink(documentSnapshot.data().playback_id));
          setGymName(documentSnapshot.data().name);

          setUserId(documentSnapshot.data().partner_id);
          // update didPressEnd
          firestore()
            .collection('partners')
            .doc(documentSnapshot.data().partner_id)
            .update({
              didPressEnd: false,
            });

          getGymImage(documentSnapshot.data().image_uri);
          // setPlaybackId(documentSnapshot.data().playback_id)
        });
    };
    init();
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  useEffect(() => {
    const init = async () => {};
    init();
  }, [isLive]);

  // getsGymImage
  const getGymImage = async (data) => {
    let promises = [];
    promises.push(publicStorage(data));
    const res = await Promise.all(promises);
    var profileImg = res[0];
    setGymImage(profileImg);
  };

  if (!user) return <View />;

  return (
    <>
      <LivestreamLayout
        gymId={gymId}
        user={user}
        liveStatus={liveStatus}
        isLive={isLive}
        gymImageUri={gymImage}
        gymName={gymName}
      />
      {/* Loader */}
      {isLive != true ? (
        <LottieView
          source={require('../components/img/animations/loading-dots.json')}
          style={{marginRight: 100, marginLeft: 50}}
          autoPlay
          loop
        />
      ) : null}

      {/* repetitive bc Lottie can't be wrapped in a View */}
      {isLive != true ? (
        <Text
          style={{
            color: colors.textInputPlaceholderDark,
            ...FONTS.body,
            textAlign: 'center',
            flex: 1,
          }}>
          just a sec
        </Text>
      ) : null}

      {playbackLink ? (
        <Video
          style={styles.video}
          source={{uri: playbackLink}}
          refreshing={refreshing}
          onReadyForDisplay={() => {
            setIsLive(true);
          }}
          onBuffer={async () => {
            // get livestream status
            firestore()
              .collection('partners')
              .doc(userId)
              .get()
              .then((documentSnapshot) => {
                {
                  documentSnapshot.data().liveStatus ==
                    'video.live_stream.disconnected' &&
                  documentSnapshot.data().didPressEnd == true
                    ? navigation.navigate('SuccessScreen', {
                        successMessageType: 'UserLiveStreamCompleted',
                      })
                    : null;
                }

                {
                  documentSnapshot.data().liveStatus ==
                    'video.live_stream.disconnected' &&
                  documentSnapshot.data().didPressEnd == false
                    ? navigation.navigate('LivestreamDisconnectedScreen', {
                        gymId: gymId,
                        classDoc: classDoc,
                      })
                    : null;
                }
              });
          }}
          onError={() => {
            console.log('video resulted in an error: ');
          }}
          controls={false}
          paused={false}
          onEnd={() => {
            navigation.navigate('SuccessScreen');
            setTimeout(() => {
              navigation.navigate('UserDashboard');
            }, 6000);
          }}
          resizeMode={'cover'}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
    // zIndex: -999,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
  },
});
