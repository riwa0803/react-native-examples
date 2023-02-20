import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import {InitialExplorerContent} from './InitialExplorerContent';
import {ViewAllExplorerContent} from './ViewAllExplorerContent';

//@ts-expect-error - `@env` is a virtualised module via Babel config.
import {fetchInitialWallets, fetchViewAllWallets} from '../utils/ExplorerUtils';
import {ExplorerModalHeader} from './ExplorerModalHeader';

const MODAL_HEIGHT = Dimensions.get('window').height * 0.7;
const DEVICE_WIDTH = Dimensions.get('window').width;

interface ExplorerModalProps {
  modalVisible: boolean;
  // viewAllContentVisible: boolean;
  close: () => void;
}

// Populate with the data...
export function ExplorerModal({modalVisible, close}: ExplorerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isViewAllLoading, setViewAllLoading] = useState(true);

  const [viewAllContentVisible, setViewAllContentVisible] = useState(false);
  const [explorerData, setExplorerData] = useState([]);
  const [viewAllExplorerData, setViewAllExplorerData] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';

  const loading = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  const loadingViewAll = (loadingState: boolean) => {
    setViewAllLoading(loadingState);
  };

  const fetchExplorerData = (data: any) => {
    setExplorerData(data);
  };

  const fetchViewAllExplorerData = (data: any) => {
    setViewAllExplorerData(data);
  };

  const fetchWallets = useCallback(() => {
    fetchInitialWallets(loading, fetchExplorerData);
    fetchViewAllWallets(loadingViewAll, fetchViewAllExplorerData);
  }, []);

  useEffect(() => {
    if (!explorerData.length) {
      fetchWallets();
    }
    console.log('ed', explorerData?.length);
  }, [explorerData, fetchWallets, isLoading]);

  return (
    <Modal
      style={styles.wcContainer}
      // deviceWidth={deviceWidth}
      isVisible={modalVisible}
      onModalHide={() => setViewAllContentVisible(false)}
      useNativeDriver>
      <View style={styles.wcContainer}>
        <ExplorerModalHeader close={close} />
        <View
          style={
            isDarkMode
              ? styles.connectWalletContainer
              : styles.connectWalletContainerLight
          }>
          {!viewAllContentVisible ? (
            <InitialExplorerContent
              isLoading={isLoading}
              explorerData={explorerData}
              setViewAllContentVisible={setViewAllContentVisible}
            />
          ) : (
            <ViewAllExplorerContent
              explorerData={viewAllExplorerData}
              setViewAllContentVisible={setViewAllContentVisible}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wcContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: -10,
    maxHeight: MODAL_HEIGHT,
    width: DEVICE_WIDTH,
    backgroundColor: '#0D7DF2',
    // borderWidth: 1,
    // borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flexRow: {
    paddingVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  wcContainerText: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
  },
  connectWalletContainer: {
    height: '100%',
    display: 'flex',
    // paddingBottom: 24,
    width: '100%',
    backgroundColor: '#141414',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  connectWalletContainerLight: {
    height: '100%',
    display: 'flex',
    // paddingBottom: 24,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: 'white',
    fontSize: 20,
    lineHeight: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  chevronImage: {
    width: 8,
    height: 18,
  },
  closeContainer: {
    height: 28,
    width: 28,
    backgroundColor: '#141414',
    borderRadius: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeContainerLight: {
    height: 28,
    width: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
