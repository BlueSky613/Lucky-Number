import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
// import background from '../../assets/signup.jpg';
// import {bgImg} from '../common/background';
// import {logocss} from '../common/logo.js';
// import {btn, nbtn, nbtnText, btnText} from '../common/button';
import logo from '../../assets/logo.png';
import mark from '../../assets/mark.png';
import {flexRow} from '../common/FlexRow';
import SQLite from 'react-native-sqlite-storage'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const db = SQLite.openDatabase({
  name: 'mydb',
  location: 'default'
},
() => {
  console.log("Database connected!")
}, //on success
error => console.log("Database error", error) //on error
)
const Login = ({navigation}) => {
  const [fdata, setFdata] = useState({
    username: '',
    password: '',
  });
  const [errormsg, setErrorMsg] = useState(null);

  const sendToBackend = () => {
    if (
      fdata.username === '' ||
      fdata.password === '' 
    ) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'All the fields are required',
      });
      return;
    } else {
        let sql = `SELECT password FROM users WHERE username='${fdata.username}'`;
        console.log(sql);
        db.executeSql(sql, [], (results) => {
            const len = results.rows.length;
            console.log(len);
            if (len === 0) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Warning',
                textBody: 'Such account doesn\'t exist!',
              });
            } else {
              const row = results.rows.item(0);

              if (fdata.password === row.password) {
                // navigation.navigate('Home');
                navigation.navigate('Home', {user: fdata.username});
                  return;
              }
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Failed',
                textBody: 'User Authentication Failed!',
              });
            }
        });
      }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.wrapper}>
      <View style={styles.container1}>
        <Image source={logo} style={styles.logo}  resizeMode='stretch'/>
        <Image source={mark} style={styles.mark}  resizeMode='contain'/>
      </View>
      <View style={styles.container2}>
        {/* <View>
          {errormsg ? <Text style={{color: 'white', alignSelf: 'center'}}>{errormsg}</Text> : null}
        </View> */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setFdata({...fdata, username: text})}
            onPressIn={() => setErrorMsg(null)}
            placeholder='Username'></TextInput>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={text => setFdata({...fdata, password: text})}
            onPressIn={() => setErrorMsg(null)}
            placeholder='Password'></TextInput>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity>
            <Text style={{color: '#FFFFFF', fontSize: 16,}}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendToBackend}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Login</Text>
            </View>
          </TouchableOpacity>
          <View style={flexRow}>
            <Text style={{color: '#FFFFFF', fontSize: 16,}}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{color: '#FFFFFF', fontSize: 16, borderColor: '#FFFFFF', borderBottomWidth: 1,}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    </AlertNotificationRoot>
    
  );
};

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
  },
  container1: {
    height: '50%',
    // borderWidth: 10,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    borderWidth: 1,
    borderBottomColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    backgroundColor: 'rgba(40, 109, 30, 0.90)',
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
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    opacity: 0.7,
  },
  loginText: {
    fontSize: 40,
    marginTop: 20,
  },
  black: {
    color: 'black',
    fontSize: 18,
    margin: 10,
  },
  formContainer: {
    marginTop: '15%',
    marginVertical: 10,
    marginHorizontal: 20,
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
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 3,
  },
  mark: {
    marginTop: '10%',
    width: '100%',
    height: undefined,
    aspectRatio: 2,
  },
  btnText:{
    fontWeight: 'medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  btn: {
    alignItems: 'center',
    margin: 20,
    padding: 15,
    width: 300,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: '#286D1D',
  },
  text: {
    color: 'black',
  },
  mainHeading: {
    fontSize: 32,
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold',
  },
});
