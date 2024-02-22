import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage'
import React, {useState, useEffect} from 'react';
import {wrapper} from '../common/wrapper';

import logo from '../../assets/logo.png';
import mark from '../../assets/mark.png';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import firestore from '@react-native-firebase/firestore';

const db = SQLite.openDatabase({
  name: 'mydb',
  location: 'default'
},
() => {
  console.log("Database connected!")
}, //on success
error => console.log("Database error", error) //on error
)
db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username VARCHAR, email VARCHAR, birthday VARCHAR, height VARCHAR, numberofchildren VARCHAR, fatherage VARCHAR, motherage VARCHAR, password VARCHAR, cpassword VARCHAR)", [], (result) => {
  console.log("Table created successfully");
}, (error) => {
  console.log("Create table error", error)
})

const SignUp = ({navigation}) => {
  const [fdata, setFdata] = useState({
    username: '',
    email: '',
    height: '',
    numberofchildren: '',
    fatherage: '',
    motherage: '',
    password: '',
    cpassword: '',
  });
  const [errormsg, setErrorMsg] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    
    setSelectedDate(date);
    
    // console.log("A date has been picked: ", date);
    hideDatePicker();
  };
  //database connection
  

  useEffect(() => {
    if(errormsg){
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: errormsg,
      });
    }
  }, [errormsg]);
  const sendToBackend = () => {
    // checking data received
    // console.log(fdata);
    // console.log(moment(selectedDate).format('YYYY-MM-DD'));
    if (
      fdata.username === '' ||
      fdata.email === '' ||
      selectedDate === null ||
      fdata.height === '' ||
      fdata.numberofchildren === '' ||
      fdata.motherage === '' ||
      fdata.fatherage === '' ||
      fdata.password === '' ||
      fdata.cpassword === ''
    ) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'All the fields are required',
      });
      return;
    } else {
      if (fdata.password !== fdata.cpassword) {
        console.log('Password and confirm password must be same');
        return;
      } else {
        let len = 0;
        

        db.transaction((txn) => {
            let sql = `SELECT * FROM users WHERE username='${fdata.username}'`;
            txn.executeSql(sql, [], (trans, results) => {
                console.log("execute success results: " + JSON.stringify(results))
                len = results.rows.length;
                console.log(len);
            },
                (error) => {
                console.log("execute error: " + JSON.stringify(error))
                reject(error);
            });
        });
        

        if (len === 0) {
          db.transaction((txn) => {
            let sql = `INSERT INTO users (username, email, birthday, height, numberofchildren, fatherage, motherage, password, cpassword ) 
            VALUES ('${fdata.username}', '${fdata.email}', '${moment(selectedDate).format('YYYY-MM-DD')}', '${fdata.height}', '${fdata.numberofchildren}', '${fdata.fatherage}', '${fdata.motherage}', '${fdata.password}', '${fdata.cpassword}' )`;
            txn.executeSql(sql, [], ( _, results) => {
                console.log(`Hello I am here ${results}`);
                console.log(fdata.username);
                firestore()
                .collection('Users')
                .doc(fdata.username)
                .set({
                  name: fdata.username,
                  email: fdata.email,
                  numsTogen: 1,
                  min: 0,
                  max: 100,
                })
                .then(() => {
                  console.log('User added!');
                });
                // firestore()
                //   .collection('Users')
                //   .doc('ABC')
                //   .set({
                //     name: 'Ada Lovelace',
                //     age: 30,
                //   })
                //   .then(() => {
                //     console.log('User added!');
                //   });
                Dialog.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Success',
                  textBody: `Account created sucessfully`,
                  button: 'Got it!',
                  onPressButton: () =>{
                    navigation.navigate('Login');
                  }
                });
            },
                (error) => {
                console.log("execute error: " + JSON.stringify(error))
                reject(error);
            });
          });
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Warning',
            textBody: 'Such account already exists',
          });
          return;
        }
      }
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={wrapper}>
      <View style={styles.container1}>
        <Image source={logo} style={styles.logo}  resizeMode='stretch'/>
        <Image source={mark} style={styles.mark}  resizeMode='contain'/>
      </View>
     
      <View style={styles.container2}>
        <View style={styles.headingContainer}>
            
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: '#FFFFFF', fontSize: 16}}>
                Already Registered?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text style={{color: '#FFFFFF', fontSize: 16, borderColor: '#FFFFFF', borderBottomWidth: 1}}>
                  Login Here
                </Text>
              </TouchableOpacity>
            </View>
            
        </View>
        <ScrollView style= {styles.formContainer}>
          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, username: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='Username'></TextInput>
          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, email: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='Email'></TextInput>
          <View style={styles.textInput}>
            <TouchableOpacity onPress={showDatePicker}>
              {/* <View >
                <Text style={{paddingLeft: 15, color:'#286D1D', fontWeight:'bold'}}>...</Text>
              </View> */}
              <Text style={{
              paddingVertical:10,
              fontSize: 18,
              lineHeight: 32,
              borderRadius: 30,
              color: '#286D1D',
              backgroundColor: 'white',
              zIndex: -1,}}>{selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'}</Text>
            </TouchableOpacity>
          </View>
          
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, height: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='Height'></TextInput>
          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, numberofchildren: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='NumberOfChild'></TextInput>
          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, fatherage: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='FatherAge'></TextInput>
              
          <TextInput
              style={styles.textInput}
              onChangeText={text => setFdata({...fdata, motherage: text})}
              onPressIn={() => setErrorMsg(null)}
              placeholder='MotherAge'></TextInput>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={text => setFdata({...fdata, password: text})}
            onPressIn={() => setErrorMsg(null)}
            placeholder='Password'></TextInput>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={text => setFdata({...fdata, cpassword: text})}
            onPressIn={() => setErrorMsg(null)}
            placeholder='Confirm Password'></TextInput>

          <TouchableOpacity onPress={sendToBackend} style={{alignSelf: 'center'}}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>SignUp</Text>
              </View>
          </TouchableOpacity>
        </ScrollView>
        
      </View>
      
    </View>
    </AlertNotificationRoot>

    
  );
};

export default SignUp;

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
    borderWidth: 1,
    borderBottomColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    backgroundColor: 'rgba(40, 109, 30, 0.90)',
  },
  headingContainer: {
    marginTop: '5%',
  },
  formContainer: {
    marginTop: '5%',
    marginVertical: 10,
    marginHorizontal: 20,
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
  datePickerBox:{
    marginTop: 9,
    borderColor: '#ABABAB',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent:'center'
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#121212',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%'
  },
});
