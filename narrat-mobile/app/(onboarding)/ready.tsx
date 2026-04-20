import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import { useThemeColors } from '../../hooks/useThemeColors';

const { height } = Dimensions.get('window');

export default function Ready() {
  const { completeOnboarding, signupFirstName, signupEmail, signupPassword } = useOnboardingStore();
  const { register } = useAuthStore();
  const [registering, setRegistering] = useState(false);
  const C = useThemeColors();
  const styles = createStyles(C);

  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(24);
  const buttonOpacity = useSharedValue(0);
  const buttonY = useSharedValue(20);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    iconScale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 120 }));
    iconOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    contentOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    contentY.value = withDelay(700, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    buttonY.value = withDelay(1000, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));

  const handleEnter = async () => {
    setRegistering(true);
    try {
      if (signupEmail && signupPassword && signupFirstName) {
        await register(signupFirstName, signupEmail, signupPassword);
      }
      completeOnboarding();
      router.replace('/(tabs)');
    } catch (e: any) {
      setRegistering(false);
      Alert.alert('Erreur', e.message ?? 'Impossible de créer le compte. Réessayez.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Icon */}
      <View style={styles.iconSection}>
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <View style={styles.trophyIcon}>
            <View style={styles.trophyCup} />
            <View style={styles.trophyBase} />
            <View style={styles.trophyStand} />
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.title}>Vous etes pret !</Text>
        <Text style={styles.subtitle}>
          Votre parcours personnalise est configure.{'\n'}Que Dieu guide chaque pas.
        </Text>

        <View style={styles.verseCard}>
          <Text style={styles.verseText}>
            « Cherchez premierement le royaume de Dieu et sa justice, et toutes ces choses vous seront donnees par-dessus. »
          </Text>
          <Text style={styles.verseRef}>Matthieu 6:33</Text>
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.footer, buttonStyle]}>
        <TouchableOpacity
          style={[styles.enterButton, registering && { opacity: 0.7 }]}
          onPress={handleEnter}
          activeOpacity={0.85}
          disabled={registering}
        >
          {registering
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.enterButtonText}>Entrer dans Narrat</Text>
          }
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: SPACING.xl,
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.primary,
    opacity: 0,
    top: height * 0.1,
    alignSelf: 'center',
    // blur simulation via elevation
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    alignItems: 'center',
  },
  trophyCup: {
    width: 32,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  trophyBase: {
    width: 22,
    height: 5,
    backgroundColor: COLORS.gold,
    marginTop: 2,
  },
  trophyStand: {
    width: 30,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginTop: 1,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: C.text,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  verseCard: {
    width: '100%',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  verseText: {
    ...TYPOGRAPHY.body,
    color: C.textMuted,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  verseRef: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    paddingTop: SPACING.xl,
  },
  enterButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  });
}
