import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  StatusBar,
  Image
} from 'react-native';
import Modal from 'react-native-modal';
import SoundOn from '../components/img/svg/sound_on.svg';

export const LivestreamUserModal = ({visible, close, user}) => {

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      swipeDirection={['down']}
      onSwipeComplete={() => close()}
      propagateSwipe={true}>
      <View style={styles.background}>
        <View style={styles.content}>
          <View style={styles.closeModal}/>
          <View style={styles.user}>
            <Image style={styles.userImage} source={{uri:'https://firebasestorage.googleapis.com/v0/b/spring-ranger-281214.appspot.com/o/'+user.icon_uri+'?alt=media&token=60675c9d-f2e4-49ee-a879-13308e16439c'}}/>
            <View style={styles.userItem}>
              <Text style={styles.userInfo}>{user.name}</Text>
              <View style={styles.userLeft}>
                <SoundOn width={28} height={28} />
              </View>
            </View>
          </View>
                  
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
    paddingTop:100,
  },
  closeModal: {
    width: '30%',
    height: 3,
    backgroundColor: 'white',
    marginVertical: 20,
  },
  header: {
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection:'row'
  },
  content: {
    flex: 1,
    backgroundColor:'#rgba(36, 36, 41, 0.5)',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems:'center'
  },
  buttonHeader: {
    paddingVertical: 6,
    flexDirection: 'row',
    paddingHorizontal: 30,
    alignItems:'center'
  },
  user: {
    flex:1,
    marginHorizontal:20,
    marginBottom:50,
    maxHeight:500,
    backgroundColor: 'black',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userItem:{
    position:'absolute',
    width:'100%',
    flexDirection:'row',
    bottom:0,
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:15,
    borderRadius:15,
    backgroundColor:'#rgba(36, 36, 41, 0.5)'
  },
  userImage:{
    width:'100%',
    height:'100%',
    flex:1,
    resizeMode:'cover',
    backgroundColor: 'black',
    borderRadius: 15,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    paddingRight:20,
    flex:1,
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
