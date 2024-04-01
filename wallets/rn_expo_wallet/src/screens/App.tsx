import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, Linking } from 'react-native';
import '@walletconnect/react-native-compat';
import SignClient from '@walletconnect/sign-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-expect-error - `@env` is a virtualised module via Babel config.
import { ENV_PROJECT_ID, ENV_RELAY_URL } from '@env';

export default function App() {
  const [signClient, setSignClient] = useState<SignClient>();
  const [session, setSession] = useState<any>(null);
  const [dappName, setDappName] = useState('');
  const [dappDescription, setDappDescription] = useState('');
  const [dappUrl, setDappUrl] = useState('');
  const [dappIcons, setDappIcons] = useState([]);

  async function createClient() {
    try {
      const client = await SignClient.init({
        projectId: ENV_PROJECT_ID,
        relayUrl: ENV_RELAY_URL,
        metadata: {
          name: 'rn-wallet',
          description: 'Wallet Description',
          url: 'rn-expo-wallet://',
          icons: ['https://example.com/icon.png'],
          redirect: {
            native: 'rn-expo-wallet://'
          }}
        });
      setSignClient(client);
      await subscribeToEvents(client);
    } catch (e) {
      console.log(e);
    }
  }

  async function subscribeToEvents(client: SignClient) {
    if (!client) {
      throw Error('No events to subscribe to b/c the client does not exist');
    }
    try {
      client.on('session_proposal', async (proposal) => {
        const { id, params } = proposal;
        const { metadata } = params.proposer;

        const dappName = metadata.name;
        const dappDescription = metadata.description;
        const dappUrl = metadata.url;
        const dappIcons = metadata.icons;

        await saveDappMetadata(dappName, dappDescription, dappUrl, dappIcons);
        updateHomeScreen();

        // ウォレットアプリでセッションを承認する処理を追加
        const approveProposal = true;
        const session = await client.approve({ id, approveProposal });
        setSession(session);
      });

      client.on('session_request', async (request) => {
        // リクエストに応答する処理を追加
        const response = {
          state: { accounts: [] },
        };
        await client.respond({ topic: request.topic, response });
        const redirect = client.session.get(request.topic)?.peer.metadata.redirect;
        if (redirect) {
          Linking.openURL(redirect);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  const saveDappMetadata = async (
    dappName: string,
    dappDescription: string,
    dappUrl: string,
    dappIcons: string[]
  ) => {
    try {
      await AsyncStorage.setItem('dappName', dappName);
      await AsyncStorage.setItem('dappDescription', dappDescription);
      await AsyncStorage.setItem('dappUrl', dappUrl);
      await AsyncStorage.setItem('dappIcons', JSON.stringify(dappIcons));
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  };

  const updateHomeScreen = async () => {
    try {
      const dappName = await AsyncStorage.getItem('dappName');
      const dappDescription = await AsyncStorage.getItem('dappDescription');
      const dappUrl = await AsyncStorage.getItem('dappUrl');
      const dappIcons = await AsyncStorage.getItem('dappIcons');

      setDappName(dappName);
      setDappDescription(dappDescription);
      setDappUrl(dappUrl);
      setDappIcons(JSON.parse(dappIcons));
    } catch (error) {
      console.error('Error retrieving metadata:', error);
    }
  };

  const handleDisconnect = async () => {
    if (session) {
      await signClient.disconnect({
        topic: session.topic,
        reason: { code: 6000, message: 'User disconnected' },
      });
      setSession(null);
    }
  };

  useEffect(() => {
    createClient();
  }, []);

  return (
    <View style={styles.container}>
      <Text>WalletConnect</Text>
      <Text>Sign V2 Expo Examples</Text>
      <Text>SignClient Initialized: {signClient ? 'true' : 'false'} </Text>
      {session ? (
        <>
          <Text>Dapp Name: {dappName}</Text>
          <Text>Description: {dappDescription}</Text>
          <Text>URL: {dappUrl}</Text>
          {dappIcons.map((icon, index) => (
            <Image key={index} source={{ uri: icon }} style={styles.icon} />
          ))}
          <Button title="Disconnect" onPress={handleDisconnect} />
        </>
      ) : (
        <Text>No active session</Text>
      )}
    </View>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    margin: 5,
  },
});