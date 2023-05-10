import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import {getWalletAddressFromParams} from '../../utils/HelperUtils';
import {AcceptRejectButton} from '../AcceptRejectButton';
import {ModalHeader} from '../Modal/ModalHeader';

import {pushClient} from '../../utils/Clients';
import {PushClientTypes} from '@walletconnect/push-client';
import {
  createOrRestoreEIP155Wallet,
  eip155Wallets,
} from '../../utils/EIP155Wallet';
import {Text} from 'react-native-svg';

interface PushModalProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  pushRequest: PushClientTypes.EventArguments['push_request'];
}

export function PushModal({visible, setVisible, pushRequest}: PushModalProps) {
  const {params, id} = pushRequest;
  console.log({params});
  console.log('THIS IS THE PUSH REQUEST MODAL');

  const onSign = useCallback(
    async (message: string) => {
      console.log({message});
      const {eip155Addresses} = await createOrRestoreEIP155Wallet();
      const wallet =
        eip155Wallets[
          getWalletAddressFromParams(eip155Addresses, params.account)
        ];
      const signature = await wallet.signMessage(message);
      return signature;
    },
    [params.account],
  );

  const onApprove = useCallback(async () => {
    if (pushRequest) {
      try {
        await pushClient.approve({id, onSign});
        console.log('APPROVED PUSH REQUEST');
      } catch (error) {
        console.log(error);
      } finally {
        setVisible(false);
      }
    }
  }, [pushRequest, setVisible, id, onSign]);

  const requestName = pushRequest?.params.metadata?.name;
  const requestIcon = pushRequest?.params.metadata?.icons[0];
  const requestURL = pushRequest?.params.metadata?.url;

  console.log({topic: pushRequest.topic});

  async function onReject() {
    if (pushClient) {
      await pushClient.reject({
        id,
        reason: 'User rejected push subscription request',
      });

      setVisible(false);
    }
  }

  return (
    <Modal backdropOpacity={0.6} isVisible={visible}>
      <View style={styles.modalContainer}>
        <ModalHeader name={requestName} url={requestURL} icon={requestIcon} />

        <View style={styles.divider} />

        <View style={styles.chainContainer}>
          <View style={styles.flexRowWrapped}>
            <Text>Subscribe to {params.metadata.url}</Text>
          </View>
          {/* <Methods methods={[method]} /> */}
        </View>

        <View style={styles.flexRow}>
          <AcceptRejectButton accept={false} onPress={() => onReject()} />
          <AcceptRejectButton accept={true} onPress={() => onApprove()} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chainContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(80, 80, 89, 0.1)',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    paddingTop: 30,
    backgroundColor: 'rgba(242, 242, 247, 0.9)',
    width: '100%',
    position: 'absolute',
    bottom: 44,
  },
  rejectButton: {
    color: 'red',
  },
  dappTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  imageContainer: {
    width: 48,
    height: 48,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16,
  },
});
