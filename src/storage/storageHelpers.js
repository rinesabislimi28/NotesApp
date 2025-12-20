import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadData = async (key, defaultValue) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
};
