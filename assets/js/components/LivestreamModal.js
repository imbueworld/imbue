import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import SendIcon from '../components/img/svg/send.svg';
import cache from '../backend/storage/cache';
import {sendMessage} from '../backend/LivestreamFunctions';
import SoundOn from '../components/img/svg/sound_on.svg';
import SoundOff from '../components/img/svg/sound_off.svg';
import Location from '../components/img/svg/location.svg';

export const LivestreamModal = ({visible, close, gymId, user}) => {
  const [state, setState] = useState('chat');
  const [message, setMessage] = useState('');

  const [ptcs, setPtcs] = useState([]);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    cache('livestream/functions/setParticipants').set(setPtcs);
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

  const pad = time => {
    return time < 10 ? `0${time}` : time;
  };

  console.log(ptcs);

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      swipeDirection={['down']}
      onSwipeComplete={() => close()}
      propagateSwipe={true}>
      <View style={styles.background}>
        <View style={styles.header}>
          <View style={styles.closeModal} />
          <Text style={styles.courseName}>ABS & CORE</Text>
          <Text style={styles.courseTime}>13:05 - 14:05</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.buttonHeader}>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setState('chat')}>
              <Text
                style={[
                  styles.switchButtonText,
                  state === 'chat' && {color: '#242429'},
                ]}>
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setState('users')}>
              <Text
                style={[
                  styles.switchButtonText,
                  state === 'users' && {color: '#242429'},
                ]}>
                Users
              </Text>
            </TouchableOpacity>
          </View>
          {state === 'chat' ? (
            <View style={styles.chat}>
              <View
                style={styles.chatList}
                onStartShouldSetResponder={() => true}>
                <FlatList
                  data={sortedChat}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                  renderItem={({item, index}) => {
                    console.log(item);
                    if (item.uid === user.id)
                      return (
                        <View style={styles.messageWrapper}>
                          <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>
                              {item.message}
                            </Text>
                            <View style={styles.messageInfo}>
                              <Text
                                style={styles.userName}>{`${user.name}`}</Text>
                              <Text style={styles.time}>{`${pad(
                                new Date(item.timestamp).getHours(),
                              )}:${pad(
                                new Date(item.timestamp).getMinutes(),
                              )}`}</Text>
                            </View>
                          </View>
                        </View>
                      );

                    return (
                      <View style={styles.messagePtcWrapper}>
                        <View style={styles.messagePtcContainer}>
                          <Text style={styles.messagePtcText}>
                            {item.message}
                          </Text>
                          <View style={styles.messagePtcInfo}>
                            <Text
                              style={styles.userPtcName}>{`${user.name}`}</Text>
                            <Text style={styles.timePtc}>{`${pad(
                              new Date(item.timestamp).getHours(),
                            )}:${pad(
                              new Date(item.timestamp).getMinutes(),
                            )}`}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={message}
                    placeholder={'send message'}
                    placeholderTextColor={'black'}
                    onChangeText={text => setMessage(text)}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={message.trim() === ''}
                    onPress={() =>
                      sendMessage({
                        gymId,
                        uid: user.id,
                        name: `${user.first} ${user.last}`,
                        message,
                      }).then(() => setMessage(''))
                    }>
                    <SendIcon width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.users} onStartShouldSetResponder={() => true}>
              <FlatList
                data={ptcs
                  .filter(el => el.here)
                  .concat(ptcs.filter(el => !el.here))}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
                renderItem={({item, index}) => {
                  console.log(item);
                  console.log(index);
                  return (
                    <TouchableOpacity
                      disabled={!item.here || user.account_type !== 'partner'}
                      style={styles.user}>
                      <View style={styles.userRight}>
                        <Text style={styles.userInfo}>{item.name}</Text>
                        <View style={styles.userLocation}>
                          <Location width={25} height={25} />
                          <Text style={styles.locationText}>USA</Text>
                        </View>
                      </View>
                      <View style={styles.userLeft}>
                        <SoundOn width={28} height={28} />
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  closeModal: {
    width: '40%',
    height: 3,
    backgroundColor: 'white',
    marginVertical: 14,
  },
  header: {
    marginHorizontal: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  courseName: {
    fontSize: 18,
    fontWeight: '200',
    color: '#BCC1CD',
  },
  courseTime: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#BCC1CD',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  buttonHeader: {
    paddingVertical: 6,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  switchButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  switchButtonText: {
    color: '#878789',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chat: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#E5E5E5',
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
  },
  chatList: {
    flex: 1,
  },
  messageWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  messagePtcWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  messageContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
    width: '80%',
    paddingTop: 6,
  },
  messagePtcContainer: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
    width: '80%',
    paddingTop: 6,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagePtcText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  messageInfo: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  messagePtcInfo: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  userName: {
    fontSize: 16,
    marginRight: 5,
    fontWeight: 'bold',
  },
  userPtcName: {
    color: '#919194',
    fontSize: 16,
    marginRight: 5,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePtc: {
    color: '#919194',
    fontSize: 16,
    fontWeight: 'bold',
  },
  users: {
    flex: 1,
  },
  user: {
    width: '100%',
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
});
