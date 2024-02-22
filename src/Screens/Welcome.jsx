import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {btnContainer, btn, btnText, nbtn, nbtnText} from '../common/button';
import background from '../../assets/background.jpg';
const Welcome = ({navigation}) => {
  return (
    <View style={styles.wrapper}>
      <Image source={background} style={styles.bgImg} resizeMode={'cover'}/>
      {/* <Image source={logo} style={styles.logo} /> */}
      <View style={btnContainer}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <View style={btn}>
            <Text style={btnText}>Create an Account</Text>
          </View>
           </TouchableOpacity> */}
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={nbtn}>
            <Text style={nbtnText}>Get Started</Text>
          </View>
        </TouchableOpacity>            
      </View>
      {/* <Text style={styles.welcometext}>My Lucky Life</Text> */}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column-reverse',
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
});
