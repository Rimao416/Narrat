import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors } from '../../constants/Colors';

export default function CommunityScreen() {
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textMain }]}>Confession & Communauté</Text>
      <Text style={{ color: themeColors.textMuted }}>On ne traverse pas ses épreuves seul.</Text>
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
