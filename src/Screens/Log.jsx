import React, { useCallback, useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Button,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import background from '../../assets/home.jpg';
import homeicon from '../../assets/home_icon.png';
import setting from '../../assets/setting.png';
import purchase from '../../assets/purchase.png';
import log from '../../assets/log.png'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';



const Log = ({navigation, route}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [history, setHistory] = useState("");
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      setSelectedDate(date);
      let dt = moment(date).format('YYYY-MM-DD');
      console.log(dt);
      hideDatePicker(); 
      firestore()
        .collection('Users')
        .doc(route.params.user)
        .collection(dt)
        .get()
        .then(querySnapshot => {
            console.log('Total Counts: ', querySnapshot.size);
            let result = route.params.user+": "+dt+"\n\n";
            querySnapshot.forEach(documentSnapshot => {
                result += documentSnapshot.id;
                result += ":";
                const data = documentSnapshot.data();
                result += "     ";
                result += data.luckyNumbers;
                result += "\n";
                // console.log('LuckyNumbers ', documentSnapshot.id, documentSnapshot.data());
                
            });
            console.log(result);
            setHistory(result);
        });
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    

    messaging().onMessage(async remoteMessage => {
        setRecentMessagetitle(remoteMessage.notification.title);
        setRecentMessagebody(remoteMessage.notification.body);
        let temp = BadgeCount;
        temp++;
        setBadgeCount(temp); 
        Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: remoteMessage.notification.title,
        textBody: remoteMessage.notification.body,
        button: 'Got it!',
        onPressButton: () =>{
            temp--;
            setBadgeCount(temp); 
        },
        autoClose: true,
        });
    });

  
  return (
    <AlertNotificationRoot>
    <View style={styles.wrapper}>
      <Image source={background} style={styles.bgImg} resizeMode={'cover'}/>
      <View style={{flexDirection: 'row', width: '100%', marginBottom: 20}}>
        <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={() => {
              navigation.navigate('Home',{user: route.params.user});
            }}>
              <Image source={homeicon} style={{width: 40, height: 40}}/>
              {/* <Text style={nbtnText}>Home</Text> */}
            </TouchableOpacity> 
        </View>
        <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={() =>  {
            navigation.navigate('Settings',{user: route.params.user});
          }}>
            <Image source={setting} style={{width: 40, height: 40}}/>
            {/* <Text style={nbtnText}>Settings</Text> */}
          </TouchableOpacity> 
        </View>
        <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={() =>  {
            navigation.navigate('Payment',{user: route.params.user});
          }}>
            <Image source={purchase} style={{width: 40, height: 40}}/>
            {/* <Text style={nbtnText}>Purchase</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={() => {
              navigation.navigate('Log',{user: route.params.user});
            }}>
              <Image source={log} style={{width: 40, height: 40}}/>
              {/* <Text style={nbtnText}>Home</Text> */}
            </TouchableOpacity> 
        </View>        
    </View> 
    <View style={styles.container2}>
        <View style={styles.container}>
            <TouchableOpacity onPress={showDatePicker} style={{marginTop: 10,backgroundColor:'white', borderRadius: 10}}>
                <View >
                    <Text style={{
                        padding: 10,
                        marginLeft: '5%',
                        fontSize: 18,
                        lineHeight: 32,
                        borderRadius: 30,
                        alignSelf: 'center',
                        color: '#286D1D',
                        zIndex: -1,}}
                    >
                        {selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
        <ScrollView style={{backgroundColor: 'white'}}>
            <Text style={styles.ModalText}>{history}</Text>
        </ScrollView>
    </View>
    <View style={styles.container1}>
            
    </View>
        
    </View>
    
    
    </AlertNotificationRoot>
  );

}
export default Log;
const styles = StyleSheet.create({
  container1: {
    height: '50%',
    // borderWidth: 10,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    width: '90%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(40, 109, 30, 0.20)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#286D1D',
    flexDirection: 'column-reverse',
    alignItems:"center"
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 4,
  },
  welcometext: {
    fontFamily: 'Times New Roman',
    fontSize: 40,
    alignSelf: 'center',
    color: '#000000',
  },
  bgImg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -1.0,
    opacity: 1.0,
    alignSelf: 'center',
  },
  textInput: {
    borderRadius: 30,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    margin: 10,
    paddingHorizontal: 20,
    width: '90%',
    alignSelf: 'center',
    color: '#286D1D'
  },
  slider: {
    width: '90%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  modalContent: {
    backgroundColor: 'rgba(40, 108, 30, 1.0)',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalbtn: {
    alignItems: 'center',
    margin: 20,
    padding: 5,
    width: 100,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: '#286D1D',
  },
  
  ModalText: {
    fontWeight: 'medium',
    margin: 10,
    fontSize: 18,
    color: '#286D1D',
    alignSelf: 'center',
  },
  
  btnText:{
    fontWeight: 'medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});