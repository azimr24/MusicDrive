import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useMusicPlayer} from './MusicPlayerContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {useEffect} from 'react';

const songDefault = require('./icons/song-grad.png');
const play = require('./icons/play-triangle.png');
const pause = require('./icons/pause-lone.png');
const home = require('./icons/home.png');
const recent = require('./icons/recent.png');
const noThumbTrack = require('./icons/no-thumb-track.png');
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const MiniPlayer = ({navigation, routeName}) => {
  const {
    songs,
    gIsPlaying,
    title,
    repeat,
    currSong,
    duration,
    position,
    setPosition,
    togglePlayPause,
    handleNextSong,
    playlistArtistName,
    loading,
  } = useMusicPlayer();

  const handlePress = () => {
    if (!loading) {
      navigation.navigate('MusicPlayer');
    }
  };

  const handleReturnHome = () => {
    if (!loading) {
      navigation.navigate('Home');
    }
  };

  const handleGoToRecent = async () => {
    if (!loading) {
      try {
        const jsonVal = await AsyncStorage.getItem('recentPlaylistInfo');
        const recentPlaylistInfo = jsonVal ? JSON.parse(jsonVal) : [];
        if (recentPlaylistInfo.length == 3) {
          navigation.navigate('SelectedFolder', {
            folderID: recentPlaylistInfo[0],
            folderArtist: recentPlaylistInfo[1],
            folderPlaylist: recentPlaylistInfo[2],
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const onPlaybackStatusUpdate = async newStatus => {
      const currPosition = newStatus.positionMillis;
      setPosition(() => currPosition);
      if (newStatus.didJustFinish && !newStatus.isLooping) {
        if (repeat !== 2) {
          await handleNextSong();
        } else {
          console.log(repeat);
          await currSong.current.replayAsync();
        }
      }
    };

    if (currSong.current) {
      currSong.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }

    return () => {
      if (currSong.current) {
        currSong.current.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [currSong.current, songs, repeat]);

  return (
    <View>
      {routeName != 'MusicPlayer' &&
      routeName != 'SignIn' &&
      routeName != 'Queue' ? (
        <View style={styles.bottomStuff}>
          <Pressable onPress={handlePress}>
            <LinearGradient
              colors={['#ACB7BB', '#c8c8c8', '#1F114D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.songDefaultGradient}>
              <View style={styles.leftMiniPlayerContainer}>
                <Image style={styles.songDefaultImage} source={songDefault} />
                <View style={styles.songInfoContainer}>
                  <Text
                    style={styles.songNameText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {title}
                  </Text>
                  <Text style={styles.playlistNameText}>
                    {playlistArtistName}
                  </Text>
                </View>
              </View>

              <Pressable onPress={togglePlayPause}>
                <Image
                  style={styles.playPauseButton}
                  source={gIsPlaying ? pause : play}></Image>
              </Pressable>
            </LinearGradient>
          </Pressable>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              thumbImage={noThumbTrack}
              disabled={true}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor="#1C9B2C"
              maximumTrackTintColor="black"></Slider>
          </View>
          <View style={styles.bottomMenu}>
            <Pressable
              onPress={handleReturnHome}
              style={styles.homeButtonPressable}>
              <Image style={styles.homeButton} source={home}></Image>
              <Text style={styles.homeButtonText}>Home</Text>
            </Pressable>
            <Pressable
              onPress={handleGoToRecent}
              style={styles.recentButtonPressable}>
              <Image style={styles.recentButton} source={recent}></Image>
              <Text style={styles.recentButtonText}>Recent</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomStuff: {
    position: 'absolute',
    bottom: 0,
  },
  songDefaultGradient: {
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftMiniPlayerContainer: {
    flexDirection: 'row',
  },
  songDefaultImage: {
    width: SCREEN_HEIGHT * 0.065,
    height: SCREEN_HEIGHT * 0.065,
    // backgroundColor: 'red'
  },
  songInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH * 0.01,
  },
  songNameText: {
    color: '#1C9B2C',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
    textShadowColor: 'black',
    width: SCREEN_WIDTH * 0.5,
  },
  playlistNameText: {
    color: 'black',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.038,
  },
  playPauseButton: {
    width: SCREEN_HEIGHT * 0.0275,
    height: SCREEN_HEIGHT * 0.0275,
    marginRight: SCREEN_WIDTH * 0.05,
  },
  sliderContainer: {
    height: SCREEN_HEIGHT * 0.003,
    justifyContent: 'center',
    backgroundColor: '#20b132',
    width: SCREEN_WIDTH * 0.98,
    alignSelf: 'center',
  },
  slider: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  bottomMenu: {
    backgroundColor: 'rgb(30, 30, 30)',
    height: SCREEN_HEIGHT * 0.11,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  homeButtonPressable: {
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.12,
    flex: 1,
  },
  homeButton: {
    width: SCREEN_HEIGHT * 0.03,
    height: SCREEN_HEIGHT * 0.03,
  },
  homeButtonText: {
    color: '#C8C8C8',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
  recentButtonPressable: {
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.12,
    flex: 1,
  },
  recentButton: {
    width: SCREEN_HEIGHT * 0.03,
    height: SCREEN_HEIGHT * 0.03,
  },
  recentButtonText: {
    color: '#C8C8C8',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
});
