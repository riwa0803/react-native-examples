import {IDappClient, IWalletClient} from '@walletconnect/push-client';
import {generateRandomBytes32} from '@walletconnect/utils';
import {formatJsonRpcRequest} from '@walletconnect/jsonrpc-utils';
import {Notifications} from 'react-native-notifications';
import {pushWalletClient} from './Web3WalletClient';
import Core from '@walletconnect/core';
// import {WalletClient as PushWalletClient} from '@walletconnect/push-client';
import BackgroundFetch from 'react-native-background-fetch';

export const testPushNotification = async (topic, message) => {
  console.log('message', message);
  // console.log('topic', topic);
  const messageText = message?.params.message.body;
  const payload = formatJsonRpcRequest('wc_pushMessage', messageText);
  console.log('testPushNotification payload...', payload);
  return;
  const encryptedMessage = pushWalletClient.core.crypto.encode(topic, payload);
  console.log('testPushNotification encryptedMessage...', encryptedMessage);
  return;

  const decryptedMessage = await pushWalletClient?.decryptMessage({
    topic,
    message,
  });
  console.log('testPushNotification decryptedMessage', decryptedMessage);

  Notifications.postLocalNotification({
    body: 'Local notification!',
    title: 'Test Notification',
    sound: 'chime.aiff',
    silent: false,
    category: 'SOME_CATEGORY',
    userInfo: {},
    // fireDate: new Date(),
  });
};
