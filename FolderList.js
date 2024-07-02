import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import {getAlbums, getPlaylists} from './googleDriveAPI';
import {getAccessToken} from './googleAuth';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const options = ['Playlists', 'Albums'];

export const FoldersList = ({navigation}) => {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Playlists');
  const underlinePosition = useRef(
    new Animated.Value(SCREEN_WIDTH / (options.length * 4)),
  ).current;
  const scrollRef = useRef(null);

  const renderData = option => {
    switch (option) {
      case 'Playlists':
        const filteredPlaylists = playlists.filter(item => {
          const nameSplit = item.name.split(' - ');
          if (nameSplit.length == 2) {
            return item;
          }
        });
        return filteredPlaylists;
      case 'Albums':
        const filteredAlbums = albums.filter(item => {
          const nameSplit = item.name.split(' - ');
          if (nameSplit.length == 2) {
            return item;
          }
        });
        return filteredAlbums;
      default:
        return [];
    }
  };

  const handleOptionPress = (option, index) => {
    setSelectedOption(option);
    const pos = (SCREEN_WIDTH / options.length) * (index + 0.25);
    Animated.spring(underlinePosition, {
      toValue: pos,
      useNativeDriver: true,
    }).start();
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: SCREEN_WIDTH * index, animated: true});
    }
  };

  const handleFolderSelect = (folderID, folderArtist, folderPlaylist) => {
    navigation.navigate('SelectedFolder', {
      folderID,
      folderArtist,
      folderPlaylist,
    });
  };

  useEffect(() => {
    const getFolders = async () => {
      const accessToken = await getAccessToken();
      const retrievedAlbums = await getAlbums(accessToken);
      const retrievedPlaylists = await getPlaylists(accessToken);
      setAlbums(() => retrievedAlbums);
      setPlaylists(() => retrievedPlaylists);
    };
    getFolders();
  }, []);

  return (
    <SafeAreaView style={styles.flContainer}>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Pressable
            key={option}
            style={styles.option}
            onPress={() => handleOptionPress(option, index)}>
            <Text
              style={
                selectedOption === option
                  ? [styles.optionText, styles.selectedOptionText]
                  : styles.optionText
              }>
              {option}
            </Text>
          </Pressable>
        ))}
        <Animated.View
          style={[
            styles.underline,
            {
              width: SCREEN_WIDTH / (options.length * 2),
              transform: [{translateX: underlinePosition}],
            },
          ]}
        />
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        scrollEnabled={false}>
        {options.map(option => (
          <View key={option} style={styles.scrollViewItem}>
            <FlatList
              contentContainerStyle={styles.contentContainerStyle}
              data={renderData(option)}
              numColumns={2}
              keyExtractor={item => item.name}
              renderItem={({item}) => {
                const [folderArtist, folderPlaylist] = item.name.split(' - ');
                return (
                  <Pressable
                    style={styles.folderPressable}
                    onPress={() => {
                      handleFolderSelect(item.id, folderArtist, folderPlaylist);
                    }}>
                    <Image
                      style={styles.folderImage}
                      source={require('./icons/folder.png')}
                    />
                    <View style={styles.folderTextContainer}>
                      <Text
                        multiline
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.folderText}>
                        {folderPlaylist}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              ListFooterComponent={<View style={styles.footer}></View>}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginTop: SCREEN_HEIGHT * 0.01,
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(200, 200, 200)',
    position: 'relative',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.012,
  },
  optionText: {
    color: 'rgb(200, 200, 200)',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.045,
  },
  selectedOptionText: {
    color: 'rgb(30, 205, 96)',
    fontWeight: '500',
  },
  underline: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgb(30, 185, 96)',
    bottom: -2,
  },
  flContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    alignSelf: 'center',
  },
  footer: {
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: 'transparent',
  },
  scrollViewItem: {
    width: SCREEN_WIDTH,
  },
  folderPressable: {
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'flex-start',
    borderColor: 'white',
    overflow: 'hidden',
    margin: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.13,
  },
  folderImage: {
    width: '97.5%',
    height: '75%',
  },
  folderTextContainer: {
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.076,
  },
  folderText: {
    height: SCREEN_HEIGHT * 0.1,
    width: SCREEN_WIDTH * 0.23,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.04,
  },
});
