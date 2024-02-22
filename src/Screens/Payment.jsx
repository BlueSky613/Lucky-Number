import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    Touchable,
    TouchableOpacity,
    View,
    ScrollView,
    Dimensions,
    Modal,
    Button,
    NativeModules
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import background from '../../assets/donate.jpg';
//   import wheel from '../../assets/wheel.png';
//   import visa from '../../assets/visa.png';
//   import smart from '../../assets/smart.png';
//   import amex from '../../assets/amex.png';
//   // import {bgImg} from '../common/background';
//   // import {logocss} from '../common/logo.js';
//   // import {btn, nbtn, nbtnText, btnText} from '../common/button';
//   import {flexRow} from '../common/FlexRow';
//   import SQLite from 'react-native-sqlite-storage'
// import {btnContainer, btn, btnText, nbtn, nbtnText} from '../common/button';


import homeicon from '../../assets/home_icon.png';
import setting from '../../assets/setting.png';
import purchase from '../../assets/purchase.png';
import log from '../../assets/log.png'
import {RadioButton} from 'react-native-radio-buttons-group';
import DialogInput from 'react-native-dialog-input';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import SelectDropDown from 'react-native-select-dropdown'
import {requestOneTimePayment} from 'react-native-paypal';

  const Payment = ({navigation, route}) => {
    const [amount, setAmount] = useState(0);
    const [selectedcard, setSelectedcard] = useState('VISA');
    const [cardnumber, setCardnumber] = useState('');
    const [access_token, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false)
    const [selectedcurrency, setselectedcurrency] =  useState('USD');

    const currencies = ["$", "\u20ac", "\u00a3" ,"\u20a1", "Q", "R$"]
    const currency = ["USD", "EUR", "GBP", "CRC", "GTQ", "BRL"]
    const width = Dimensions.get('window').width;
    

    const handleCardClick = CardId => {
      setSelectedcard(CardId);
    };
    useEffect(() => {
      getTilopayToken();
    }, []);

    const getTilopayToken = () => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = '{ "apiuser": "zvDKx7",    "password" : "6N1aqS"}';

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      
      fetch('https://app.tilopay.com/api/v1/login', requestOptions)
        .then(response => response.json())
        .then((result) => {
          setAccessToken(result.access_token);
        })
        .catch(error => console.log('Tilopay error', error));

    } 
    

    
    const start = () => {
        // fetch('https://luckynumber.onrender.com/getClientToken', {
        //   method: 'GET',
        //   headers: {
        //     Accept: 'application/json',
        //     'content-type': 'application/json',
        //   },
        // })
        //   .then((response) => response.json())
        //   .then(async (responseJson) => {
            
            
        //     const {token} = responseJson;
        //     console.log('Here -------->', token);
        //     const {
        //       nonce,
        //       payerId,
        //       email,
        //       firstName,
        //       lastName,
        //       phone,
        //     } = await requestOneTimePayment(token, {
        //       amount: '5', // required
        //       // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
        //       currency: 'USD',
        //       // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
        //       localeCode: 'en_US',
        //       shippingAddressRequired: false,
        //       userAction: 'commit', // display 'Pay Now' on the PayPal review page
        //       // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
        //       intent: 'authorize',
        //     });
        //     console.log(nonce, payerId, email, firstName, lastName, phone);
        //     console.log(token);
        //     console.log('Transaction Successful');
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        
        if(access_token == '' | amount == 0) {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Warning',
            textBody: 'Please detect the Donation Amount.',
          });
          return;
        }
        else {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "bearer "+access_token);
          myHeaders.append("Accept", "application/json");
          myHeaders.append("Content-Type", "application/json");
          let ordernumber = access_token.slice(-6);
          console.log("OrderNumber ----> ",ordernumber);
          var raw = JSON.stringify({
            "redirect": "https://admin.tilopay.com/",
            "key": "6613-2052-7034-4837-8899",
            "amount": amount,
            "currency": selectedcurrency,
            "billToFirstName": "JERMAINE ANTONIO",
            "billToLastName": "WRIGHT ANDERSON",
            "billToAddress": "San Isidro del general",
            "billToAddress2": "San Isidro del general",
            "billToCity": "Pérez Zeledón",
            "billToState": "CR-SJ",
            "billToZipPostCode": "11901",
            "billToCountry": "CR",
            "billToTelephone": "50664483835",
            "billToEmail": "jwrightcr@gmail.com",
            "orderNumber": ordernumber,
            "capture": "1",
            "subscription": "0",
            "platform": "api"
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("https://app.tilopay.com/api/v1/processPayment", requestOptions)
            .then(response => response.json())
            .then((result) => {
              console.log(result.url)
              navigation.navigate('WebPage',{user: route.params.user, url: result.url});
            })
            .catch(error => console.log('error', error));
        }
    }
    
    

    return (
      <AlertNotificationRoot>
        <View style={styles.wrapper}>
          <Image source={background} style={styles.bgImg} resizeMode={'cover'}/>
          
          
          <View style={styles.container1}>
            <View style = {styles.greeting}>
              <Text style={styles.Text}>THANK YOU </Text>
              <Text style={styles.Text}>FOR YOUR GENEROUS DONATION!</Text>  
            </View>
          <View style = {{flexDirection: 'row', alignItems:'center',alignSelf:'center'}}>
            {/* <Image source={wheel} style={{width: 75, height: 75}}/> */}
            
            <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        let number = parseFloat(text);
                        if(number) setAmount(number);
                        else setAmount(0);
                        console.log(number);
                    }
                }
            placeholder='0'></TextInput>
            <SelectDropDown
              data={currencies}
              onSelect={(selectedItem, index) => {
                setselectedcurrency(currency[index]);
                console.log(selectedItem, selectedcurrency)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
              defaultButtonText="Currency"
              dropdownStyle = {styles.input}
              buttonStyle = {styles.input}
              // renderDropdownIcon={}
            />
            {/* <Text style={styles.Text}>  =     {1*count} $</Text> */}
          </View>

          {/* <ScrollView
            horizontal={true}
            style={styles.horizontalstyle}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => handleCardClick('VISA')}
              style={[
                styles.button,
                selectedcard === 'VISA' && styles.selectedButton,
              ]}>
                <Image source={visa} style={{width:width, height: width*7/10, borderRadius: 20,}} resizeMode={'cover'}/>
                <RadioButton id="VISA" color='yellow' selected={selectedcard=='VISA'} containerStyle={{position:'absolute', right: 10, top: 15}}></RadioButton>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCardClick('SMART')}
              style={[
                styles.button,
                selectedcard === 'SMART' && styles.selectedButton,
              ]}>
                <Image source={smart} style={{width:width, height: width*7/10, borderRadius: 20,}} resizeMode={'cover'}/>
                <RadioButton id="VISA" color='yellow' selected={selectedcard=='SMART'} containerStyle={{position:'absolute', right: 10, top: 15}}></RadioButton>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCardClick('AMEX')}
              style={[
                styles.button,
                selectedcard === 'AMEX' && styles.selectedButton,
              ]}>
                <Image source={amex} style={{width:width, height: width*7/10, borderRadius: 20,}} resizeMode={'cover'}/>
                <RadioButton id="VISA" color='yellow' selected={selectedcard=='AMEX'} containerStyle={{position:'absolute', right: 10, top: 15}}></RadioButton>
            </TouchableOpacity>

            
          </ScrollView>
          <View style = {{flexDirection: 'column', alignItems:'center'}}>
            <TextInput
              style={styles.credentialInput}
              onChangeText={text => {
                  let number = parseFloat(text);
                  if(number) setCardnumber(number);
                  else setCardnumber('');
                  console.log(number);
                }
              }
              placeholder={selectedcard+' NUMBER'}></TextInput>
            <TextInput
              style={styles.credentialInput}
              onChangeText={text => {
                  let number = parseFloat(text);
                  if(number) setCardPass(number);
                  else setCardPass('');
                  console.log(number);
                }
              }
              // secureTextEntry ={true}
              placeholder='PASSWORD'></TextInput>
          </View> */}
          <TouchableOpacity onPress={() => {
            // getTilopayToken();
            start();
            }}
            >
            <View style={styles.btn}>
              <Text style={styles.btnText}>Donate</Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', width: '100%', marginTop: '20%'}}>
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
        </View>

          
        </View>
      </AlertNotificationRoot>
      
    );
  };
  
  export default Payment;
  
  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      backgroundColor: 'white',
      alignItems: 'center',
      flexDirection: 'column-reverse'
    },
    container1: {
      bottom: 0,
      height: '50%',
      // borderWidth: 10,
      borderColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    greeting: {
      alignItems: 'center',
      width: '90%',
      marginBottom: 10,
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
    input: {
      borderRadius: 30,
      borderBottomWidth: 1,
      backgroundColor: '#FFFFFF',
      fontSize: 18,
      margin: 10,
      paddingHorizontal: 20,
      width: '33%',
      alignSelf: 'center',
      color: '#286D1D'
    },
    credentialInput: {
      borderRadius: 30,
      borderBottomWidth: 1,
      backgroundColor: '#FFFFFF',
      fontSize: 18,
      margin: 5,
      paddingHorizontal: 20,
      width: 300,
      alignSelf: 'center',
      color: '#286D1D'
    },
    Text: {
      fontWeight: 'medium',
      fontSize: 24,
      marginBottom: 5,
      color: '#FFFFFF',
    },
    ModalText: {
      fontWeight: 'medium',
      margin: 10,
      fontSize: 24,
      color: '#FFFFFF'
    },
    horizontalstyle: {
      flex:1,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    selectedButton: {
      // backgroundColor: 'cyan', // Change the color as needed
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
    },
    modalContent: {
      backgroundColor: 'rgba(40, 108, 30, 0.9)',
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
    },
    modalbtn: {
      alignItems: 'center',
      margin: 20,
      padding: 15,
      width: 200,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      borderRadius: 30,
      backgroundColor: '#286D1D',
    },
    textInput: {
      height: 40,
      borderColor: 'white',
      borderWidth: 1,
      marginBottom: 10,
      width: 200,
      color: '#286D1D',
      backgroundColor:'white',
      borderRadius: 5,
      padding: 10,
    },
  });
  