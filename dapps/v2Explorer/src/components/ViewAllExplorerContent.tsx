import React, {useRef, useEffect} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  Dimensions,
  FlatList,
} from 'react-native';
import {ExplorerItem} from './ExplorerItem';

interface ViewAllExplorerContentProps {
  isLoading: boolean;
  explorerData: any;
  openViewAllContent: () => void;
  setViewAllContentVisible: (value: boolean) => void;
}

export const ViewAllExplorerContent = ({
  isLoading,
  explorerData,
  setViewAllContentVisible,
}: ViewAllExplorerContentProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{opacity: fadeAnim}}>
      {/* <View> */}
      <>
        <View style={styles.sectionBackContainer}>
          <TouchableOpacity
            style={styles.twentyWidth}
            onPress={() => setViewAllContentVisible(false)}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Image
              style={styles.chevronImage}
              source={require('../assets/Chevron.png')}
            />
          </TouchableOpacity>
          <View style={styles.sixtyWidth}>
            <Text
              style={
                isDarkMode ? styles.sectionTitle : styles.sectionTitleBlack
              }>
              Connect your wallet
            </Text>
          </View>
          <View style={styles.twentyWidth} />
        </View>

        {/* <FlatList
          data={explorerData}
          renderItem={({item}) => (
            <View style={{height: 100, width: 100, backgroundColor: 'red'}}>
              <Text> {item.name}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        > */}
        <ScrollView
          scrollEnabled={true}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scrollExplorerContainer}
          bounces
          showsVerticalScrollIndicator
          indicatorStyle={isDarkMode ? 'white' : 'black'}>
          <ExplorerItem isLoading={isLoading} explorerData={explorerData} />
        </ScrollView>
      </>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  viewAllContainer: {
    height: 600,
  },
  sectionBackContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  chevronImage: {
    width: 8,
    height: 18,
  },
  twentyWidth: {
    width: '20%',
  },
  sixtyWidth: {
    width: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollExplorerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    paddingHorizontal: 4,
    // flexGrow: 1,
    // height: 500,
  },
  sectionTitle: {
    fontWeight: '600',
    color: 'white',
    fontSize: 20,
    lineHeight: 24,
  },
  sectionTitleBlack: {
    fontWeight: '600',
    color: '#1f1f1f',
    fontSize: 20,
    lineHeight: 24,
  },
});
