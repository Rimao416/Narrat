import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors } from '../../constants/Colors';

export default function HomeScreen() {
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textMain }]}>Verset du Jour</Text>
      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
          "Car Dieu a tant aimé le monde..."
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
