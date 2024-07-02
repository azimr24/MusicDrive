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
import DraggableFlatList from 'react-native-draggable-flatlist';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const backArrow = require('./icons/back-arrow.png');
const songDefault = require('./icons/music-2.png');
const playButton = require('./icons/play-2.png');
const pauseButton = require('./icons/pause-2.png');
const repeatButton = require('./icons/repeat-2.png');
const repeatOnButton = require('./icons/repeat-on.png');
const repeatSongButton = require('./icons/repeat-song.png');
const shuffleButton = require('./icons/shuffle-2.png');
const shuffleOnButton = require('./icons/shuffle-on.png');
const nextButton = require('./icons/next.png');
const prevButton = require('./icons/prev.png');
const sliderTrack = require('./icons/slider-track.png');
const queue = require('./icons/queue.png');
const replay = require('./icons/replay.png');
const dragButton = require('./icons/drag-button.png');

export const Queue = ({navigation}) => {
  const {
    songs,
    setSongs,
    shuffle,
    repeat,
    gIsPlaying,
    title,
    playlistName,
    duration,
    position,
    gCurrSongIndex,
    pauseSong,
    togglePlayPause,
    handleNextSong,
    handlePrevSong,
    onSliderValueChange,
    playlistArtistName,
    shuffleSongs,
    repeatSongs,
  } = useMusicPlayer();
  const numSongs = songs.length;

  const handleReturn = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backArrowContainer} onPress={handleReturn}>
            <Image style={styles.backArrow} source={backArrow} />
          </Pressable>
          <Text style={styles.headerText}>{playlistName}</Text>
        </View>
        <View style={styles.nowPlayingContainer}>
          <Text style={styles.nowPlayingText}>Now Playing</Text>
          <View style={styles.nowPlayingRow}>
            <View style={styles.nowPlayingTextAndImageContainer}>
              <LinearGradient
                colors={['#512469', '#1C9B2C', '#BCC4BB', '#736080']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.songImageContainer}>
                <Image style={styles.songImage} source={songDefault} />
              </LinearGradient>
              <View style={styles.currSongInfoContainer}>
                <Text
                  style={styles.currSongName}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.currSongArtist}>{playlistArtistName}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.nowPlayingText}>Next In Queue</Text>
        <DraggableFlatList
          data={songs.slice(gCurrSongIndex + 1, numSongs)}
          style={styles.draggableFL}
          onDragEnd={({data}) => {
            data.unshift(songs[gCurrSongIndex]);
            setSongs(data);
          }}
          keyExtractor={item => item.title}
          renderItem={({item, drag, isActive}) => {
            return (
              <View
                style={[
                  styles.nextToQueue,
                  {backgroundColor: isActive ? 'rgb(25, 25, 25)' : 'black'},
                ]}>
                <View style={styles.queuedInfoContainer}>
                  <Text
                    style={[styles.currSongName, {color: 'white'}]}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.currSongArtist}>
                    {playlistArtistName}
                  </Text>
                </View>
                <Pressable
                  onLongPress={drag}
                  style={styles.addToQueuePressable}>
                  <Image source={dragButton} style={styles.dragImage}></Image>
                </Pressable>
              </View>
            );
          }}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
      <View style={styles.miniPlayer}>
        <Slider
          style={styles.slider}
          thumbImage={sliderTrack}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingStart={pauseSong}
          onSlidingComplete={onSliderValueChange}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="rgb(100,100,100)"
        />
        <View style={styles.controlsContainer}>
          <Pressable onPress={() => shuffleSongs(songs)}>
            <Image
              style={styles.shuffleButton}
              source={shuffle ? shuffleOnButton : shuffleButton}></Image>
          </Pressable>
          <Pressable onPress={handlePrevSong}>
            <Image style={styles.prevButton} source={prevButton}></Image>
          </Pressable>
          <Pressable
            style={{backgroundColor: '#1DB954', borderRadius: 35}}
            onPress={togglePlayPause}>
            <Image
              style={styles.playPauseButton}
              source={gIsPlaying ? pauseButton : playButton}></Image>
          </Pressable>
          <Pressable onPress={handleNextSong}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    borderBottomColor: 'rgb(100, 100, 100)',
    borderBottomWidth: 1,
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
  nowPlayingContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  nowPlayingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
  },
  nowPlayingRow: {
    marginVertical: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nowPlayingTextAndImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currSongInfoContainer: {
    marginLeft: SCREEN_WIDTH * 0.05,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  songImageContainer: {
    width: SCREEN_HEIGHT * 0.07,
    height: SCREEN_HEIGHT * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songImage: {
    width: SCREEN_HEIGHT * 0.055,
    height: SCREEN_HEIGHT * 0.055,
  },
  currSongName: {
    color: '#2bd941',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    width: SCREEN_WIDTH * 0.6,
  },
  currSongArtist: {
    marginTop: SCREEN_WIDTH * 0.01,
    color: 'white',
  },
  draggableFL: {
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  contentContainerStyle: {
    paddingBottom: SCREEN_HEIGHT * 0.55,
  },
  nextToQueue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
    paddingBottom: SCREEN_HEIGHT * 0.07,
    zIndex: 2,
  },
  sliderContainer: {
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  slider: {
    width: SCREEN_WIDTH * 0.88,
    alignSelf: 'center',
  },
  addToQueuePressable: {},
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
  dragImage: {
    width: 25,
    height: 25,
  },
  repeatButton: {
    width: 25,
    height: 25,
  },
});

export default Queue;
