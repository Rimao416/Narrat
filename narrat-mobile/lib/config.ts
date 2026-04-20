import { Platform } from 'react-native';

// On Android emulator, 10.0.2.2 pointe vers la machine hôte.
// Sur iOS simulator et appareil physique, utilise l'IP LAN de ta machine.
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3000/api`
  : 'https://api.narrat.app/api';
