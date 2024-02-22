import React, { useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import background from '../../assets/home.jpg';
import {btnContainer, btn, btnText, nbtn, nbtnText} from '../common/button';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Slider from 'rn-range-slider';
import firestore from '@react-native-firebase/firestore';
// import Slider from '@react-native-community/slider';

import Thumb from '../Components/Thumb';
import Rail from '../Components/Rail';
import RailSelected from '../Components/RailSelected';
import Notch from '../Components/Notch';
import Label from '../Components/Label';
import setting from '../../assets/setting.png';
import purchase from '../../assets/purchase.png';
import homeicon from '../../assets/home_icon.png';
import log from '../../assets/log.png'

const Settings = ({navigation, route}) => {
  let init_max = 100, init_min = 0, init_num = 1;
  let init_low = 0, init_high = 0;
  firestore()
    .collection('Users')
    .doc(route.params.user)
    .onSnapshot(documentSnapshot => {
      const data = documentSnapshot.data();
      init_num = data.numsTogen;
      init_min = data.min;
      init_max = data.max;
      init_low = data.min;
      init_high = data.max;
      console.log('User data: ', count, init_min, init_max);
  });

  const [min, setMin] = useState(init_min);
  const [max, setMax] = useState(init_max);
  const [low, setLow] = useState(init_min);
  const [high, setHigh] = useState(init_max);
  const [count, setCount] = useState(init_num);
  // State Vairables for RangeSlider
  useEffect(() => {
    
  }, []);
  

  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [floatingLabel, setFloatingLabel] = useState(false);
  
  const renderThumb = useCallback(
    (name: 'high' | 'low') => <Thumb name={name} />,
    [],
  );
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback(value => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);
    const handleValueChange = useCallback((lowValue, highValue) => {
    setLow(lowValue);
    console.log('Before Setting vale ====', lowValue, highValue, min, max)
    if(lowValue == min) {
      let tempmin = min;
      tempmin =  Math.max(0, tempmin - 100);
      setMin(tempmin);
    }
    setHigh(highValue);
    if(highValue == max) {
      let tempmax = max;
      tempmax = tempmax*2;
      setMax(tempmax);
    }
    
    console.log('After Setting value ====', low, high, min, max)
  }, []);
  const toggleRangeEnabled = useCallback(
    () => setRangeDisabled(!rangeDisabled),
    [rangeDisabled],
  );

  const toggleFloatingLabel = useCallback(
    () => setFloatingLabel(!floatingLabel),
    [floatingLabel],
  );
 
  const collectionRef = firestore().collection('Users');
  const documentRef = collectionRef.doc(route.params.user);
  const backtoHome =  () => {
    documentRef
    .set({
      name: route.params.user,
      numsTogen: count,
      min: min,
      max: max,
    })
    .then(() => {
      console.log('Data Saved!');
    });
    navigation.navigate('Home', {user: route.params.user});
  }
  const gotoPayment =  () => {
    documentRef
    .set({
      name: route.params.user,
      numsTogen: count,
      min: min,
      max: max,
    })
    .then(() => {
      console.log('Data Saved!');
    });
    navigation.navigate('Payment', {user: route.params.user});
  }
  const gotoLog =  () => {
    documentRef
    .set({
      name: route.params.user,
      numsTogen: count,
      min: min,
      max: max,
    })
    .then(() => {
      console.log('Data Saved!');
    });
    navigation.navigate('Log', {user: route.params.user});
  }
  return (
    <View style={styles.wrapper}>
      <Image source={background} style={styles.bgImg} resizeMode={'cover'}/>
      <View style={{flexDirection: 'row', width: '100%', marginBottom: 20}}>
      <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={backtoHome}>
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
          <TouchableOpacity onPress={gotoPayment}>
            <Image source={purchase} style={{width: 40, height: 40}}/>
            {/* <Text style={nbtnText}>Purchase</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{width: '25%', alignItems: 'center'}} >
          <TouchableOpacity onPress={gotoLog}>
              <Image source={log} style={{width: 40, height: 40}}/>
              {/* <Text style={nbtnText}>Home</Text> */}
            </TouchableOpacity> 
        </View>
      </View>
      {/* <Slider
          style={styles.slider}
          min={min}
          max={max}
          step={1}
          disableRange={rangeDisabled}
          floatingLabel={floatingLabel}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
        /> */}
      <View style={{width: '80%', alignItems:'center', paddingVertical: 40}}>
        
        <Text style={styles.nbtnText}>Range  {min} - {max}</Text>
      </View>
     
        <View style = {{flexDirection: 'row', alignItems:'center'}}>
            <View style={{flexDirection: 'column-reverse', alignItems:'flex-end', width: '40%'}}>
                
                <Text style={styles.nbtnText}>Counts : </Text>                
                <Text style={styles.nbtnText}>Max Value : </Text>   
                <Text style={styles.nbtnText}>Min Value : </Text>             
            </View>
            
            <View style={{flexDirection: 'column-reverse', alignItems:'flex-end', width: '40%'}}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        let number = parseFloat(text);
                        if(number) setCount(number);
                        else setCount(1);
                        console.log(number);
                    }
                }
                    placeholder=''>{count}</TextInput>
                
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                            let number = parseFloat(text);
                            if(number) {
                              if(number > min){
                                setMax(number);
                                // setHigh(number);
                                
                              }
                              else {
                                setMax(min+1)
                              }
                            }
                            else {
                              setMax(1);
                            }
                            console.log(number);
                        }
                    }
                    placeholder=''>{max}</TextInput>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                            let number = parseFloat(text);
                            if(number) {
                              if(number < max)                              
                                setMin(number);
                              else 
                                setMin(max-1)
                            }
                            else {
                              setMin(0);
                            }
                            console.log(number);
                        }
                    }
                    placeholder=''>{min}</TextInput>
            </View>
        </View>
        
       
    </View>
  );

 
}
export default Settings;
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
  input: {
    borderRadius: 30,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    margin: 3,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    color: '#286D1D'
  },
  slider: {
    width: '85%',
    marginBottom: 20,
  },
  nbtnText: {
    fontWeight: 'medium',
    margin: 12,
    fontSize: 24,
    color: '#FFFFFF',
  }
});