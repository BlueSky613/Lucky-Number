import {
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Welcome from './src/Screens/Welcome';
import Login from './src/Screens/Login';
import SignUp from './src/Screens/SignUp';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Screens/Home';
import Settings from './src/Screens/Settings';
import Splash from './src/Screens/Splash';
import Payment from './src/Screens/Payment';
import Log from './src/Screens/Log';
import WebPage from './src/Screens/WebPage';
// import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    setTimeout(() => {
      _checkPermission();
    }, 1000);
  }, []);

  const _checkPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted) {
      console.log('You can use the POST_NOTIFICATIONS');
    } else {
      console.log('POST_NOTIFICATIONS permission denied');
    }
  };

  const saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = auth().currentUser.uid;
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  };
  const getRegistrationToken =  () => {

     // Get the device token
     messaging()
     .getToken()
     .then(token => {
       console.log('onGetToken --> ',token);
       return saveTokenToDatabase(token);
     });
    messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      // console.log('onTokenRefreshed --> ', fcmToken);
      saveTokenToDatabase(fcmToken);
    });
  };

  messaging().setBackgroundMessageHandler(async(remoteMessage) => {
    console.log('onSetBackgroundMessage is Triggered.');
    setInitialRoute('Login');
  })

  useEffect(() => {
    
    getRegistrationToken();

    // messaging().onNotificationOpenedApp(async remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    //   // setInitialRoute('Login');
    // });
  }, []);

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = '{ "apiuser": "elite390497@gmail.com",    "password" : "Elite390497!@#$"}';

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  var access_token = "";
  fetch('https://app.tilopay.com/api/v1/login', requestOptions)
    .then(response => response.json())
    .then((result) => {
      access_token = result.access_token;
      // console.log("Return value from Tilopay --> ",access_token);
    })
    .catch(error => console.log('Tilopay error', error));


    // myHeaders = new Headers();
    // myHeaders.append('Authorization', access_token);
    // myHeaders.append('Accept', 'application/json');
    // myHeaders.append('Content-Type', 'application/json');
    
    // var raw =
    //   '{\r\n "redirect" : "https://www.urlToRedirect.com",\r\n    "key": "zvDKx7",\r\n    "amount": "1.00",\r\n    "currency": "USD",\r\n    "billToFirstName": "JERMAINE ANTONIO",\r\n    "billToLastName": "WRIGHT ANDERSON",\r\n    "billToAddress": "San Isidro del general",\r\n    "billToAddress2": "",\r\n    "billToCity": "Pérez Zeledón",\r\n    "billToState": "San Jose",\r\n    "billToZipPostCode": "",\r\n    "billToCountry": "CR",\r\n    "billToTelephone": "50664483835",\r\n    "billToEmail": "jwrightcr@gmail.com",\r\n    "orderNumber": "1212122",\r\n	"capture": "1",\r\n	"subscription": "0",\r\n    "platform": "api",\r\n    "returnData" : "dXNlcl9pZD0xMg==",\r\n    "hashVersion" : "V1"\r\n}';
    
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow',
    // };
    
    // fetch('https://app.tilopay.com/api/v1/processPayment', requestOptions)
    //   .then(response => response.json())
    //   .then(result => console.log('ProcessPayment result -->',result))
    //   .catch(error => console.log('error', error));

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeAreaView}>
        <Stack.Navigator
          initialRouteName= {initialRoute}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Log" component={Log} />
          <Stack.Screen name="WebPage" component={WebPage} />
        </Stack.Navigator>   
      </SafeAreaView>
    </NavigationContainer>
  );
};
export default App;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'black',
  },
});
