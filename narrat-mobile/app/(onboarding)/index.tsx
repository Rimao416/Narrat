import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const C = COLORS.dark;

export default function OnboardingIndex() {
  const ring1Opacity = useSharedValue(0);
  const ring2Opacity = useSharedValue(0);
  const ring3Opacity = useSharedValue(0);
  const ring1Scale = useSharedValue(0.6);
  const ring2Scale = useSharedValue(0.6);
  const ring3Scale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsY = useSharedValue(30);

  useEffect(() => {
    ring1Scale.value = withDelay(0, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    ring1Opacity.value = withDelay(0, withSequence(
      withTiming(0.15, { duration: 600 }),
      withRepeat(withSequence(
        withTiming(0.08, { duration: 2000 }),
        withTiming(0.15, { duration: 2000 }),
      ), -1)
    ));
    ring2Scale.value = withDelay(150, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    ring2Opacity.value = withDelay(150, withSequence(
      withTiming(0.1, { duration: 600 }),
      withRepeat(withSequence(
        withTiming(0.05, { duration: 2400 }),
        withTiming(0.1, { duration: 2400 }),
      ), -1)
    ));
    ring3Scale.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    ring3Opacity.value = withDelay(300, withSequence(
      withTiming(0.06, { duration: 600 }),
      withRepeat(withSequence(
        withTiming(0.03, { duration: 2800 }),
        withTiming(0.06, { duration: 2800 }),
      ), -1)
    ));
    logoOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(400, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(800, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
    buttonsOpacity.value = withDelay(1100, withTiming(1, { duration: 500 }));
    buttonsY.value = withDelay(1100, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: ring1Scale.value }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: ring2Scale.value }],
  }));
  const ring3Style = useAnimatedStyle(() => ({
    opacity: ring3Opacity.value,
    transform: [{ scale: ring3Scale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Ambient rings */}
      <Animated.View style={[styles.ring, styles.ring3, ring3Style]} />
      <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
      <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />

      {/* Logo area */}
      <View style={styles.logoSection}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <View style={styles.crossContainer}>
            <View style={styles.crossVertical} />
            <View style={styles.crossHorizontal} />
          </View>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.appName}>Narrat</Text>
          <Text style={styles.tagline}>Grandis. Apprends. Reste ancre.</Text>
        </Animated.View>
      </View>

      {/* Buttons */}
      <Animated.View style={[styles.buttonsSection, buttonsStyle]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(onboarding)/signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Commencer ma foi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => router.push('/(onboarding)/signup')}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconPlaceholder} />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/(onboarding)/signup')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>
            J'ai deja un compte{' '}
            <Text style={styles.loginLinkAccent}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ring1: {
    width: 260,
    height: 260,
    top: height * 0.18 - 130,
    left: width / 2 - 130,
  },
  ring2: {
    width: 360,
    height: 360,
    top: height * 0.18 - 180,
    left: width / 2 - 180,
  },
  ring3: {
    width: 480,
    height: 480,
    top: height * 0.18 - 240,
    left: width / 2 - 240,
  },
  logoSection: {
    alignItems: 'center',
    gap: SPACING.xl,
    marginTop: height * 0.08,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    position: 'absolute',
    width: 5,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 30,
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    top: 8,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: C.text,
    textAlign: 'center',
    fontSize: 38,
    letterSpacing: -1,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  buttonsSection: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  googleButton: {
    width: '100%',
    height: 54,
    backgroundColor: C.surface,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: C.border2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  googleIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.textMuted,
  },
  googleButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: C.text,
  },
  loginLink: {
    paddingVertical: SPACING.sm,
  },
  loginLinkText: {
    ...TYPOGRAPHY.body,
    color: C.textMuted,
  },
  loginLinkAccent: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
