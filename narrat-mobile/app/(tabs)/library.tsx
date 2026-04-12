import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors } from '../../constants/Colors';

export default function LibraryScreen() {
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textMain }]}>Bibliothèque Chrétienne</Text>
      <Text style={{ color: themeColors.textMuted }}>Explorez des siècles de sagesse chrétienne.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
