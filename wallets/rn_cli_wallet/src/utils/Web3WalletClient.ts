import {Core} from '@walletconnect/core';
import {ICore} from '@walletconnect/types';
import {Web3Wallet, IWeb3Wallet} from '@walletconnect/web3wallet';
import {WalletClient as PushWalletClient} from '@walletconnect/push-client';

export let web3wallet: IWeb3Wallet;
export let core: ICore;
export let currentETHAddress: string;
export let pushWalletClient: any;

// @ts-expect-error - env is a virtualised module via Babel config.
import {ENV_PROJECT_ID, ENV_RELAY_URL} from '@env';
import {createOrRestoreEIP155Wallet} from './EIP155Wallet';

export async function createWeb3Wallet() {
  // console.log('ENV_PROJECT_ID', ENV_PROJECT_ID);
  // console.log('ENV_RELAY_URL', ENV_RELAY_URL);
  core = new Core({
    // @notice: If you want the debugger / logs
    // logger: 'debug',
    projectId: ENV_PROJECT_ID,
    relayUrl: ENV_RELAY_URL,
  });

  const {eip155Addresses} = await createOrRestoreEIP155Wallet();
  currentETHAddress = eip155Addresses[0];

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'React Native PUSH Web3Wallet',
      description: 'ReactNative Web3Wallet',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  });

  pushWalletClient = await PushWalletClient.init({
    core, // <- pass the shared `core` instance

    //@ts-ignore (Not sure why types are wrong...)
    metadata: {
      name: 'My Push-Enabled Wallet',
      description: 'A wallet using WalletConnect PushClient',
      url: 'https://my-wallet.com',
      icons: ['https://my-wallet.com/icons/logo.png'],
    },
  });
}

export async function _pair(params: {uri: string}) {
  return await core.pairing.pair({uri: params.uri});
}
