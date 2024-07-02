import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const songDefault = require('./icons/song.png');

const SongItem = ({item, index, onPress}) => {
  return (
    <View style={styles.songContainer}>
      <Pressable style={styles.songPressable} onPress={() => onPress(index)}>
        <View style={styles.songImageContainer}>
          <Image style={styles.songImage} source={songDefault} />
        </View>

        <View style={styles.songTextContainer}>
          <Text
            multiline
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.songText}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  songContainer: {
    margin: screenWidth * 0.032,
  },
  songPressable: {
    alignItems: 'center',
  },
  songImage: {
    width: 50,
    height: 50,
  },
  songImageContainer: {
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 10,
    paddingHorizontal: screenWidth * 0.115,
    paddingVertical: screenHeight * 0.015,
    borderWidth: 2,
  },
  songTextContainer: {
    justifyContent: 'center',
  },
  songText: {
    width: screenWidth * 0.3,
    textAlign: 'center',
    color: 'rgb(200, 200, 200)',
    marginTop: screenHeight * 0.005,
    fontFamily: 'Gill Sans',
    fontSize: screenWidth * 0.04,
  },
});

export default React.memo(SongItem);
