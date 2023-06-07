// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

import React, {useEffect} from 'react';
import '@walletconnect/react-native-compat';
import {decode, encode} from '@stablelib/hex';
import {randomBytes} from '@stablelib/random';
import {generateKeyPairFromSeed, sign} from './src/lib/ed25519';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/Settings';
import Crypto from 'react-native-quick-crypto';
import useInitialization from './src/hooks/useInitialization';
import useWalletConnectEventsManager from './src/hooks/useWalletConnectEventsManager';
// Required for TextEncoding Issue
const TextEncodingPolyfill = require('text-encoding');
// @ts-ignore
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = Crypto;
}

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const Stack = createNativeStackNavigator();

const App = () => {
  const initialized = useInitialization();
  useWalletConnectEventsManager(initialized);

  useEffect(() => {
    async function test() {
      try {
        const randomSeed = randomBytes(32);
        const {publicKey, secretKey: privateKey} =
          generateKeyPairFromSeed(randomSeed);
        const privKeyHex = encode(privateKey.subarray(0, 32), true);

        const signature = sign(
          decode(privKeyHex),
          new TextEncoder().encode(encode(publicKey)),
        );
        console.log(signature);
      } catch (error) {
        console.log(error);
      }
    }
    test();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{headerShown: true, headerTitle: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// import React, {useEffect, useState} from 'react';
// import '@walletconnect/react-native-compat';
// import type {PropsWithChildren} from 'react';
// import notifee, {AndroidVisibility} from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
// import useInitialization from './src/hooks/useInitialization';
// import {pushClient} from './src/utils/Clients';

// // Required for TextEncoding Issue
// const TextEncodingPolyfill = require('text-encoding');
// const BigInt = require('big-integer');

// Object.assign(global, {
//   TextEncoder: TextEncodingPolyfill.TextEncoder,
//   TextDecoder: TextEncodingPolyfill.TextDecoder,
//   BigInt: BigInt,
// });

// type SectionProps = PropsWithChildren<{
//   title: string;
//   body: string;
// }>;

// function Section({body, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {body}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   const initialized = useInitialization();
//   const [notifications, setNotifications] = useState<
//     | {
//         title: string;
//         body: string;
//       }[]
//   >([]);

//   useEffect(() => {
//     console.log('App Initalized: ', initialized);
//     async function getToken() {
//       const fcmToken = await messaging().getToken();
//       if (fcmToken) {
//         console.log({fcmToken});
//       }
//     }
//     getToken();
//   }, [initialized]);

//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//     const topic = remoteMessage.data?.topic;
//     const blob = remoteMessage.data?.blob;
//     console.log({topic, blob});
//     if (topic && blob) {
//       const decryptedMsg = await pushClient.decryptMessage({
//         topic,
//         encryptedMessage: blob,
//       });
//       console.log({decryptedMsg});
//     }
//     if (remoteMessage.notification?.title && remoteMessage.notification?.body) {
//       setNotifications([
//         ...notifications,
//         {
//           title: remoteMessage.notification?.title,
//           body: remoteMessage.notification?.body,
//         },
//       ]);
//     }
//     // Request permissions (required for iOS)
//     await notifee.requestPermission();

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: remoteMessage.notification?.title,
//       body: remoteMessage.notification?.body,
//       android: {
//         visibility: AndroidVisibility.PUBLIC,
//         channelId,
//         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
//         // pressAction is needed if you want the notification to open the app when pressed
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   });

//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Message handled in the foreground!', remoteMessage);
//       const topic = remoteMessage.data?.topic;
//       const blob = remoteMessage.data?.blob;
//       console.log({topic, blob});
//       const topics = pushClient.getActiveSubscriptions();
//       console.log({topics});
//       if (topic && blob) {
//         const encryptedMsg = await pushClient.core.crypto.encode(
//           '7521d77197d1ab085d54c7c77c6fe6c3cae878f3d7905125bdfe16fa3dd5423b',
//           {
//             id: 1,
//             params: {
//               address: '0xTest',
//             },
//             method: 'get_test',
//             jsonrpc: 'test',
//             result: 'success',
//           },
//         );
//         console.log({encryptedMsg});
//       }
//       if (
//         remoteMessage.notification?.title &&
//         remoteMessage.notification?.body
//       ) {
//         setNotifications([
//           ...notifications,
//           {
//             title: remoteMessage.notification?.title,
//             body: remoteMessage.notification?.body,
//           },
//         ]);
//       }
//     });

//     return unsubscribe;
//   }, [notifications]);

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           {notifications.map(notif => (
//             <Section title={notif.title} body={notif.body} />
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
