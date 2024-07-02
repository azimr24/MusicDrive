import {Audio, InterruptionModeIOS} from 'expo-av';
import React, {
  useEffect,
  createContext,
  useState,
  useRef,
  useContext,
} from 'react';
const MusicPlayerContext = createContext([]);

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({children}) => {
  const [songs, setSongs] = useState([]);
  const [songsBaseOrder, setSongsBaseOrder] = useState([]);
  const numSongs = songs.length;
  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(0);
  const [repeat, setRepeat] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistArtistName, setPlaylistArtistName] = useState('');
  const [gCurrSongIndex, setGCurrSongIndex] = useState(null);
  const [gIsPlaying, setGIsPlaying] = useState(false);

  const isProcessing = useRef(false);
  const currSong = useRef(null);

  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
      } catch (error) {
        console.log(error);
      }
    };

    configureAudioMode();
  }, []);

  const playSong = async () => {
    try {
      await currSong.current.playAsync();
      setGIsPlaying(() => true);
    } catch (error) {
      console.log(error);
    }
  };

  const pauseSong = async () => {
    try {
      await currSong.current.pauseAsync();
      setGIsPlaying(() => false);
    } catch (error) {
      console.log(error);
    }
  };

  const unloadSongs = async () => {
    await Promise.all(
      songs.map(songObject => {
        const {song} = songObject;
        return song.getStatusAsync().then(({isLoaded}) => {
          if (isLoaded) {
            return song.unloadAsync();
          }
        });
      }),
    );
  };
  const togglePlayPause = async () => {
    if (gIsPlaying) {
      await pauseSong();
    } else {
      await playSong();
    }
  };

  const stopSong = async () => {
    if (currSong.current) {
      await currSong.current.stopAsync();
      setGIsPlaying(() => false);
    }
  };
  const onSliderValueChange = async value => {
    if (currSong.current) {
      try {
        await currSong.current.setPositionAsync(Math.floor(value));
      } catch (error) {
        console.log('Seeking interrupted:', error);
      } finally {
        await playSong();
      }
    }
  };

  const handleNextSong = async () => {
    console.log('pressed');
    if (isProcessing.current) return;
    const nextSongIndex = (gCurrSongIndex + 1) % numSongs;
    try {
      const {song, title} = songs[nextSongIndex];
      const {isLoaded, durationMillis} = await song.getStatusAsync();
      if (isLoaded) {
        isProcessing.current = true;

        if (gCurrSongIndex !== numSongs - 1 || repeat === 1) {
          await currSong.current.stopAsync();
          setGCurrSongIndex(currSongIndex => (currSongIndex + 1) % numSongs);
          currSong.current = song;
          setTitle(() => title);
          console.log(title);
          setDuration(() => durationMillis);
          await playSong();
        } else {
          await stopSong();
        }

        isProcessing.current = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevSong = async () => {
    console.log('pressed');
    if (isProcessing.current) return;
    const nextSongIndex = (gCurrSongIndex - 1 + numSongs) % numSongs;
    try {
      const {song, title} = songs[nextSongIndex];
      const {isLoaded, durationMillis} = await song.getStatusAsync();
      if (isLoaded) {
        isProcessing.current = true;

        await currSong.current.stopAsync();
        console.log('curr', gCurrSongIndex);
        setGCurrSongIndex(
          currSongIndex => (currSongIndex - 1 + numSongs) % numSongs,
        );
        currSong.current = song;
        setTitle(() => title);
        console.log(title);
        setDuration(() => durationMillis);
        await playSong();

        isProcessing.current = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shuffleSongs = () => {
    if (!shuffle) {
      const currSongIndex = gCurrSongIndex;
      let songsCopy = [...songs];
      let shuffledSongs = [songsCopy[currSongIndex]];
      const shuffleStartIndex = (currSongIndex + 1) % numSongs;

      for (let i = 1; i < numSongs; i++) {
        const currIndex = (currSongIndex + i) % numSongs;

        const randIndex = Math.floor(Math.random() * (numSongs - i)) + (i - 1);
        const newIndex = (shuffleStartIndex + randIndex) % numSongs;

        shuffledSongs.push(songsCopy[newIndex]);
        swapSongs(songsCopy, currIndex, newIndex);
      }
      console.log('done shuffling');
      setShuffle(() => true);
      setSongs(() => shuffledSongs);
      setGCurrSongIndex(() => 0);
    } else {
      const currSongIndex = songsBaseOrder.findIndex(
        ({song}) => song === currSong.current,
      );
      console.log('done restoring');
      console.log(currSongIndex);
      setGCurrSongIndex(() => currSongIndex);
      setSongs(() => songsBaseOrder);
      setShuffle(() => false);
    }
  };

  const swapSongs = (swappedSongs, i, j) => {
    let temp = swappedSongs[i];
    swappedSongs[i] = swappedSongs[j];
    swappedSongs[j] = temp;
  };

  const repeatSongs = () => {
    setRepeat(currState => {
      switch (currState) {
        case 0:
          return 1;
        case 1:
          return 2;
        case 2:
          return 0;
      }
    });
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        songs,
        setSongs,
        gIsPlaying,
        setGIsPlaying,
        gCurrSongIndex,
        setGCurrSongIndex,
        title,
        setTitle,
        playlistName,
        setPlaylistName,
        currSong,
        duration,
        setPosition,
        position,
        setDuration,
        playSong,
        pauseSong,
        togglePlayPause,
        handleNextSong,
        handlePrevSong,
        onSliderValueChange,
        repeat,
        setRepeat,
        shuffle,
        setShuffle,
        loading,
        setLoading,
        stopSong,
        playlistArtistName,
        setPlaylistArtistName,
        songsBaseOrder,
        setSongsBaseOrder,
        shuffleSongs,
        repeatSongs,
        unloadSongs,
      }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
