import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  BackHandler,
  PanResponder,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import database from '@react-native-firebase/database';
import branch from 'react-native-branch';
import ChatButton from '../components/ChatButton';
import CancelButton from '../components/CancelButton';
import ListButton from '../components/ListButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDimensions } from '@react-native-community/hooks';

import { useNavigation } from '@react-navigation/native';
import {
  registerParticipant,
  sendMessage,
} from '../backend/LivestreamFunctions';
import ParticipantList from '../components/ParticipantList';
import Chat from '../components/Chat';
import LiveViewerCountBadge from '../components/badges/LiveViewerCountBadge';
import cache from '../backend/storage/cache';
import GoLiveButton from '../components/buttons/GoLiveButton';
import GoBackButton from '../components/buttons/GoBackButton';
import config from '../../../App.config';
import User from '../backend/storage/User';
import { simpleShadow } from '../contexts/Colors';
import Icon from '../components/Icon';
import { FONTS } from '../contexts/Styles';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../components/CustomButton';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Play from '../components/img/svg/play.svg';
import ShareIcon from '../components/img/svg/share.svg';
import ChatIcon from '../components/img/svg/chat.svg';
import HomeIcon from '../components/img/svg/home_outline.svg';
import LiveStream from '../components/img/svg/live_stream.svg';
import SwitchCamera from '../components/img/svg/switch_camera.svg';
import { LivestreamModal } from '../components/LivestreamModal';
import Share from 'react-native-share';
import AirPlayButton from 'react-native-airplay-button';

const layoutOptions = {
  viewerCount: {
    show: true,
  },
};

const buttonOptions = {
  goBack: {
    show: false,
  },
  goLive: {
    show: false,
    state: 'idle' || 'streaming',
    navigate: 'SuccessScreen',
    onPress: () => {},
  },
  leaveLivestream: {
    show: true,
  },
  viewParticipants: {
    show: true,
    state: 'closed' || 'open',
  },
  viewChat: {
    show: true,
    state: 'closed' || 'open',
  },
  viewButtonPanel: {
    show: true,
    state: 'open' || 'closed',
    data: null, // stores the timeout_id that is created upon show
  },
};

