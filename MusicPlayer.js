import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';

import {useMusicPlayer} from './MusicPlayerContext.js';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const backArrow = require('./icons/back-arrow.png');
const songDefault = require('./icons/music-2.png');
const playButton = require('./icons/play.png');

const pauseButton = require('./icons/pause.png');
const repeatButton = require('./icons/repeat.png');
const repeatOnButton = require('./icons/repeat-on.png');
const repeatSongButton = require('./icons/repeat-song.png');
const shuffleButton = require('./icons/shuffle.png');
const shuffleOnButton = require('./icons/shuffle-on.png');
const nextButton = require('./icons/next.png');
const prevButton = require('./icons/prev.png');
const sliderTrack = require('./icons/slider-track.png');
const queue = require('./icons/queue.png');

export const MusicPlayer = ({navigation}) => {
  const {
    songs,
    repeat,
    setRepeat,
    shuffle,
    gIsPlaying,
    title,
    playlistName,
    duration,
    position,
    pauseSong,
    togglePlayPause,
    handleNextSong,
    handlePrevSong,
    onSliderValueChange,
    playlistArtistName,
    shuffleSongs,
    repeatSongs,
  } = useMusicPlayer();

  const [sliderValue, setSliderValue] = useState(position);

  const formatTime = (time = 0, pos = 0) => {
    const timeDiff = time - pos;
    const mins = Math.floor(timeDiff / 60000);
    const secs = Math.floor((timeDiff % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    setSliderValue(position);
  }, [position]);

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleOpenQueue = () => {
    navigation.navigate('Queue');
  };

  return (
    <LinearGradient
      colors={['#1F114D', '#ACB7BB']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.background}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backArrowContainer} onPress={handleReturn}>
            <Image style={styles.backArrow} source={backArrow} />
          </Pressable>
          <Text style={styles.headerText}>{playlistName}</Text>
        </View>
        <LinearGradient
          colors={['#512469', '#1C9B2C', '#BCC4BB', '#736080']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.songImageContainer}>
          <Image style={styles.songImage} source={songDefault} />
        </LinearGradient>
        <View style={styles.songInfoAndQueueContainer}>
          <View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.songName}>
              {title}
            </Text>
          </View>
          <Pressable onPress={handleOpenQueue} style={styles.queuePressable}>
            <Image source={queue} style={styles.queueImage}></Image>
          </Pressable>
        </View>
        <View style={styles.songSubtitleContainer}>
          <Text style={styles.songSubtitle}>{playlistArtistName}</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            thumbImage={sliderTrack}
            minimumValue={0}
            maximumValue={duration}
            value={sliderValue}
            onValueChange={value => setSliderValue(value)} // Update position dynamically
            onSlidingStart={pauseSong}
            onSlidingComplete={onSliderValueChange}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#000000"></Slider>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(sliderValue)}</Text>
          <Text style={styles.time}>{`-${formatTime(
            duration,
            sliderValue,
          )}`}</Text>
        </View>
        <View style={styles.controlsContainer}>
          <Pressable onPress={shuffleSongs}>
            <Image
              style={styles.shuffleButton}
              source={shuffle > 0 ? shuffleOnButton : shuffleButton}></Image>
          </Pressable>
          <Pressable
            onPress={() => {
              if (repeat === 2) {
                setRepeat(() => 1);
              }
              handlePrevSong();
            }}>
            <Image style={styles.prevButton} source={prevButton}></Image>
          </Pressable>
          <Pressable
            style={{backgroundColor: '#1DB954', borderRadius: 35}}
            onPress={togglePlayPause}>
            <Image
              style={styles.playPauseButton}
              source={gIsPlaying ? pauseButton : playButton}></Image>
          </Pressable>
          <Pressable
            onPress={() => {
              if (repeat === 2) {
                setRepeat(() => 1);
              }
              handleNextSong();
            }}>
            <Image style={styles.nextButton} source={nextButton}></Image>
          </Pressable>
          <Pressable onPress={repeatSongs}>
            <Image
              style={styles.repeatButton}
              source={
                repeat === 0
                  ? repeatButton
                  : repeat === 1
                  ? repeatOnButton
                  : repeatSongButton
              }></Image>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  headerText: {
    color: 'rgb(200, 200, 200)',
    fontFamily: 'Gill Sans',
    fontSize: SCREEN_WIDTH * 0.04,
    position: 'absolute',
    width: SCREEN_WIDTH,
    textAlign: 'center',
    zIndex: 1,
  },
  backArrowContainer: {
    zIndex: 2,
  },
  backArrow: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
  },
  background: {
    flex: 1,
  },
  songImageContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  songImage: {
    width: '80%',
    height: '80%',
  },
  songInfoAndQueueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
  },
  songName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.055,
    fontFamily: 'Gill Sans',
    lineHeight: 35,
    width: SCREEN_WIDTH * 0.7,
  },
  songSubtitleContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.07,
  },
  songSubtitle: {
    color: 'black',
    fontSize: SCREEN_WIDTH * 0.047,
    fontFamily: 'Gill Sans',
    width: SCREEN_WIDTH * 0.7,
  },
  queueImage: {
    width: 27.5,
    height: 27.5,
  },
  sliderContainer: {
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  slider: {
    width: SCREEN_WIDTH * 0.88,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.87,
  },
  time: {
    color: 'white',
  },
  controlsContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.85,
  },
  playPauseButton: {
    width: 60,
    height: 60,
  },
  prevButton: {
    width: 25,
    height: 25,
  },
  nextButton: {
    width: 25,
    height: 25,
  },
  shuffleButton: {
    width: 25,
    height: 25,
  },
  repeatButton: {
    width: 25,
    height: 25,
  },
});

export default MusicPlayer;
