import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';

import {SignClientTypes} from '@walletconnect/types';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SessionTypes} from '@walletconnect/types';
import {currentETHAddress, pushClient, web3wallet} from '../utils/Clients';

import {PairModal} from '../components/Modals/PairModal';

import {SignModal} from '../components/Modals/SignModal';
import Sessions from '../components/HomeScreen/Sessions';
import ActionButtons from '../components/HomeScreen/ActionButtons';
import {useNavigation} from '@react-navigation/native';
import {EIP155_SIGNING_METHODS} from '../data/EIP155';
import {SignTypedDataModal} from '../components/Modals/SignTypedDataModal';
import {SendTransactionModal} from '../components/Modals/SendTransactionModal';
import {W3WText} from '../components/W3WText';
import {TextContent} from '../utils/Text';
import {CopyWCURIModal} from '../components/Modals/CopyWCURIModal';
import {useSnapshot} from 'valtio';
import ModalStore from '../store/ModalStore';
import {PushModal} from '../components/Modals/PushRequestModal';
import {PushClientTypes} from '@walletconnect/push-client';

/**
  @notice: HomeScreen for Web3Wallet Example
  @dev: Placed the async functions on this page for simplicity

  Async Functions:
  1) handleAccept(): To handle the initial connection proposal accept event
  2) handleCancel(): For the CopyWCURIModal Cancel.
  3) pair(): To handle the initial connection reject event
  4) onSessionProposal: To handle the initial pairing proposal event
  5) onSessionRequest: To handle the session request event (i.e. eth_sign, eth_signTypedData, eth_sendTransaction)

**/

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const {open, view, data} = useSnapshot(ModalStore.state);

  // Modal Visible State
  const [approvalModal, setApprovalModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [pushModal, setPushModal] = useState(false);
  const [signTypedDataModal, setSignTypedDataModal] = useState(false);
  const [sendTransactionModal, setSendTransactionModal] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);
  const [successPair, setSuccessPair] = useState(false);

  // Pairing State
  const [pairedProposal, setPairedProposal] = useState();
  const [WCURI, setWCUri] = useState<string>();
  const [requestEventData, setRequestEventData] = useState();
  const [requestSession, setRequestSession] = useState();
  const [pushRequest, setPushRequest] =
    useState<PushClientTypes.EventArguments['push_request']>();

  // To Revist on Dark Mode Sprint
  const backgroundStyle = {
    flex: 1,
    padding: 16,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    console.log('ACTIVE SUBS', pushClient.getActiveSubscriptions());
  }, []);

  async function handleAccept() {
    const {id, params} = pairedProposal;
    const {requiredNamespaces, relays} = params;

    if (pairedProposal) {
      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach(key => {
        const accounts: string[] = [];
        requiredNamespaces[key].chains.map(chain => {
          [currentETHAddress].map(acc => accounts.push(`${chain}:${acc}`));
        });

        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        };
      });

      await web3wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });

      setApprovalModal(false);
      setSuccessPair(true);
    }
  }

  const handleCancel = () => {
    setCopyDialog(false);
  };

  const pair = useCallback(async () => {
    console.log('PAIR');
    if (WCURI) {
      console.log({pairing: WCURI});
      const pairing = await web3wallet.core.pairing.pair({uri: WCURI});
      console.log({paired: WCURI});
      setCopyDialog(false);
      if (Platform.OS === 'android') {
        setApprovalModal(true);
      }
      return pairing;
    }
  }, [WCURI]);

  // ToDo / Consider: How best to move onSessionProposal() + onSessionRequest() + the if statement Listeners.
  // Know there is an events config we did in web-examples app
  const onSessionProposal = (
    proposal: SignClientTypes.EventArguments['session_proposal'],
  ) => {
    console.log('onSessionProposal', proposal);
    if (proposal) {
      setPairedProposal(proposal);
    }
  };

  const onSessionRequest = async (
    requestEvent: SignClientTypes.EventArguments['session_request'],
  ) => {
    console.log('onSessionRequest', requestEvent);
    const {topic, params} = requestEvent;
    const {request} = params;
    const requestSessionData = web3wallet.engine.signClient.session.get(topic);

    switch (request.method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        setSignModal(true);
        return;

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        setSignTypedDataModal(true);
        return;
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        setSendTransactionModal(true);
        return;
    }
  };

  useEffect(() => {
    if (web3wallet) {
      web3wallet.on('session_proposal', onSessionProposal);
      web3wallet.on('session_request', onSessionRequest);
    }
  }, []);
  useEffect(() => {
    if (pushClient) {
      pushClient.on('push_request', async ({id, topic, params}) => {
        setPushModal(true);
        console.log('push_request', {id, topic, params});
        setPushRequest({id, topic, params});
        // ModalStore.open('PushRequest', {
        //   pushRequest: {
        //     id,
        //     topic,
        //     params,
        //   },
        // });
      });
    }
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <PairModal
        proposal={pairedProposal}
        open={setApprovalModal}
        visible={approvalModal}
        handleAccept={handleAccept}
      />

      <CopyWCURIModal
        pair={pair}
        WCURI={WCURI}
        setVisible={handleCancel}
        copyDialog={copyDialog}
        setApprovalModal={setApprovalModal}
        setWCUri={setWCUri}
        pairedProposal={pairedProposal}
        approvalModal={approvalModal}
      />

      {requestEventData && requestSession && signModal && (
        <SignModal
          visible={signModal}
          setVisible={setSignModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
        />
      )}
      {pushRequest && pushModal && (
        <PushModal
          visible={pushModal}
          setVisible={setPushModal}
          pushRequest={pushRequest}
        />
      )}

      {requestEventData && requestSession && sendTransactionModal && (
        <SendTransactionModal
          visible={sendTransactionModal}
          setVisible={setSendTransactionModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
        />
      )}

      {requestEventData && requestSession && signTypedDataModal && (
        <SignTypedDataModal
          visible={signTypedDataModal}
          setVisible={setSignTypedDataModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
        />
      )}

      <View style={styles.mainScreenContainer}>
        <View style={styles.flexRow}>
          <W3WText value={TextContent.AppsTitle} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image
              source={require('../assets/SettingsIcon.png')}
              style={styles.imageContainer}
            />
          </TouchableOpacity>
        </View>
        <Sessions />
        <ActionButtons setCopyDialog={setCopyDialog} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  greyText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#798686',
    width: '80%',
    textAlign: 'center',
  },
  mainScreenContainer: {
    padding: 20,
    flex: 1,
  },
  imageContainer: {
    height: 24,
    width: 24,
  },
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