export default function LivestreamLayout(props) {
  // const [gymId, setGymId] = useState(null)
  // const [user, setUser] = useState(null)
  // const cameraRef = props.cameraRef;
  const gymId = props.gymId;
  const classId = props.classId;
  const timeId = props.timeId;
  const user = props.user;
  const isLive = props.isLive;
  const gymImage = props.gymImageUri;
  const gymName = props.gymName;
  const liveStatus = props.liveStatus;
  const switchCamera = props.switchCamera;
  const { width, height } = useDimensions().window;
  const cardIconLength = width / 4;
  const { isInternetReachable } = useNetInfo();
  const { top, bottom } = useSafeAreaInsets();
  const [streamModal, setStreamModal] = useState(false);
  if (!gymId) throw new Error('prop gymId must be provided');
  if (!user) throw new Error('prop user must be provided');
  let navigation = useNavigation();

  const [r, refresh] = useState(0);

  const {
    containerStyle = {},
    imageContainerStyle = {},
    imageStyle = {},
    //
    onPress = () => navigation.navigate('PartnerDashboard'),
  } = props;

  // Apply props.buttonOptions to buttonOptions
  useEffect(() => {
    if (props.buttonOptions) {
      Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
        Object.entries(instructions).forEach(([key, value]) => {
          buttonOptions[button][key] = value;
        });
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await registerParticipant({
        gymId,
        name: user.name,
        uid: user.id,
        icon_uri: user.icon_uri,
      });

      const chatNodeRef = database().ref(`livestreams/messages/${gymId}`);
      // [COMMENTED OUT IN ORDER TO NOT SHOW PAST MESSAGES,
      // POSSIBLY FROM LAST LIVESTREAM]
      // await chatNodeRef.once('value', snap => {
      //   let data = snap.val()
      //   if (data) {
      //     const messages = Object.values(data)
      //     // Assumes existing data that may be in cache upon the very first
      //     // render of this component is irrelevant and to be overwritten
      //     cache("livestream/chat").set(messages)
      //   }
      // })

      chatNodeRef.limitToLast(1).on('child_added', (snap) => {
        const message = snap.val();

        // Don't show very first message, because it is most likely not a live message
        let canShowMessageNow = cache('livestream/canShowMessageNow');
        if (!canShowMessageNow.get()) {
          canShowMessageNow.set(true);
          return;
        }

        let existingMessages = cache('livestream/chat').get() || [];

        // Do not add, if an exact same message is already in chat
        let x = existingMessages.map((msg) => `${msg.timestamp}${msg.message}`);
        let y = `${message.timestamp}${message.message}`;
        if (x.includes(y)) return;

        const newSetOfMessages = [...existingMessages, message];

        // Update cache
        cache('livestream/chat').set(newSetOfMessages);

        // Update <LivestreamMessages />
        const setChat = cache('livestream/functions/setChat').get();
        if (typeof setChat === 'function') setChat(newSetOfMessages);
      });
    };
    init();
    // if (chatNodeRef) {
    //   return () => chatNodeRef.off()
    // }
  }, []);

  const liveStreamPress = () => {
    switch (buttonOptions.goLive.state) {
      case 'streaming':
        navigation.navigate('SuccessScreen', {
          successMessageType: 'PartnerLiveStreamCompleted',
        });
        // register didPressEnd
        firestore().collection('partners').doc(user.id).update({
          didPressEnd: true,
        });
        firestore();

        buttonOptions.goLive.state = 'idle';
        buttonOptions.goBack.show = true;
        setTimeout(() => {
          navigation.navigate('PartnerDashboard');
        }, 6000);

        console.log('streaming');
        break;
      case 'idle':
        buttonOptions.goLive.state = 'streaming';
        buttonOptions.goBack.show = false;
        console.log('idle');
        break;
    }
    refresh((r) => r + 1);
    buttonOptions.goLive.onPress();
  };

  useEffect(() => {
    const ptcsNodeRef = database().ref(`livestreams/participants/${gymId}`);

    const init = async () => {
      await ptcsNodeRef.once('value', async (snap) => {
        const users = snap.val();
        if (users) {
          let ptcs = Object.entries(users).map(([uid, userData]) => {
            userData.uid = uid;
            return userData;
          });
          // Assumes existing data that may be in cache upon the very first
          // render of this component is irrelevant and to be overwritten
          cache('livestream/participants').set(ptcs);

          let liveCount = ptcs.filter((ptc) => ptc.here).length;
          cache('livestream/viewerCount').set(liveCount);
          refresh((r) => r + 1);
        }
      });

      /**
       * Update or append new users that come into the livestream,
       * update their 'here' status,
       * update cache and certain Child Components.
       */
      ptcsNodeRef.on('child_changed', (snap) => {
        const user = { ...snap.val(), uid: snap.key };
        let existingPtcs = cache('livestream/participants').get() || [];
        const newSetOfPtcs = [user, ...existingPtcs];

        // child_changed can provide an entirely new user, or an update to an existing one
        // let's distinguish..
        let existingUids = existingPtcs.map((ptc) => ptc.uid);
        const action = existingUids.includes(user.uid) ? 'update' : 'creation';

        // Update existingPtcs to meet current state
        if (action === 'update') {
          existingPtcs.forEach((ptc) => {
            if (ptc.uid === user.uid) {
              for (let key in user) {
                ptc[key] = user[key];
              }
            }
          });
        }

        //
        // [UPDATING OF WHETHER USER PRESENT OR NOT]

        // Update <LiveViewerCountBadge />
        let liveCount;
        if (action === 'update') {
          liveCount = existingPtcs.filter((user) => user.here).length;
          // Update cache
          cache('livestream/participants').set(existingPtcs);
        } else if (action === 'creation') {
          liveCount = newSetOfPtcs.filter((user) => user.here).length;
          // Update cache
          cache('livestream/participants').set(newSetOfPtcs);
        }
        cache('livestream/viewerCount').set(liveCount);
        const setViewerCount = cache(
          'livestream/functions/setViewerCount',
        ).get();
        if (typeof setViewerCount === 'function') setViewerCount(liveCount);

        //
        // [APPENDING OF NEW USERS]

        // Do not proceed further, if this is not a new user
        if (action !== 'creation') return;

        // Update cache
        cache('livestream/participants').set(newSetOfPtcs);

        // Update <LivestreamMessages />
        const setPtcs = cache('livestream/functions/setParticipants').get();
        if (typeof setPtcs === 'function') setPtcs(newSetOfPtcs);
        // Update <ParticipantList />
        const setPtcsList = cache(
          'livestream/functions/setParticipantsList',
        ).get();
        if (typeof setPtcsList === 'function') setPtcsList(newSetOfPtcs);
      });

      ptcsNodeRef.child(user.id).onDisconnect().update({
        here: false,
      });
    };
    init();

    return () => {
      ptcsNodeRef.child(user.id).update({
        here: false,
      });
      ptcsNodeRef.off();
    };
  }, []);

  function setDeck(state) {
    // [v DEBUG ONLY v]
    if (config.DEBUG) {
      buttonOptions.viewButtonPanel.state = 'open';
      refresh((r) => r + 1);
    }
    // [^ DEBUG ONLY ^]

    // [v DISABLED DURING DEBUG v]
    if (!config.DEBUG) {
      clearTimeout(buttonOptions.viewButtonPanel.data);
      buttonOptions.viewButtonPanel.state = state;

      if (state === 'open') {
        let timeout = setTimeout(() => {
          if (
            buttonOptions.viewChat.state === 'open' ||
            buttonOptions.viewParticipants.state === 'open'
          ) {
            return;
          }

          buttonOptions.viewButtonPanel.state = 'closed';
          refresh((r) => r + 1);
        }, 4500);
        buttonOptions.viewButtonPanel.data = timeout;
      }

      refresh((r) => r + 1);
    }
    // [^ DISABLED DURING DEBUG ^]
  }

  useEffect(() => {
    setDeck('open');
  }, []);
  console.log(gymName);
  // Disable native device return button, to prevent accidental touch
  useEffect(() => {
    const goBack = () => true;
    BackHandler.addEventListener('hardwareBackPress', goBack);

    return () => BackHandler.removeEventListener('hardwareBackPress', goBack);
  }, []);

  return (
    <>
      <LivestreamModal
        user={user}
        gymId={gymId}
        visible={streamModal}
        close={() => setStreamModal(false)}
      />
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: '100%',
          height: '100%',
        }}
      />

      {buttonOptions.goLive.state === 'streaming' ? (
        !isInternetReachable ? null : (
          <View style={[styles.liveStreamStatus, { top: top + 10 }]}>
            <LiveStream width={12} height={12} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        )
      ) : null}
      {/* : null} */}

      {/* {buttonOptions.viewButtonPanel.state === "open" 
    ?  */}
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 105,
        }}>
        {!isInternetReachable && (
          <View
            style={{
              position: 'absolute',
              top: top,
              right: 20,
              backgroundColor: 'white',
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 99,
            }}>
            <Text style={{ ...FONTS.textInput, fontSize: 15, color: 'red' }}>
              Reconnecting...
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.homeButton, { top: top + 10 }]}
          onPress={() => {
            if (buttonOptions.goLive.state === 'streaming') liveStreamPress();
            if (user.account_type === 'partner')
              navigation.navigate('PartnerDashboard');
            else navigation.navigate('UserDashboard');
          }}>
          <HomeIcon width={35} height={35} />
        </TouchableOpacity>

        {switchCamera && (
          <TouchableOpacity
            style={[styles.switchButton, { top: top + 10 }]}
            onPress={() => switchCamera()}>
            <SwitchCamera width={30} height={30} />
          </TouchableOpacity>
        )}

        <View style={styles.background}>
          <View style={styles.info}>
            <Text style={styles.className}>{gymName}</Text>
          </View>
          <View style={styles.info}>
            <Image
              style={styles.userPhoto}
              source={{ uri: user.icon_uri_full }}
            />
            <Text style={styles.userName}>{`${user.first} ${user.last}`}</Text>
          </View>
          <ImageBackground
            imageStyle={{
              resizeMode: 'stretch',
            }}
            source={require('../components/img/stream_background.png')}
            style={[styles.backgroundMenu]}>
            <TouchableOpacity
              onPress={() => setStreamModal(true)}
              style={[styles.menuButton, { backgroundColor: '#929294' }]}>
              <ChatIcon width={30} height={30} />
            </TouchableOpacity>
            {user.account_type !== 'partner' && (
              <TouchableOpacity
                onPress={() => console.log(true)}
                style={[styles.menuButton, { backgroundColor: '#929294' }]}>
                <AirPlayButton
                  activeTintColor="red"
                  tintColor="white"
                  style={{ width: 36, height: 36 }}
                />
              </TouchableOpacity>
            )}
            {user.account_type === 'partner' && (
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: '#000' }]}
                onPress={() => liveStreamPress()}>
                {buttonOptions.goLive.state === 'streaming' ? (
                  <View style={styles.stopButton} />
                ) : (
                  <Play width={24} height={24} />
                )}
              </TouchableOpacity>
            )}
            {user.account_type === 'partner' && (
              <TouchableOpacity
                onPress={async () => {
                  let branchUniversalObject = await branch.createBranchUniversalObject(
                    'canonicalIdentifier',
                    {
                      locallyIndex: true,
                      contentMetadata: {
                        customMetadata: {
                          classId: classId,
                          timeId: timeId,
                        },
                      },
                    },
                  );
                  let linkProperties = {
                    feature: 'share',
                    classId: classId,
                    timeId: timeId,
                  };

                  let controlParams = {
                    $desktop_url: `https:/imbuefitness.app.link/class/${classId}/${timeId}`,
                  };

                  let { url } = await branchUniversalObject.generateShortUrl(
                    linkProperties,
                    controlParams,
                  );
                  Share.open({
                    title: gymName,
                    message: url,
                  });
                }}
                style={[styles.menuButton, { backgroundColor: '#929294' }]}>
                <ShareIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </ImageBackground>
          <View style={[styles.backgroundBottom, { height: bottom }]} />
        </View>

        {/* { buttonOptions.goBack.show  ? */}
        {/* {buttonOptions.viewChat.state !== 'open' &&
          buttonOptions.viewParticipants.state !== 'open' && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 999,
                  zIndex: 110,
                  // ...simpleShadow,
                  ...containerStyle,
                }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 999,
                  }}
                  // underlayColor="#00000020"
                  onPress={() => navigation.navigate('PartnerDashboard')}>
                  <Icon
                    containerStyle={{
                      width: 50,
                      height: 50,
                    }}
                    imageStyle={imageStyle}
                    source={require('../components/img/png/home.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )} */}
        {/* // : null } */}

        {/* {user.account_type == "partner" ? 
            <TouchableWithoutFeedback
            containerStyle={{
              position: "absolute",
              top: 20,
                right: 20,
            }}
            onPress={() => {
              layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
              refresh(r => r + 1)
            }}
            // [v DEBUG ONLY v]
            onLongPress={config.DEBUG ? () => {
              layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
              refresh(r => r + 1)
            } : null}
            // [^ DEBUG ONLY ^]
            >
            <LiveViewerCountBadge
              hidden={!layoutOptions.viewerCount.show}
            />
            </TouchableWithoutFeedback>
        : null
       } */}

        {/* { liveStatus == 'video.live_stream.connected' ? */}

        {/* <View
          style={{
            width: '100%',
            paddingHorizontal: 15,
            paddingBottom: 80,
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {buttonOptions.viewChat.show ? (
            <ChatButton
              onPress={() => {
                let ptcState, chatState;
                switch (buttonOptions.viewChat.state) {
                  case 'open':
                    chatState = 'closed';
                    ptcState = 'closed';
                    setDeck('open'); // closes after 4500ms
                    break;
                  case 'closed':
                    chatState = 'open';
                    ptcState = 'closed';
                    break;
                }
                buttonOptions.viewChat.state = chatState;
                buttonOptions.viewParticipants.state = ptcState;
                refresh((r) => r + 1);
              }}
            />
          ) : null} */}

        {/* {user.account_type == 'partner' ? (
            <View>
              <CancelButton
            title="Leave"
            onPress={() => navigation.goBack()} 
          />
              <GoLiveButton
                title={
                  buttonOptions.goLive.state === 'streaming'
                    ? 'End Livestream'
                    : 'Go Live'
                }
                onPress={() => {
                  switch (buttonOptions.goLive.state) {
                    case 'streaming':
                      navigation.navigate('SuccessScreen', {
                        successMessageType: 'PartnerLiveStreamCompleted',
                      });
                      // register didPressEnd
                      firestore().collection('partners').doc(user.id).update({
                        didPressEnd: true,
                      });
                      firestore();

                      buttonOptions.goLive.state = 'idle';
                      buttonOptions.goBack.show = true;
                      setTimeout(() => {
                        navigation.navigate('PartnerDashboard');
                      }, 6000);

                      console.log('streaming');
                      break;
                    case 'idle':
                      buttonOptions.goLive.state = 'streaming';
                      buttonOptions.goBack.show = false;
                      console.log('idle');
                      break;
                  }
                  refresh((r) => r + 1);
                  buttonOptions.goLive.onPress();
                }}
              />
            </View>
          ) : null} */}

        {/* {buttonOptions.viewParticipants.show ? */}
        {/* {user.account_type == 'partner' ? (
            <ListButton
              onPress={() => {
                let ptcState, chatState;
                switch (buttonOptions.viewParticipants.state) {
                  case 'open':
                    ptcState = 'closed';
                    chatState = 'closed';
                    setDeck('open'); // closes after 4500ms
                    break;
                  case 'closed':
                    ptcState = 'open';
                    chatState = 'closed';
                    break;
                }
                buttonOptions.viewParticipants.state = ptcState;
                buttonOptions.viewChat.state = chatState;
                refresh((r) => r + 1);
              }}
            />
          ) : null}
        </View> */}
        {/* : null} */}

        {/* {buttonOptions.viewChat.state === 'open' ? (
          <Chat
            containerStyle={{
              width: '94%',
              height: '70%',
              marginTop: 120,
              position: 'absolute',
              alignSelf: 'center',
              zIndex: 110,
            }}
            gymId={gymId}
            user={user}
            onSend={(message) => {
              message = message.trim();
              if (!message) return;

              sendMessage({
                gymId,
                uid: user.id,
                name: `${user.first} ${user.last}`,
                message,
              });
            }}
          />
        ) : null}

        {buttonOptions.viewParticipants.state === 'open' ? (
          <ParticipantList
            containerStyle={{
              width: '94%',
              height: 500,
              marginTop: 120,
              position: 'absolute',
              alignSelf: 'center',
              zIndex: 110,
            }}
          />
        ) : null} */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginLeft: 30,
  },
  className: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  userPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
  },
  backgroundBottom: {
    width: '100%',
    backgroundColor: '#fff',
  },
  backgroundMenu: {
    width: '100%',
    height: 100,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingBottom: 20,
  },
  menuButton: {
    height: 50,
    width: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    height: 24,
    width: 24,
  },
  buttonIconChat: {
    height: 24,
    width: 24,
  },
  buttonIconPlay: {
    height: 20,
    width: 20,
  },
  stopButton: {
    height: 22,
    width: 22,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  homeButton: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'white',
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveStreamStatus: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  liveText: {
    marginLeft: 5,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
