import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'narrat_access_token';

// In-memory fallback when native AsyncStorage module isn't available (e.g. Expo Go)
let memToken: string | null = null;

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return memToken;
  }
};

export const setToken = async (token: string): Promise<void> => {
  memToken = token;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Persist failed — token lives in memory only until app restart
  }
};

export const removeToken = async (): Promise<void> => {
  memToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // silent
  }
};
