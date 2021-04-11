import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colors} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';

import {clockFromTimestamp} from '../backend/HelperFunctions';
import Icon from './Icon';

import {publicStorage} from '../backend/BackendFunctions';
import cache from '../backend/storage/cache';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

export default function LivestreamMessages(props) {
  const user = props.user;

  const currentScrollValue = props.currentScrollValue;
  const scrollViewRef = props.scrollViewRef;
  const moreMessagesRef = useRef(null);

  const [ptcs, setPtcs] = useState([]);
  const [chat, setChat] = useState([]);

  /**
   * Forward set functions to cache,
   * so that they can be called from <LivestreamLayout />
   * rerendering only and only this very component, not the whole tree,
   * which would cause problems, like keyboard going down when typing
   */
  useEffect(() => {
    cache('livestream/participants').set(setPtcs);
    cache('livestream/functions/setChat').set(setChat);
  }, []);

  useEffect(() => {
    const read = async () => {
      let ptcs = cache('livestream/participants').get() || [];
      setPtcs(ptcs);
      let chat = cache('livestream/chat').get() || [];
      setChat(chat);
    };
    read();
  }, []);

  let newChat = chat.sort((a, b) => {
    let ts1 = a.timestamp;
    let ts2 = b.timestamp;
    return ts1 - ts2;
  });
  newChat.forEach((message, idx) => {
    ptcs.forEach(ptc => {
      if (message.uid === ptc.uid) {
        message.icon_uri = ptc.icon_uri;
        message.name = ptc.name;
      }
    });
  });
  // Filter out to last 40 messages
  newChat = newChat.filter((message, idx) => {
    if (idx + 1 > newChat.length - 40) return true;
  });
  const sortedChat = newChat;

  const Message = props => {
    const [iconUri, setIconUri] = useState(null);
    useEffect(() => {
      const init = async () => {
        let iconUri = await publicStorage(props.icon_uri);
        setIconUri(iconUri);
      };
      init();
    }, []);

    const stickToRight = props.stickToRight;
    const Time = (
      <Text
        style={{
          marginRight: stickToRight ? 6 : 0,
          marginLeft: stickToRight ? 0 : 6,
          paddingTop: 3,
          ...FONTS.body,
          color: colors.grayInactive,
          textAlignVertical: 'top',
          fontSize: 12,
        }}>
        {clockFromTimestamp(props.timestamp)}
      </Text>
    );
    const UserIcon = (
      <Icon
        containerStyle={{
          width: 47,
          height: 47,
          borderRadius: 999,
          overflow: 'hidden',
        }}
        source={{uri: iconUri}}
      />
    );

    return (
      <View style={{flexDirection: stickToRight ? 'row-reverse' : 'row'}}>
        <View
          style={{
            maxWidth: '88%',
            marginVertical: 5,
            paddingVertical: 7,
            paddingRight: stickToRight ? 7 : 15,
            paddingLeft: stickToRight ? 15 : 7,
            borderWidth: 1,
            // borderColor: colors.gray,
            borderColor: colors.buttonFill,
            borderRadius: 30,
            flexDirection: 'row',
            ...props.containerStyle,
          }}>
          {stickToRight ? null : UserIcon}

          <View
            style={{
              marginRight: stickToRight ? 10 : 0,
              marginLeft: stickToRight ? 0 : 10,
              alignItems: stickToRight ? 'flex-end' : undefined,
              flexShrink: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              {stickToRight ? Time : null}
              <Text
                style={{
                  ...FONTS.body,
                  flexShrink: 1,
                  ...props.labelStyle,
                }}>
                {props.name}
              </Text>
              {stickToRight ? null : Time}
            </View>

            <Text
              style={{
                ...FONTS.body,
                ...props.style,
              }}>
              {props.message}
            </Text>
          </View>

          {stickToRight ? UserIcon : null}
        </View>
      </View>
    );
  };

  const Messages = sortedChat.map(
    ({
      name = 'Anonymous',
      message,
      uid,
      timestamp,
      icon_uri = 'imbueProfileLogoBlack.png',
    }) => (
      <Message
        containerStyle={uid === user.id ? styles.selfMsg : styles.msg}
        labelStyle={styles.label}
        style={uid === user.id ? styles.selfMsgText : styles.msgText}
        stickToRight={uid === user.id ? true : false}
        {...{
          name,
          message,
          timestamp,
          icon_uri,
        }}
        key={`${uid}${timestamp}`}
      />
    ),
  );

  useEffect(() => {
    if (props.scrollToBottom) {
      if (currentScrollValue[0] > 50) {
        return;
      }
      props.scrollToBottom();
    }
  });

  function hideMoreMessagesPopup() {
    if (!moreMessagesRef.current) return;
    moreMessagesRef.current.setNativeProps({
      style: {
        height: 0,
      },
    });
  }
  function showMoreMessagesPopup() {
    moreMessagesRef.current.setNativeProps({
      style: {
        height: 30,
      },
    });
  }

  return (
    <>
      {chat.length >= 7 ? (
        <View
          ref={moreMessagesRef}
          style={{
            width: '50%',
            height: 30,
            position: 'absolute',
            bottom: 85,
            alignSelf: 'center',
            zIndex: 110,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00000025',
            }}
            onPress={() => {
              props.scrollToBottom();
              hideMoreMessagesPopup();
            }}>
            <Text
              style={{
                ...FONTS.body,
              }}>
              More messages below
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        ref={scrollViewRef}
        onScroll={({nativeEvent}) => {
          const contentHeight = nativeEvent.contentSize.height;
          const userScrollProgress =
            nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height;
          currentScrollValue[0] = contentHeight - userScrollProgress;

          if (currentScrollValue[0] < 50) {
            hideMoreMessagesPopup();
          } else {
            // Show only if velocity is negative (scrolling upwards),
            // to prevent the popup from flickering when pressing on it to make it disappear
            if (nativeEvent.velocity.y < 0) showMoreMessagesPopup();
          }
        }}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 80,
            paddingHorizontal: '3%',
          }}>
          {Messages}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
  },
  msg: {
    // maxWidth: "88%",
    // marginVertical: 5,
    // paddingVertical: 7,
    // paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: colors.gray,
    // borderRadius: 30,
    backgroundColor: '#00000008',
  },
  msgText: {
    fontSize: 17,
  },
  selfMsg: {
    // maxWidth: "88%",
    // marginVertical: 5,
    // paddingVertical: 7,
    // paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: colors.gray,
    // borderRadius: 30,
    backgroundColor: '#ffffff80',
  },
  selfMsgText: {
    fontSize: 17,
  },
});
