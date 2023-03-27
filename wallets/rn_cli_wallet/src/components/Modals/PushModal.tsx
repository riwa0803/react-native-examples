import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {SignClientTypes} from '@walletconnect/types';
import {Tag} from '../Tag';
import {Methods} from '../Modal/Methods';
import {Message} from '../Modal/Message';
import {getSignParamsMessage} from '../../utils/HelperUtils';
import {AcceptRejectButton} from '../AcceptRejectButton';
import {ModalHeader} from '../Modal/ModalHeader';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '../../utils/EIP155Request';
import {pushWalletClient, web3wallet} from '../../utils/Web3WalletClient';

interface PushModalProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  pushRequest: any;
  handleAccept?: () => void;
}

export function PushModal({
  visible,
  setVisible,
  pushRequest,
  handleAccept,
}: PushModalProps) {
  // const {id, topic, params} = pushRequest;
  // const {metadata, account} = params;

  const pushId = pushRequest?.id;
  const pushTopic = pushRequest?.topic;
  const pushParams = pushRequest?.params;

  // console.log('pushId PushModal', pushId);
  // console.log('pushTopic PushModal', pushTopic);
  // console.log('pushParams PushModal', pushParams);
  // console.log('topic', topic);
  // console.log('params', params);

  async function onApprove() {
    if (pushRequest && pushId) {
      // const userAccepted = await showNotificationToUser(params.metadata);
      // if (userAccepted) {
      // console.log('onApprove pushId', pushId);
      await pushWalletClient.approve({pushId});
      // } else {
      // await pushWalletClient.reject({ id, reason: "User rejected push subscription request" });
      // }
      setVisible(false);
    }
  }

  // async function onReject() {
  //   if (requestEvent) {
  //     const response = rejectEIP155Request(requestEvent);
  //     await web3wallet.respondSessionRequest({
  //       topic,
  //       response,
  //     });
  //     setVisible(false);
  //   }
  // }

  return (
    <Modal backdropOpacity={0.6} isVisible={visible}>
      <View style={styles.modalContainer}>
        <ModalHeader
          name={pushParams?.metadata?.name}
          url={pushParams?.metadata?.url}
          icon={pushParams?.metadata?.icons[0]}
        />

        <View style={styles.divider} />

        <View style={styles.chainContainer}>
          <Message message={'dApp wants to connect for Push Notifications'} />
        </View>

        <View style={styles.flexRow}>
          <AcceptRejectButton
            accept={false}
            onPress={() => console.log('reject')}
          />
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
