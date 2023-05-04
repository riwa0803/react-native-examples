import {PushClientTypes} from '@walletconnect/push-client/dist/types/types';
import {SignClientTypes} from '@walletconnect/types';
import {useCallback, useEffect} from 'react';
import {EIP155_SIGNING_METHODS} from '../data/EIP155';
import ModalStore from '../store/ModalStore';
import {pushClient, web3wallet} from '../utils/Clients';

export default function useWalletConnectEventsManager(initialized: boolean) {
  /******************************************************************************
   * Sign SDK Event Handlers
   *****************************************************************************/
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      ModalStore.open('SessionProposalModal', {proposal});
    },
    [],
  );

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      console.log('session_request', requestEvent);
      const {topic, params} = requestEvent;
      const {request} = params;
      const requestSession = web3wallet.engine.signClient.session.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return ModalStore.open('SessionSignModal', {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return ModalStore.open('SessionSignTypedDataModal', {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return ModalStore.open('SessionSendTransactionModal', {
            requestEvent,
            requestSession,
          });

        default:
          return ModalStore.open('SessionUnsuportedMethodModal', {
            requestEvent,
            requestSession,
          });
      }
    },
    [],
  );

  /******************************************************************************
   * Push SDK Event Handlers
   *****************************************************************************/

  const onPushRequest = useCallback(
    (pushRequestEvent: PushClientTypes.EventArguments['push_request']) => {
      // Avoid edge case race condition between Sign approve modal close action and open action here.
      setTimeout(() => {
        ModalStore.open('PushSubscriptionRequestModal', {pushRequestEvent});
      }, 500);
    },
    [],
  );

  /******************************************************************************
   * Set up event listeners
   *****************************************************************************/
  useEffect(() => {
    if (initialized) {
      web3wallet.on('session_proposal', onSessionProposal);
      web3wallet.on('session_request', onSessionRequest);
    }
  }, [initialized, onSessionProposal, onSessionRequest]);

  useEffect(() => {
    if (initialized) {
      // Listen for relevant push events
      pushClient.on('push_request', event => {
        console.log(
          '[PUSH DEMO] Got push subscription request with id: ' + event.id,
          event,
        );
        onPushRequest(event);
      });
      pushClient.on('push_message', async event => {
        console.log('[PUSH DEMO] Received push message event: ', event);
        const {
          params: {message},
        } = event;
        // Alert.alert(message.title, message.body);
      });
    }
  }, [initialized, onPushRequest]);
}
