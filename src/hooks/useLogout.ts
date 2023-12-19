import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import authEvents from '../authEvents';
import { Logger } from 'mayo-logger';

export const useLogout = () => {
   const performLogout = async () => {
      Logger.info("Attempting to perform logout.", null, {tag: 'mayo-firebase-auth'});
      try {
         const webClientId = await AsyncStorage.getItem('webClientId');
         if(webClientId) {
            Logger.info("WebClientId retrieved successfully.", { webClientId }, {tag: 'mayo-firebase-auth'});
            GoogleSignin.configure({webClientId: webClientId});
            await GoogleSignin.revokeAccess();
            Logger.info("Google access revoked successfully.", null, {tag: 'mayo-firebase-auth'});
            await GoogleSignin.signOut();
            Logger.info("Google sign out successful.");
         } else {
            Logger.warn("No WebClientID found in AsyncStorage.", null, {tag: 'mayo-firebase-auth'});
         }
      } catch (error) {
         Logger.error("Error during logout process.", error, {tag: 'mayo-firebase-auth'});
      } finally {
         await AsyncStorage.removeItem('user');
         Logger.info("'user' removed from AsyncStorage.", null, {tag: 'mayo-firebase-auth'});
         authEvents.emit('signedOut', true);
         Logger.info("Emitting 'signedOut' event.", null, {tag: 'mayo-firebase-auth'});
      }
   };

   return { performLogout };
};
