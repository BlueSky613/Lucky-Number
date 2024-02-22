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
} from 'react-native';
import Roulette from 'react-native-casino-roulette';
import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

import background from '../../assets/home.jpg';
import wheel from '../../assets/wheel.png';
import marker from '../../assets/marker.png';
import homeicon from '../../assets/home_icon.png';
import setting from '../../assets/setting.png';
import purchase from '../../assets/purchase.png';
import log from '../../assets/log.png'
import {btnContainer, btn, btnText, nbtn, nbtnText} from '../common/button';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import IconBadge from 'react-native-icon-badge';
import notification from  '../../assets/notification.png';
import moment from 'moment';
import check from '../../assets/check.png'
import alert from '../../assets/alert.png'

// import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
const data = [
  { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: '1', style: { backgroundColor: 'white' } },
  { option: '2' },
]



const Home = ({navigation, route}) => {
  
  const [warnvisible, setWarnVisible] = useState(false);
  const [successvisible, setSuccessVisible] = useState(false);
  const [notifivisible, setNotifiVisible] = useState(false);
  const [rouletteState,setRouletteState] = useState("stop");

  const [BadgeCount, setBadgeCount] = useState(0);
  const [canPlay, setCanPlay] = useState(true);
  
  const [recentMessagebody, setRecentMessagebody] = useState("");
  const [recentMessagetitle, setRecentMessagetitle] = useState("");

  const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
  //Roulette numbers
  const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]
  const options  = numbers.map((o)=>({index:o}))  
  const [count, setCount] = useState(1);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [luckynums, setLuckynums] = useState('');
  let result = "";
  var Sound = require('react-native-sound');
  Sound.setCategory('Playback');
  messaging().onMessage(async remoteMessage => {
    setRecentMessagetitle(remoteMessage.notification.title);
    setRecentMessagebody(remoteMessage.notification.body);
    alertsound();
    viewNotification();
    // Dialog.show({
    //   type: ALERT_TYPE.SUCCESS,
    //   title: remoteMessage.notification.title,
    //   textBody: remoteMessage.notification.body,
    //   button: 'Got it!',
    //   onPressButton: () =>{
    //     if(temp > 0)
    //       temp --;
    //     setBadgeCount(temp);
    //     navigation.navigate('Payment',{user: route.params.user});
    //   },
    //   onHide: () =>{
    //     setBadgeCount(temp);
    //   },
    //   autoClose: 3000,
    // });
  });

  useEffect(() => {
    const currentTime = new Date();
    const resetTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 0, 0, 0); // Set the reset time to 8:00 AM

    const timeUntilReset = resetTime - currentTime;

    const resetTimeout = setTimeout(() => {
      setCanPlay(true);
    }, timeUntilReset);
    // console.log(timeUntilReset);
    LoadUserInfo();
    return () => clearTimeout(resetTimeout);
  }, []);
  let luckyNumbers = new Set();
  // useFocusEffect(
  //   useCallback(() => {
  //      showLuckyNumbers();
  //    },[rouletteState, canPlay])
  // )
  const alertsound = () => {
    // Load the sound file 'roulette.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var roulettesound = new Sound('bell.wav', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('alert soundduration in seconds: ' + roulettesound.getDuration() + 'number of channels: ' + roulettesound.getNumberOfChannels());

      // Play the sound with an onEnd callback
      roulettesound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    // Reduce the volume by half
    roulettesound.setVolume(0.5);

    // Position the sound to the full right in a stereo field
    roulettesound.setPan(1);

    // Loop indefinitely until stop() is called
    roulettesound.setNumberOfLoops(-1);
  }
  const playsound = () => {
    // Load the sound file 'roulette.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var roulettesound = new Sound('roulette.wav', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + roulettesound.getDuration() + 'number of channels: ' + roulettesound.getNumberOfChannels());

      // Play the sound with an onEnd callback
      roulettesound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    // Reduce the volume by half
    roulettesound.setVolume(0.5);

    // Position the sound to the full right in a stereo field
    roulettesound.setPan(1);

    // Loop indefinitely until stop() is called
    roulettesound.setNumberOfLoops(-1);

  }
  
  const showLuckyNumbers = () =>{
    if (canPlay) {        
        saveLuckynums();
        viewSuccess();
    }
    else {
        viewWarning();
    }
  }

  const saveLuckynums = () => {
    const collectionRef = firestore().collection('Users');
    const documentRef = collectionRef.doc(route.params.user);
    const currentDate = new Date();
    let date = moment(currentDate).format('YYYY-MM-DD');
    const localTime = currentDate.toLocaleTimeString();

    console.log(localTime);
    documentRef.collection(date)
    .doc(localTime)
    .set({
      luckyNumbers: result,
    })
    .then(() => {
      console.log('Data Saved!');
    });
  }

  const getMyLuckyNumbers = (numsToPlay, minRange, maxRange) => {
    let pickedNumber;
    let luckyNumbers = new Set();

    for (let i = 0; i < numsToPlay; i++) {
        pickedNumber = Math.floor(Math.random() * (maxRange - minRange + 1));
        while (luckyNumbers.has(pickedNumber)) {
            pickedNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        }
        luckyNumbers.add(pickedNumber);
    }
    return luckyNumbers;
  }
  const onRotateChange = (state) => {
    console.log(state);
    if(state === 'start') {
      luckyNumbers = getMyLuckyNumbers(count, min, max);
      result = "";
      luckyNumbers.forEach (function(value) {
        result += value;
        result += " ";
      })
      setLuckynums(result);
      playsound();
      console.log(result);
    }
    if(state === 'stop'){
      // setCanPlay(false);
      
      showLuckyNumbers();
    }
    
    setRouletteState(state);
  }

 const LoadUserInfo = async () => {
    // console.log('LoadUserInfo is called');

    const subscriber = firestore()
      .collection('Users')
      .doc(route.params.user)
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        console.log(data);
        setCount(data.numsTogen);
        setMin(data.min);
        setMax(data.max);
        // console.log('User data: ', count, min, max);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();    
 }
  
