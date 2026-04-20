import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Bell, Flame, BookOpen, GraduationCap, Sword, Users, ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { router } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOW } from '../../constants/theme';
import {
  MOCK_USER,
  VERSE_OF_DAY,
  WEEK_STREAK,
  MOCK_BOOKS,
  MOCK_COURSES,
  MOCK_CHALLENGES,
  MOCK_COMMUNITY_POSTS,
} from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width } = Dimensions.get('window');

const POST_TYPE_COLORS: Record<string, string> = {
  blue: COLORS.info,
  green: COLORS.success,
  purple: COLORS.purple,
};

export default function HomeScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const book = MOCK_BOOKS[0];
  const challenge = MOCK_CHALLENGES[0];
  const post = MOCK_COMMUNITY_POSTS[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Bonjour, {MOCK_USER.firstName}</Text>
          <Text style={styles.church}>{MOCK_USER.church}</Text>
        </View>
        <View style={styles.topRight}>
          <View style={styles.streakBadge}>
            <Flame size={14} color={COLORS.warning} />
            <Text style={styles.streakCount}>{MOCK_USER.streakDays}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <Bell size={18} color={C.textMuted} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verse of the day */}
      <View style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <View style={styles.verseLabelWrap}>
            <Text style={styles.verseLabel}>Verset du Jour</Text>
          </View>
          <Text style={styles.verseTranslation}>{VERSE_OF_DAY.translation}</Text>
        </View>
        <Text style={styles.verseText}>{VERSE_OF_DAY.text}</Text>
        <Text style={styles.verseRef}>{VERSE_OF_DAY.reference}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard icon={<Flame size={16} color={COLORS.warning} />} value={MOCK_USER.streakDays} label="Jours streak" color={COLORS.warningBg} />
        <StatCard icon={<BookOpen size={16} color={COLORS.info} />} value={`${MOCK_USER.xp}`} label="XP totaux" color={COLORS.infoBg} />
        <StatCard icon={<Sword size={16} color={COLORS.purple} />} value={MOCK_USER.activeChallenges} label="Defis actifs" color={COLORS.purpleBg} />
      </View>

      {/* Weekly streak */}
      <View style={styles.section}>
        <SectionHeader title="Cette semaine" />
        <View style={styles.weekRow}>
          {WEEK_STREAK.map((day) => (
            <View key={day.day} style={styles.dayItem}>
              <View style={[
                styles.dayCircle,
                day.done && styles.dayCircleDone,
                day.today && styles.dayCircleToday,
              ]}>
                {day.done && !day.today && <View style={styles.dayCheck} />}
                {day.today && <View style={styles.dayTodayDot} />}
              </View>
              <Text style={[styles.dayLabel, day.today && styles.dayLabelToday]}>{day.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Continue reading */}
      <View style={styles.section}>
        <SectionHeader title="Continuer la lecture" action="Voir tout" />
        <TouchableOpacity style={styles.bookCard} activeOpacity={0.85} onPress={() => router.push(`/book/${book.id}`)}>
          <View style={[styles.bookCover, { backgroundColor: book.coverGradient[0] }]}>
            <View style={styles.bookCoverInner} />
          </View>
          <View style={styles.bookInfo}>
            <View style={styles.bookMeta}>
              <Text style={styles.bookCategory}>{book.category}</Text>
              <Text style={styles.bookChapter}>Ch. {book.currentChapter}/{book.chapters}</Text>
            </View>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            <View style={styles.progressWrap}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
              </View>
              <Text style={styles.progressPct}>{book.progress}%</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modules grid */}
      <View style={styles.section}>
        <SectionHeader title="Modules" />
        <View style={styles.modulesGrid}>
          <ModuleCard icon={<BookOpen size={20} color={COLORS.info} />} label="Lectures" bg={COLORS.infoBg} count={MOCK_BOOKS.length} />
          <ModuleCard icon={<GraduationCap size={20} color={COLORS.gold} />} label="Formations" bg="rgba(212,175,55,0.12)" count={MOCK_COURSES.length} />
          <ModuleCard icon={<Sword size={20} color={COLORS.purple} />} label="Defis" bg={COLORS.purpleBg} count={MOCK_CHALLENGES.length} />
          <ModuleCard icon={<Users size={20} color={COLORS.success} />} label="Communaute" bg={COLORS.successBg} count={3} />
        </View>
      </View>

      {/* Active challenge */}
      <View style={styles.section}>
        <SectionHeader title="Defi en cours" action="Tous les defis" />
        <TouchableOpacity style={styles.challengeCard} activeOpacity={0.85} onPress={() => router.push(`/challenge/${challenge.id}`)}>
          <View style={styles.challengeHeader}>
            <View style={styles.challengeIconWrap}>
              <Sword size={18} color={COLORS.purple} />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeCategory}>{challenge.category}</Text>
            </View>
            <View style={styles.challengeDayBadge}>
              <Text style={styles.challengeDayText}>J.{challenge.currentDay}</Text>
            </View>
          </View>
          <View style={styles.progressWrap}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.progressFillPurple, { width: `${(challenge.currentDay / challenge.days) * 100}%` }]} />
            </View>
            <Text style={styles.progressPct}>{challenge.currentDay}/{challenge.days}j</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Community preview */}
      <View style={styles.section}>
        <SectionHeader title="Communaute" action="Voir tout" />
        <TouchableOpacity style={styles.communityCard} activeOpacity={0.85} onPress={() => router.push(`/community/post/${post.id}`)}>
          <View style={styles.communityHeader}>
            <View style={[styles.typeTag, { backgroundColor: `${POST_TYPE_COLORS[post.typeColor]}18` }]}>
              <Text style={[styles.typeTagText, { color: POST_TYPE_COLORS[post.typeColor] }]}>{post.type}</Text>
            </View>
            <Text style={styles.communityTime}>{post.timeAgo}</Text>
          </View>
          <Text style={styles.communityAuthor}>{post.authorName}</Text>
          <Text style={styles.communityBody} numberOfLines={2}>{post.body}</Text>
          {post.verse && (
            <View style={styles.communityVerse}>
              <Text style={styles.communityVerseText}>{post.verse}</Text>
              <Text style={styles.communityVerseRef}>{post.verseRef}</Text>
            </View>
          )}
          <View style={styles.communityFooter}>
            <Text style={styles.communityPrayers}>{post.prayerCount} prieres</Text>
            <Text style={styles.communityReplies}>{post.replyCount} reponses</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity style={styles.sectionAction} activeOpacity={0.7}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <ChevronRight size={13} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <View style={[statCardStyle, { backgroundColor: color }]}>
      {icon}
      <Text style={statValueStyle}>{value}</Text>
      <Text style={statLabelStyle}>{label}</Text>
    </View>
  );
}

