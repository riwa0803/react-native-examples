import {useCallback, useEffect, useState} from 'react';
import {createPushClient, createWeb3Wallet} from '../utils/Clients';

export default function useInitialization() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      console.log('Init Web3 Wallet');
      await createWeb3Wallet();
      console.log('Inited Web3 Wallet');
      await createPushClient();

      setInitialized(true);
    } catch (err: unknown) {
      console.log('Error for initializing', err);
    }
  }, []);

  useEffect(() => {
    console.log({initialized});
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}
