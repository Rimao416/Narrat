import { Platform } from 'react-native';
import Constants from 'expo-constants';

// On récupère dynamiquement l'IP de la machine locale via Expo,
// utile si on teste sur un vrai téléphone via le réseau WiFi.
let DEV_HOST = 'localhost';
if (__DEV__ && Constants.expoConfig?.hostUri) {
  DEV_HOST = Constants.expoConfig.hostUri.split(':')[0];
} else if (Platform.OS === 'android') {
  DEV_HOST = '10.0.2.2';
}

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3000/api`
  : 'https://api.narrat.app/api';
