/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Notifications} from 'react-native-notifications';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import '@walletconnect/react-native-compat';
import useInitialization from './hooks/useInitialization';

// Required for TextEncoding Issue
const TextEncodingPolyfill = require('text-encoding');
const BigInt = require('big-integer');

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
  BigInt: BigInt,
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // SignClient Setup
  const initialized = useInitialization();

  useEffect(() => {
    console.log('App Initalized: ', initialized);
  }, [initialized]);

  useEffect(() => {
    Notifications.events().registerRemoteNotificationsRegistered(
      (event: any) => {
        console.log('Device Token Received', event.deviceToken);
      },
    );

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event: any) => {
        console.error(event);
      },
    );

    Notifications.events().registerNotificationReceivedForeground(
      (notification: any, completion: any) => {
        console.log(
          'Notification received in foreground',
          notification.payload,
        );
        completion({alert: false, sound: false, badge: false});
      },
    );

    Notifications.events().registerNotificationReceivedBackground(
      (notification: any, completion: any) => {
        console.log(
          'Notification received in background',
          notification.payload,
        );
        completion({alert: true, sound: true, badge: false});
      },
    );

    Notifications.events().registerNotificationOpened(
      (notification: any, completion: any) => {
        console.log('Notification opened by device user', notification.payload);
        completion();
      },
    );

    Notifications.registerRemoteNotifications();
    console.log('[DEBUG] registerRemoteNotifications - SUCCESS');
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            onPress={() => console.log('Is initialized: ', initialized)}
            title="Check Sign Client Initialization"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
