import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Settings, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, BookOpen, Sword, GraduationCap, Flame } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_USER, MOCK_BADGES, MOCK_BOOKS, MOCK_COURSES } from '../../data/mockData';
import { useThemeStore } from '../../store/themeStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { router } from 'expo-router';

const C = COLORS.dark;

const STATS = [
  { icon: <BookOpen size={16} color={COLORS.info} />, value: MOCK_BOOKS.filter((b) => b.progress > 0).length, label: 'Livres lus', bg: COLORS.infoBg },
  { icon: <GraduationCap size={16} color={COLORS.gold} />, value: MOCK_COURSES.filter((c) => c.progress > 0).length, label: 'Formations', bg: 'rgba(212,175,55,0.12)' },
  { icon: <Flame size={16} color={COLORS.warning} />, value: MOCK_USER.streakDays, label: 'Streak', bg: COLORS.warningBg },
  { icon: <Sword size={16} color={COLORS.purple} />, value: MOCK_USER.activeChallenges, label: 'Defis', bg: COLORS.purpleBg },
];

const SETTINGS_ROWS = [
  { icon: Bell, label: 'Notifications', hasToggle: false },
  { icon: Shield, label: 'Confidentialite', hasToggle: false },
  { icon: HelpCircle, label: 'Aide & Support', hasToggle: false },
];

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { reset } = useOnboardingStore();

  const xpPct = (MOCK_USER.xp / MOCK_USER.xpNext) * 100;

  const handleLogout = () => {
    reset();
    router.replace('/(onboarding)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Profil</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Settings size={18} color={C.textMuted} />
        </TouchableOpacity>
      </View>

      {/* User card */}
      <View style={styles.userCard}>
        <View style={styles.avatarLg}>
          <Text style={styles.avatarLgText}>{MOCK_USER.initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{MOCK_USER.firstName}</Text>
          <Text style={styles.userChurch}>{MOCK_USER.church}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{MOCK_USER.level}</Text>
            <Text style={styles.levelNum}>Niv. {MOCK_USER.levelNum}</Text>
          </View>
        </View>
      </View>

      {/* XP bar */}
      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>Experience</Text>
          <Text style={styles.xpValues}>{MOCK_USER.xp} / {MOCK_USER.xpNext} XP</Text>
        </View>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${xpPct}%` }]} />
        </View>
        <Text style={styles.xpSub}>{MOCK_USER.xpNext - MOCK_USER.xp} XP pour atteindre le niveau {MOCK_USER.levelNum + 1}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {STATS.map((stat, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: stat.bg }]}>
            {stat.icon}
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <Text style={styles.badgeCount}>{MOCK_BADGES.filter((b) => b.earned).length}/{MOCK_BADGES.length}</Text>
        </View>
        <View style={styles.badgesGrid}>
          {MOCK_BADGES.map((badge) => (
            <View key={badge.id} style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
              <View style={[styles.badgeCircle, badge.earned && styles.badgeCircleEarned]}>
                <Text style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
                  {badge.earned ? '•' : '-'}
                </Text>
              </View>
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]} numberOfLines={1}>
                {badge.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Module progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>En cours</Text>
        <View style={styles.progressList}>
          {MOCK_BOOKS.filter((b) => b.progress > 0).map((book) => (
            <View key={book.id} style={styles.progressRow}>
              <View style={[styles.progressIcon, { backgroundColor: book.coverGradient[0] }]}>
                <BookOpen size={14} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle} numberOfLines={1}>{book.title}</Text>
                <View style={styles.progressBarWrap}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
                  </View>
                  <Text style={styles.progressPct}>{book.progress}%</Text>
                </View>
              </View>
            </View>
          ))}
          {MOCK_COURSES.filter((c) => c.progress > 0).map((course) => (
            <View key={course.id} style={styles.progressRow}>
              <View style={[styles.progressIcon, { backgroundColor: course.heroGradient[0] }]}>
                <GraduationCap size={14} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle} numberOfLines={1}>{course.title}</Text>
                <View style={styles.progressBarWrap}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                  </View>
                  <Text style={styles.progressPct}>{course.progress}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsList}>
          {/* Dark mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Moon size={16} color={COLORS.info} />
              </View>
              <Text style={styles.settingLabel}>Mode sombre</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: C.border2, true: COLORS.primaryBorder }}
              thumbColor={isDarkMode ? COLORS.primary : C.textMuted}
            />
          </View>
          {/* Other settings */}
          {SETTINGS_ROWS.map(({ icon: Icon, label }) => (
            <TouchableOpacity key={label} style={styles.settingRow} activeOpacity={0.8}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Icon size={16} color={C.textMuted} />
                </View>
                <Text style={styles.settingLabel}>{label}</Text>
              </View>
              <ChevronRight size={16} color={C.textHint} />
            </TouchableOpacity>
          ))}
          {/* Logout */}
          <TouchableOpacity style={[styles.settingRow, styles.settingRowDanger]} onPress={handleLogout} activeOpacity={0.8}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconWrap, styles.dangerIconWrap]}>
                <LogOut size={16} color={COLORS.primary} />
              </View>
              <Text style={[styles.settingLabel, styles.dangerLabel]}>Se deconnecter</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { paddingTop: 56, paddingHorizontal: SPACING.xl },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  pageTitle: { ...TYPOGRAPHY.h2, color: C.text },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  avatarLg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 2,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLgText: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  userInfo: { flex: 1, gap: SPACING.xs },
  userName: { ...TYPOGRAPHY.h4, color: C.text },
  userChurch: { ...TYPOGRAPHY.caption, color: C.textMuted },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  levelBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
  levelNum: {
    ...TYPOGRAPHY.micro,
    color: C.textHint,
    backgroundColor: C.surfaceElevated,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  xpCard: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  xpHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  xpLabel: { ...TYPOGRAPHY.label, color: C.textMuted },
  xpValues: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  xpBar: { height: 8, backgroundColor: C.surfaceElevated, borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  xpSub: { ...TYPOGRAPHY.caption, color: C.textHint },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 4,
    alignItems: 'center',
  },
  statValue: { ...TYPOGRAPHY.h3, color: C.text, fontSize: 20 },
  statLabel: { ...TYPOGRAPHY.micro, color: C.textMuted, textAlign: 'center' },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
  badgeCount: { ...TYPOGRAPHY.caption, color: C.textMuted },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  badgeItem: { alignItems: 'center', width: 60, gap: 6 },
  badgeItemLocked: { opacity: 0.4 },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surfaceElevated,
    borderWidth: 1,
    borderColor: C.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircleEarned: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primaryBorder,
  },
  badgeIcon: { fontSize: 18, color: COLORS.primary },
  badgeIconLocked: { color: C.textHint },
  badgeName: { ...TYPOGRAPHY.micro, color: C.textMuted, textAlign: 'center' },
  badgeNameLocked: { color: C.textHint },
  progressList: { gap: SPACING.sm },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  progressIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  progressInfo: { flex: 1, gap: 6 },
  progressTitle: { ...TYPOGRAPHY.caption, color: C.text, fontWeight: '500' },
  progressBarWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  progressBar: { flex: 1, height: 4, backgroundColor: C.surfaceElevated, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressPct: { ...TYPOGRAPHY.micro, color: C.textHint, width: 30, textAlign: 'right' },
  settingsList: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  settingRowDanger: { borderBottomWidth: 0 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconWrap: { backgroundColor: COLORS.primaryMuted },
  settingLabel: { ...TYPOGRAPHY.body, color: C.text, fontWeight: '500' },
  dangerLabel: { color: COLORS.primary },
});
