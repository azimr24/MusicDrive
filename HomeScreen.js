import {StatusBar, Text, View, StyleSheet, Dimensions} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {FoldersList} from './FolderList.js';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="light-content"></StatusBar>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Music Drive</Text>
      </View>
      <FoldersList navigation={navigation}></FoldersList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    marginTop: SCREEN_HEIGHT * 0.01,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8,
    backgroundColor: 'rgb(30, 165, 96)',
    borderRadius: 20,
    width: 130,
  },
  header: {
    color: 'black',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.05,
  },
});
