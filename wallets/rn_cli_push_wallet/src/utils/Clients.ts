import {Core} from '@walletconnect/core';
import {WalletClient} from '@walletconnect/push-client';
import {IWeb3Wallet, Web3Wallet} from '@walletconnect/web3wallet';
import {createOrRestoreEIP155Wallet} from './EIP155Wallet';

export let web3wallet: IWeb3Wallet;
export let pushClient: WalletClient;
export let currentETHAddress: string;

const core = new Core({
  projectId: process.env.ENV_PROJECT_ID,
  relayUrl: process.env.ENV_RELAY_URL ?? 'wss://relay.walletconnect.com',
});

export async function createWeb3Wallet() {
  console.log('getting addresses');
  const {eip155Addresses} = await createOrRestoreEIP155Wallet();
  currentETHAddress = eip155Addresses[0];
  console.log('got addresses', currentETHAddress);

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'React Native Web3Wallet',
      description: 'ReactNative Web3Wallet',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  });
}

export async function _pair(params: {uri: string}) {
  return await core.pairing.pair({uri: params.uri});
}

export async function createPushClient() {
  pushClient = await WalletClient.init({
    core,
    projectId: process.env.ENV_PROJECT_ID,
    relayUrl: process.env.ENV_RELAY_URL,
    logger: 'debug',
  });
}
