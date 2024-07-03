import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {getFolderSongs} from './googleDriveAPI.js';
import {getAccessToken} from './googleAuth.js';
import Songitem from './Songitem.js';
import {useMusicPlayer} from './MusicPlayerContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Progress from 'react-native-progress';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const backArrow = require('./icons/back-arrow.png');

export const SelectedFolder = ({navigation, route}) => {
  const {
    songs,
    setSongs,
    unloadSongs,
    setSongsBaseOrder,
    setShuffle,
    setPlaylistArtistName,
    stopSong,
    loading,
    setLoading,
    setDuration,
    playSong,
    setTitle,
    setGCurrSongIndex,
    setPlaylistName,
    currSong,
  } = useMusicPlayer();
  const [folderID, setFolderID] = useState('');
  const [folderPlaylist, setFolderPlaylist] = useState('');
  const [folderArtist, setFolderArtist] = useState('');
  const [currSongs, setCurrSongs] = useState([]);
  const [canPress, setCanPress] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(currSongs);
    if (route.params) {
      setFolderID(route.params.folderID);
      setFolderPlaylist(route.params.folderPlaylist);
      setFolderArtist(route.params.folderArtist);
    }
  }, [route.params]);

  const handleReturn = () => [navigation.goBack()];

  const handleSongSelect = async index => {
    if (canPress) {
      try {
        if (currSong.current) {
          await stopSong();
        }

        await unloadSongs();

        console.log('Unloading Done');

        const recentPlaylistInfo = JSON.stringify([
          folderID,
          folderArtist,
          folderPlaylist,
        ]);
        await AsyncStorage.setItem('recentPlaylistInfo', recentPlaylistInfo);

        establishSongOrder(index);
        setShuffle(false);
        setGCurrSongIndex(() => 0);
        setLoading(() => true);
      } catch (error) {
        console.log(error);
      }
    }
  };

//   const loadSong = async index => {
//     if (songs.length > 0) {
//       const {song, url} = songs[index];
//       try {
//         const {isLoaded} = await song.getStatusAsync();
//         if (!isLoaded) {
//           await song.loadAsync({uri: url});
//           console.log(isLoaded, index);
//           setProgress(p => p + 1 / songs.length);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

  const loadSong = async (index) => {
      if (songs.length > 0) {
          const { song, url } = songs[index]
          return song.getStatusAsync().then(({isLoaded}) => {
              if (!isLoaded) {
                  return song.loadAsync({uri: url}).then(() => {
                      console.log(isLoaded, index)
                      setProgress(p => p + (1 / songs.length))
                  }).catch((error) => {
                      console.error(`Error loading song at index ${index}:`, error);
                  });
              }
          })
      }
  }

  const establishSongOrder = startIndex => {
    const songOrder = [currSongs[startIndex]];
    let i = (startIndex + 1) % currSongs.length;
    while (i != startIndex) {
      songOrder.push(currSongs[i]);
      i = (i + 1) % currSongs.length;
    }
    setSongs(() => songOrder);
  };

  useEffect(() => {
    const loadAndPlayFirstSong = async () => {
      await loadSong(0);
      const {song, title} = songs[0];
      currSong.current = song;
      setTitle(() => title);
      setPlaylistName(() => folderPlaylist);
      setPlaylistArtistName(() => folderArtist);
      const {durationMillis} = await currSong.current.getStatusAsync();
      setDuration(() => durationMillis);
      await playSong();
    };

    const loadSongs = async () => {
      if (loading) {
        await loadAndPlayFirstSong();
        const songsToBeLoaded = []
        for (let i = 1; i < songs.length; i++) {
          songsToBeLoaded.push(loadSong(i));
        }

        await Promise.all(songsToBeLoaded)
        setSongsBaseOrder(() => songs);
        setLoading(() => false);
        setCanPress(() => false);
        console.log('Loading Done');
        navigation.navigate('MusicPlayer');
      }
    };
    loadSongs();
  }, [loading]);

  useEffect(() => {
    const openFolder = async () => {
      console.log(loading);
      try {
        if (folderID) {
          const accessToken = await getAccessToken();
          const folderSongs = await getFolderSongs(accessToken, folderID);
          setCurrSongs(() => folderSongs);
        }
      } catch (error) {
        console.log(error);
      }
    };
    openFolder();
  }, [folderID]);

  return (
    <SafeAreaView style={styles.flContainer}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleReturn}>
          <Image style={styles.backArrow} source={backArrow}></Image>
        </Pressable>
        <Text style={styles.header}>{folderPlaylist}</Text>
      </View>
      <FlatList
        data={currSongs}
        contentContainerStyle={styles.contentContainerStyle}
        numColumns={2}
        keyExtractor={item => item.title}
        renderItem={({item, index}) => (
          <Songitem
            item={item}
            index={index}
            onPress={() => handleSongSelect(index)}></Songitem>
        )}
        ListFooterComponent={<View style={styles.footer} />}
      />
      {loading ? (
        <View style={styles.loadProgressContainer}>
          <Progress.Circle
            progress={progress}
            size={125}
            thickness={6}
            borderWidth={4}
            fill="rgb(0, 0, 0)"
            showsText={true}
            textStyle={{color: 'white', fontWeight: '600'}}
            color="rgb(30, 180, 96)"></Progress.Circle>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: SCREEN_HEIGHT * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },
  header: {
    color: 'rgb(200, 200, 200)',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.045,
    marginLeft: SCREEN_WIDTH * 0.028,
  },
  backArrow: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
  },
  flContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainerStyle: {
    alignSelf: 'center',
  },
  footer: {
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: 'transparent',
  },
  loadProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});
