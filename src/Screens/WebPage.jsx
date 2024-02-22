// /* eslint-disable no-alert */
// /* eslint-disable react-native/no-inline-styles */
// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
//   Button,
// } from 'react-native';
// import {requestOneTimePayment} from 'react-native-paypal';

// const WebPage = ({navigation, route}) => {
//   const checkout = async () => {
//     fetch('https://luckynumber.onrender.com/getClientToken', {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'content-type': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then(async (responseJson) => {

//         console.log('Here -------->');
//         const {token} = responseJson;
//         const {
//           nonce,
//           payerId,
//           email,
//           firstName,
//           lastName,
//           phone,
//         } = await requestOneTimePayment(token, {
//           amount: '5', // required
//           // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
//           currency: 'USD',
//           // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
//           localeCode: 'en_US',
//           shippingAddressRequired: false,
//           userAction: 'commit', // display 'Pay Now' on the PayPal review page
//           // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
//           intent: 'authorize',
//         });
//         console.log(nonce, payerId, email, firstName, lastName, phone);
//         console.log(token);
//         alert('Transaction Successful');
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}
//           contentContainerStyle={{
//             width: '100%',
//             height: '100%',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Button
//             title="Checkout"
//             onPress={() => {
//               checkout();
//             }}
//           />
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: 'white',
//   },
// });

// export default WebPage;

import React, {useState, useEffect} from 'react';
// import Video from 'react-native-video';
import {SafeAreaView, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const WebPage = ({navigation, route}) => {
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <WebView
        androidHardwareAccelerationDisabled={false}
        source={{
          uri: route.params.url,
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#111923',
  },
});

export default WebPage;
