import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const accessTokenTimeLimit = 3599000;
const CLIENT_ID =
  '1038734147598-o8rsehouohndksfugbnk9pg3oc8npnv7.apps.googleusercontent.com';

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const serverAuthCode = userInfo.serverAuthCode;
    const {access_token, refresh_token} = await getTokensFromServerAuthCode(
      serverAuthCode,
    );
    console.log(access_token);
    console.log(refresh_token);
    await AsyncStorage.setItem('googleAccessToken', access_token);
    await AsyncStorage.setItem('googleRefreshToken', refresh_token);
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in is in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available or outdated');
    } else {
      console.error('An error occurred during sign in', error);
    }
  }
};

export const signOutWithGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    AsyncStorage.removeItem('googleAccessToken');
    AsyncStorage.removeItem('googleRefreshToken');
    AsyncStorage.removeItem('expirationTime');
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in is in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available or outdated');
    } else {
      console.error('An error occurred during sign in', error);
    }
  }
};

const getTokensFromServerAuthCode = async serverAuthCode => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${serverAuthCode}&client_id=${CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&grant_type=authorization_code`,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching tokens from server auth code:', errorData);
      throw new Error(errorData.error_description);
    }
    const data = await response.json();

    const expTimeFromCreation = new Date().getTime + accessTokenTimeLimit;
    await AsyncStorage.setItem('expirationTime', expTimeFromCreation);
    return data;
  } catch (error) {
    console.error('Error fetching tokens from server auth code:', error);
    throw error;
  }
};

export const getAccessToken = async () => {
  const currTime = new Date().getTime();
  try {
    const expirationTime = await AsyncStorage.getItem('expirationTime');
    const refreshToken = await AsyncStorage.getItem('googleRefreshToken');
    if (currTime < expirationTime) {
      const token = await AsyncStorage.getItem('googleAccessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      return token;
    } else {
      const newToken = await refreshAccessToken(refreshToken);
      return newToken;
    }
  } catch (error) {
    console.log(error);
  }
};

const refreshAccessToken = async refreshToken => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${CLIENT_ID}&refresh_token=${refreshToken}&grant_type=refresh_token`,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error refreshing access token:', errorData);
      if (errorData.error === 'invalid_grant') {
        await AsyncStorage.removeItem('googleAccessToken');
        await AsyncStorage.removeItem('googleRefreshToken');
        await AsyncStorage.removeItem('expirationTime');
        await signInWithGoogle();
      }
      throw new Error('Refresh token expired. Please sign in again.');
    }

    const data = await response.json();

    const expTimeFromCreation = new Date().getTime + accessTokenTimeLimit;
    await AsyncStorage.setItem('expirationTime', expTimeFromCreation);

    const newAccessToken = data.access_token;
    await AsyncStorage.setItem('googleAccessToken', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
