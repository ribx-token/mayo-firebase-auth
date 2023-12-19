import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Logger } from 'mayo-logger'; 

export const signInGoogle = async (webClientId: string) => {
  try {
    Logger.info("Configuring GoogleSignin with webClientId.", { webClientId }, {tag: 'mayo-firebase-auth'});
    GoogleSignin.configure({ webClientId: webClientId });

    const playServicesAvailable = await GoogleSignin.hasPlayServices();
    Logger.info("Checking availability of Google Play Services.", { playServicesAvailable }, {tag: 'mayo-firebase-auth'});

    const signInResult = await GoogleSignin.signIn();
    Logger.info("User signed in using Google.", { userId: signInResult.user.id }, {tag: 'mayo-firebase-auth'});  // Log only user ID for privacy reasons

    if (webClientId) {
      await AsyncStorage.setItem('webClientId', webClientId);  // Store webClientId for convenience during logout
      Logger.info("Stored webClientId in AsyncStorage.", null, {tag: 'mayo-firebase-auth'});
    }

    return auth.GoogleAuthProvider.credential(signInResult.idToken);
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Logger.warn("User cancelled the Google sign-in process.", null, {tag: 'mayo-firebase-auth'});
    } else {
      Logger.error("Error during Google sign-in.", { message: error.message, errorCode: error.code }, {tag: 'mayo-firebase-auth'});
    }
  }
};
