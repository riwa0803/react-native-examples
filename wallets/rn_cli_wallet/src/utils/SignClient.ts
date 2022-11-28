import SignClient from '@walletconnect/sign-client';

export let signClient: SignClient;

export async function createSignClient() {
  signClient = await SignClient.init({
    logger: 'debug',
    projectId: '...', // Insert your project ID here
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'React Native Wallet',
      description: 'React Native Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  });
}