function ModuleCard({ icon, label, bg, count }: { icon: React.ReactNode; label: string; bg: string; count: number }) {
  return (
    <TouchableOpacity style={[moduleCardStyle, { backgroundColor: bg }]} activeOpacity={0.8}>
      <View>{icon}</View>
      <Text style={moduleLabelStyle}>{label}</Text>
      <Text style={moduleCountStyle}>{count}</Text>
    </TouchableOpacity>
  );
}

// Static styles for pure display sub-components (StatCard, ModuleCard)
const statCardStyle: any = {
  flex: 1,
  borderRadius: RADIUS.md,
  padding: SPACING.md,
  gap: 4,
  alignItems: 'center',
};
const statValueStyle: any = { ...TYPOGRAPHY.h3, color: '#FFFFFF', fontSize: 20 };
const statLabelStyle: any = { ...TYPOGRAPHY.micro, color: 'rgba(255,255,255,0.7)', textAlign: 'center' };
const moduleCardStyle: any = {
  width: (width - SPACING.xl * 2 - SPACING.sm) / 2,
  borderRadius: RADIUS.card,
  padding: SPACING.lg,
  gap: SPACING.sm,
};
const moduleLabelStyle: any = { ...TYPOGRAPHY.bodyLarge, color: '#FFFFFF' };
const moduleCountStyle: any = { ...TYPOGRAPHY.micro, color: 'rgba(255,255,255,0.7)' };

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.bg,
    },
    content: {
      paddingTop: 56,
      paddingHorizontal: SPACING.xl,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    greeting: {
      ...TYPOGRAPHY.h3,
      color: C.text,
    },
    church: {
      ...TYPOGRAPHY.caption,
      color: C.textMuted,
      marginTop: 2,
    },
    topRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: COLORS.warningBg,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 5,
      borderRadius: RADIUS.full,
    },
    streakCount: {
      ...TYPOGRAPHY.label,
      color: COLORS.warning,
      fontSize: 11,
    },
    bellBtn: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.full,
      backgroundColor: C.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellDot: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: COLORS.primary,
      borderWidth: 1.5,
      borderColor: C.bg,
    },
    verseCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
      padding: SPACING.lg,
      marginBottom: SPACING.xl,
      gap: SPACING.sm,
    },
    verseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    verseLabelWrap: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
    },
    verseLabel: {
      ...TYPOGRAPHY.micro,
      color: COLORS.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    verseTranslation: {
      ...TYPOGRAPHY.micro,
      color: C.textHint,
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
    statsRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.xl,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      ...TYPOGRAPHY.h4,
      color: C.text,
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    sectionActionText: {
      ...TYPOGRAPHY.caption,
      color: COLORS.primary,
      fontWeight: '600',
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
    },
    dayItem: {
      alignItems: 'center',
      gap: SPACING.xs,
    },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: C.border,
    },
    dayCircleDone: {
      backgroundColor: COLORS.successBg,
      borderColor: COLORS.success,
    },
    dayCircleToday: {
      backgroundColor: COLORS.primaryMuted,
      borderColor: COLORS.primaryBorder,
    },
    dayCheck: {
      width: 12,
      height: 8,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: COLORS.success,
      transform: [{ rotate: '-45deg' }, { translateY: -1 }],
    },
    dayTodayDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.primary,
    },
    dayLabel: {
      ...TYPOGRAPHY.micro,
      color: C.textHint,
    },
    dayLabelToday: {
      color: COLORS.primary,
      fontWeight: '700',
    },
    bookCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    bookCover: {
      width: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookCoverInner: {
      width: 40,
      height: 56,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 4,
    },
    bookInfo: {
      flex: 1,
      padding: SPACING.md,
      gap: SPACING.xs,
    },
    bookMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bookCategory: {
      ...TYPOGRAPHY.micro,
      color: COLORS.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    bookChapter: {
      ...TYPOGRAPHY.micro,
      color: C.textHint,
    },
    bookTitle: {
      ...TYPOGRAPHY.bodyLarge,
      color: C.text,
    },
    bookAuthor: {
      ...TYPOGRAPHY.caption,
      color: C.textMuted,
    },
    progressWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      marginTop: 4,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: C.surfaceElevated,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 2,
    },
    progressFillPurple: {
      backgroundColor: COLORS.purple,
    },
    progressPct: {
      ...TYPOGRAPHY.micro,
      color: C.textHint,
      width: 30,
      textAlign: 'right',
    },
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    challengeCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.md,
    },
    challengeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
    },
    challengeIconWrap: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.sm,
      backgroundColor: COLORS.purpleBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    challengeInfo: {
      flex: 1,
    },
    challengeTitle: {
      ...TYPOGRAPHY.bodyLarge,
      color: C.text,
    },
    challengeCategory: {
      ...TYPOGRAPHY.caption,
      color: C.textMuted,
      marginTop: 2,
    },
    challengeDayBadge: {
      backgroundColor: COLORS.purpleBg,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
    },
    challengeDayText: {
      ...TYPOGRAPHY.label,
      color: COLORS.purple,
      fontSize: 10,
    },
    communityCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },
    communityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    typeTag: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      borderRadius: RADIUS.full,
    },
    typeTagText: {
      ...TYPOGRAPHY.micro,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    communityTime: {
      ...TYPOGRAPHY.micro,
      color: C.textHint,
    },
    communityAuthor: {
      ...TYPOGRAPHY.label,
      color: C.textMuted,
      fontSize: 10,
    },
    communityBody: {
      ...TYPOGRAPHY.body,
      color: C.text,
      lineHeight: 20,
    },
    communityVerse: {
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm,
      gap: 2,
    },
    communityVerseText: {
      ...TYPOGRAPHY.caption,
      color: C.textMuted,
      fontStyle: 'italic',
    },
    communityVerseRef: {
      ...TYPOGRAPHY.micro,
      color: COLORS.primary,
    },
    communityFooter: {
      flexDirection: 'row',
      gap: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingTop: SPACING.sm,
    },
    communityPrayers: {
      ...TYPOGRAPHY.caption,
      color: COLORS.info,
      fontWeight: '600',
    },
    communityReplies: {
      ...TYPOGRAPHY.caption,
      color: C.textMuted,
    },
  });
}
