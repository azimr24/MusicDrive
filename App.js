import React, { useEffect, useState } from 'react';
import {
  LogBox
} from 'react-native';
import { NavigationContainer, useNavigation, useNavigationState} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from './SignIn.js';
import { HomeScreen } from './HomeScreen.js';
import { SelectedFolder } from './SelectedFolder.js';
import { MusicPlayer } from './MusicPlayer.js';
import { MusicPlayerProvider } from './MusicPlayerContext.js';
import { MiniPlayer } from './MiniPlayer.js';
import { Queue } from './Queue.js';


const Stack = createStackNavigator()

const ShowMiniPlayer = () => {
  const [routeName, setRouteName] = useState('SignIn')
  const currRouteName = useNavigationState((state) => {
      if (state) {
        const route = state.routes[state.index]
        return route.name
      }
    })

  useEffect(() => {
    if (currRouteName) {
      setRouteName(currRouteName)
    }
  }, [currRouteName])

  
  const navigation = useNavigation()
  return <MiniPlayer routeName={routeName} navigation={navigation}/>
}

function App() {
  LogBox.ignoreLogs([
    '[Reanimated] Tried to modify key \`current\` of an object which has been already passed to a worklet.',
    ]); // hidden as it does not affect application
  return (
    <MusicPlayerProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='SignIn'>
          <Stack.Screen name='SignIn' options={{ headerShown: false }} component={SignIn}></Stack.Screen>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen}></Stack.Screen>
          <Stack.Screen name='SelectedFolder' options={{ headerShown: false }} component={SelectedFolder}></Stack.Screen>
          <Stack.Screen name='MusicPlayer' options={{ headerShown: false }} component={MusicPlayer}></Stack.Screen>
          <Stack.Screen name='Queue' options={{ headerShown: false }} component={Queue}></Stack.Screen>
        </Stack.Navigator>
        <ShowMiniPlayer></ShowMiniPlayer>
      </NavigationContainer>
    </MusicPlayerProvider>
  );
}


export default App;
