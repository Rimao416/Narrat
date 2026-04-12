import { StyleSheet, Text, View, Switch } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors, COLORS } from '../../constants/Colors';

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textMain }]}>Profil</Text>
      <View style={[styles.row, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={{ color: themeColors.textMain, fontSize: 18 }}>Mode Sombre</Text>
        <Switch 
          value={isDarkMode} 
          onValueChange={toggleTheme}
          trackColor={{ false: themeColors.border, true: COLORS.primaryLight }}
          thumbColor={isDarkMode ? COLORS.primary : themeColors.textMuted}
        />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  }
});