const viewWarning = () => {
  setWarnVisible(true);
  const timer = setTimeout(() => {
    setWarnVisible(false);
  }, 3000);
};

const hideWarning = () => {
  setWarnVisible(false);
};
const handleBuy = () => {
  // Handle the save logic with the text input values
  hideWarning();
  navigation.navigate('Payment',{user: route.params.user});
};

const viewSuccess = () => {
  setSuccessVisible(true);
  const timer = setTimeout(() => {
    setSuccessVisible(false);
  }, 5000);
};

const hideSuccess = () => {
  setSuccessVisible(false);
};

const viewNotification = () => {
  setNotifiVisible(true);
  const timer = setTimeout(() => {
    hideNotification();
  }, 5000);
};
const showNotification = () => {
  setNotifiVisible(true);
  const timer = setTimeout(() => {
    setNotifiVisible(false);
  }, 5000);
};

const hideNotification = () => {
  setNotifiVisible(false);
  let temp = BadgeCount;
  temp ++;
  setBadgeCount(temp);
};
const handleNofication = () => {
  navigation.navigate('Payment',{user: route.params.user});
  setNotifiVisible(false);
};
  return (
    <AlertNotificationRoot>
    <View style={styles.wrapper}>
      <Image source={background} style={styles.bgImg} resizeMode={'cover'}/>
      
      <Modal
        visible={successvisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideSuccess}
      >
        <View style={styles.modalContainer}>
          
          <View style={styles.modalContent}>
            <Image source={check} style={{width: 70 , height: 70, marginTop: '-18%'}} />
            <Text style={styles.ModalHeader}>Success</Text>
            <Text style={styles.ModalText}>Today's Lucky Number</Text>
            <Text style={styles.ModalText}>{luckynums}</Text>
            <Text style={styles.ModalText}>Enjoy Your Day!</Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={hideSuccess}>
                <View style={styles.modalbtn}>
                  <Text style={styles.btnText}>Got it</Text>
                </View>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
      <Modal
        visible={warnvisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideWarning}
      >
        <View style={styles.modalContainer}>
          
          <View style={styles.modalContent}>
            <Image source={alert} style={{width: 80 , height: 80, marginTop: '-25%'}} />
            <Text style={styles.ModalHeader}>Warning </Text>
            <Text style={styles.ModalText}>You run out of today's chance </Text>
            <Text style={styles.ModalText}>Try it tomorrow or purchase </Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={hideWarning}>
                <View style={styles.warningmodalbtn}>
                  <Text style={styles.btnText}>CANCEL</Text>
                </View>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>

      <Modal
        visible={notifivisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideNotification}
      >
        <View style={styles.modalContainer}>
          
          <View style={[styles.modalContent]}>
            <Image source={check} style={{width: 70 , height: 70, marginTop: '-18%'}} />
            <Text style={styles.ModalHeader}>{recentMessagetitle}</Text>
            <Text style={{textAlign: 'center'}}>{recentMessagebody}</Text>
           
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={handleNofication}>
                <View style={styles.modalbtn}>
                  <Text style={styles.btnText}>Got it</Text>
                </View>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
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
      <Roulette 
        enableUserRotate={rouletteState=='stop'} 
        background={wheel}
        onRotateChange={onRotateChange}
        marker={marker}
        options={options}
        markerWidth={200} 
        duration = {3000}
        >          
      </Roulette>
      <View style={{position:'absolute', top: 10, right: 10}}>
        <TouchableOpacity onPress={() =>  {
          if(recentMessagetitle || recentMessagebody)
            {
              showNotification();
              alertsound();
            }
          if(BadgeCount > 0){
            let temp = BadgeCount;
            temp--;
            setBadgeCount(temp); 
          }
        }}>
          <IconBadge
            MainElement={
              <Image source={notification} style={{ 
                width:40,
                height:40,
                margin:6}} />
            }
            BadgeElement={
              <Text style={{color:'#286D1D'}}>{BadgeCount}</Text>
            }
            IconBadgeStyle={
              {width:25,
              height:25,
              backgroundColor: 'yellow',}
            }
            Hidden={BadgeCount==0}
            />
        </TouchableOpacity>     
      </View>
      
    </View>
    </AlertNotificationRoot>
  );

}
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column-reverse',
    alignItems:"center"
  },
  imgContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'flex-end',
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
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    // backgroundColor: 'rgba(255, 255, 255, 0.66)',
    width: '70%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalbtn: {
    alignItems: 'center',
    marginTop: 20,
    margin: 10,
    padding: 5,
    width: 120,
    borderColor: '#99CC00',
    borderWidth: 3,
    borderRadius: 25,
    backgroundColor: '#99CC00',
  },
  warningmodalbtn: {
    alignItems: 'center',
    marginTop: 20,
    margin: 10,
    padding: 5,
    width: 150,
    borderColor: '#FF8000',
    borderWidth: 3,
    borderRadius: 25,
    backgroundColor: '#FF8000',
  },
  ModalHeader: {
    fontWeight: '600',
    height: 28,
    fontSize: 22,
    margin: 4,
    color: '#000000',
    alignSelf: 'center',
  },

  ModalText: {
    fontWeight: 'medium',
    height: 18,
    fontSize: 14,
    color: '#303030',
    alignSelf: 'center',
    flexWrap: 'wrap-reverse',
    textAlign: 'center',
  },
  
  btnText:{
    fontWeight: '800',
    fontSize: 16,
    color: '#FFFFFF',
  },
});