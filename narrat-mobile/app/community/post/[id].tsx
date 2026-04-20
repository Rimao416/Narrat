import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../../constants/theme';
import { MOCK_COMMUNITY_POSTS, MOCK_POST_REPLIES } from '../../../data/mockData';
import { useThemeColors } from '../../../hooks/useThemeColors';

const POST_TYPE_COLORS: Record<string, string> = {
  blue: COLORS.info,
  green: COLORS.success,
  purple: COLORS.purple,
};

export default function PostDetailScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = MOCK_COMMUNITY_POSTS.find((p) => p.id === id) ?? MOCK_COMMUNITY_POSTS[0];
  const replies = MOCK_POST_REPLIES.filter((r) => r.postId === (id ?? '1'));

  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);
  const [prayCount, setPrayCount] = useState(post.prayerCount);

  const contentOp = useSharedValue(0);
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 12 }],
  }));

  useEffect(() => {
    contentOp.value = withTiming(1, { duration: 350 });
  }, []);

  const handlePray = () => {
    setLiked(!liked);
    setPrayCount((c) => c + (liked ? -1 : 1));
  };

  const typeColor = POST_TYPE_COLORS[post.typeColor] ?? COLORS.info;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={contentStyle}>
          {/* Main post */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={[styles.typeTag, { backgroundColor: typeColor + '18' }]}>
                <Text style={[styles.typeTagText, { color: typeColor }]}>{post.type}</Text>
              </View>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>
            <View style={styles.authorRow}>
              <View style={[styles.avatar, post.isAnonymous && styles.avatarAnon]}>
                <Text style={styles.avatarText}>{post.isAnonymous ? '?' : post.authorName[0]}</Text>
              </View>
              <Text style={styles.authorName}>{post.authorName}</Text>
            </View>
            <Text style={styles.postBody}>{post.body}</Text>
            {post.verse && (
              <View style={styles.verseBlock}>
                <Text style={styles.verseText}>{post.verse}</Text>
                <Text style={styles.verseRef}>{post.verseRef}</Text>
              </View>
            )}

            {/* Stats row */}
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statPill} onPress={handlePray} activeOpacity={0.8}>
                <Heart size={14} color={liked ? COLORS.primary : COLORS.info} fill={liked ? COLORS.primary : 'transparent'} />
                <Text style={[styles.statPillText, liked && styles.statPillTextActive]}>{prayCount} prieres</Text>
              </TouchableOpacity>
              <View style={styles.statPill}>
                <MessageCircle size={14} color={C.textMuted} />
                <Text style={[styles.statPillText, { color: C.textMuted }]}>{replies.length} reponses</Text>
              </View>
            </View>
          </View>

          {/* Replies */}
          <Text style={styles.repliesTitle}>{replies.length} reponse(s)</Text>
          <View style={styles.replyList}>
            {replies.map((reply, i) => (
              <Animated.View
                key={reply.id}
                style={useAnimatedStyle(() => ({ opacity: contentOp.value }))}
              >
                <View style={styles.replyCard}>
                  <View style={styles.replyHeader}>
                    <View style={[styles.replyAvatar, reply.isAnonymous && styles.avatarAnon]}>
                      <Text style={styles.replyAvatarText}>
                        {reply.isAnonymous ? '?' : reply.authorName[0]}
                      </Text>
                    </View>
                    <View style={styles.replyMeta}>
                      <Text style={styles.replyAuthor}>{reply.authorName}</Text>
                      <Text style={styles.replyTime}>{reply.timeAgo}</Text>
                    </View>
                    <TouchableOpacity style={styles.replyPrayBtn} activeOpacity={0.8}>
                      <Heart size={13} color={COLORS.info} />
                      <Text style={styles.replyPrayCount}>{reply.prayerCount}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.replyBody}>{reply.body}</Text>
                  {reply.verse && (
                    <View style={styles.replyVerseBlock}>
                      <Text style={styles.replyVerseText}>{reply.verse}</Text>
                      <Text style={styles.replyVerseRef}>{reply.verseRef}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>

      {/* Reply input */}
      <View style={styles.replyBar}>
        <TextInput
          style={styles.replyInput}
          placeholder="Repondre..."
          placeholderTextColor={C.textHint}
          value={replyText}
          onChangeText={setReplyText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
          activeOpacity={replyText.trim() ? 0.85 : 1}
          onPress={() => { if (replyText.trim()) setReplyText(''); }}
        >
          <Send size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 52,
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { ...TYPOGRAPHY.h4, color: C.text },
    scroll: { flex: 1 },
    scrollContent: { padding: SPACING.xl },
    postCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.sm,
      marginBottom: SPACING.xl,
    },
    postHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    typeTag: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
    typeTagText: { ...TYPOGRAPHY.micro, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    postTime: { ...TYPOGRAPHY.micro, color: C.textHint },
    authorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primaryMuted,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarAnon: { backgroundColor: C.surfaceElevated, borderColor: C.border2 },
    avatarText: { ...TYPOGRAPHY.label, color: COLORS.primary, fontWeight: '700' },
    authorName: { ...TYPOGRAPHY.label, color: C.textMuted },
    postBody: { ...TYPOGRAPHY.body, color: C.text, lineHeight: 24 },
    verseBlock: {
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm,
      borderLeftWidth: 2,
      borderLeftColor: COLORS.primary,
      gap: 4,
    },
    verseText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontStyle: 'italic' },
    verseRef: { ...TYPOGRAPHY.micro, color: COLORS.primary },
    statsRow: {
      flexDirection: 'row',
      gap: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingTop: SPACING.sm,
    },
    statPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: 6,
    },
    statPillText: { ...TYPOGRAPHY.caption, color: COLORS.info, fontWeight: '600' },
    statPillTextActive: { color: COLORS.primary },
    repliesTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
    replyList: { gap: SPACING.md },
    replyCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
      gap: SPACING.sm,
    },
    replyHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    replyAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: COLORS.primaryMuted,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    replyAvatarText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
    replyMeta: { flex: 1, gap: 1 },
    replyAuthor: { ...TYPOGRAPHY.label, color: C.text, fontSize: 12, fontWeight: '600' },
    replyTime: { ...TYPOGRAPHY.micro, color: C.textHint },
    replyPrayBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    replyPrayCount: { ...TYPOGRAPHY.micro, color: COLORS.info, fontWeight: '600' },
    replyBody: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
    replyVerseBlock: {
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm,
      borderLeftWidth: 2,
      borderLeftColor: COLORS.primary,
      gap: 3,
    },
    replyVerseText: { ...TYPOGRAPHY.micro, color: C.textMuted, fontStyle: 'italic' },
    replyVerseRef: { ...TYPOGRAPHY.micro, color: COLORS.primary },
    replyBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.sm,
      paddingBottom: 28,
      borderTopWidth: 1,
      borderTopColor: C.border,
      backgroundColor: C.bg,
    },
    replyInput: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: SPACING.md,
      paddingVertical: 10,
      ...TYPOGRAPHY.body,
      color: C.text,
      maxHeight: 100,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: C.surfaceElevated },
  });
}
