import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Heart, MessageCircle, Users, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_COMMUNITY_POSTS, MOCK_GROUPS } from '../../data/mockData';

const C = COLORS.dark;

const TABS = ['Fil', 'Groupes', 'Priere'];

const POST_TYPE_COLORS: Record<string, string> = {
  blue: COLORS.info,
  green: COLORS.success,
  purple: COLORS.purple,
};

const GROUP_ICON_COLORS = [COLORS.primary, COLORS.purple, COLORS.info, COLORS.warning, COLORS.success];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Fil');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Communaute</Text>
        <View style={styles.privacyBadge}>
          <Lock size={11} color={COLORS.success} />
          <Text style={styles.privacyText}>Espace prive</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Fil' && <FeedTab />}
        {activeTab === 'Groupes' && <GroupsTab />}
        {activeTab === 'Priere' && <PrayerTab />}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/community/new-post')}>
        <Plus size={22} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function FeedTab() {
  return (
    <View style={styles.feedList}>
      {MOCK_COMMUNITY_POSTS.map((post) => (
        <TouchableOpacity key={post.id} style={styles.postCard} activeOpacity={0.85} onPress={() => router.push(`/community/post/${post.id}`)}>
          <View style={styles.postHeader}>
            <View style={[styles.typeTag, { backgroundColor: `${POST_TYPE_COLORS[post.typeColor]}18` }]}>
              <Text style={[styles.typeTagText, { color: POST_TYPE_COLORS[post.typeColor] }]}>{post.type}</Text>
            </View>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>
          <View style={styles.postAuthorRow}>
            <View style={[styles.avatar, post.isAnonymous && styles.avatarAnon]}>
              <Text style={styles.avatarText}>{post.isAnonymous ? '?' : post.authorName[0]}</Text>
            </View>
            <Text style={styles.postAuthor}>{post.authorName}</Text>
          </View>
          <Text style={styles.postBody}>{post.body}</Text>
          {post.verse && (
            <View style={styles.verseQuote}>
              <Text style={styles.verseText}>{post.verse}</Text>
              <Text style={styles.verseRef}>{post.verseRef}</Text>
            </View>
          )}
          <View style={styles.postFooter}>
            <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
              <Heart size={14} color={COLORS.info} />
              <Text style={styles.reactionCount}>{post.prayerCount} prieres</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
              <MessageCircle size={14} color={C.textMuted} />
              <Text style={[styles.reactionCount, { color: C.textMuted }]}>{post.replyCount} reponses</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function GroupsTab() {
  return (
    <View style={styles.groupList}>
      <Text style={styles.groupIntro}>Des espaces anonymes et securises pour partager vos combats.</Text>
      {MOCK_GROUPS.map((group, i) => (
        <TouchableOpacity key={group.id} style={styles.groupCard} activeOpacity={0.85}>
          <View style={[styles.groupIcon, { backgroundColor: `${GROUP_ICON_COLORS[i % GROUP_ICON_COLORS.length]}18` }]}>
            <Users size={18} color={GROUP_ICON_COLORS[i % GROUP_ICON_COLORS.length]} />
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.memberCount} membres</Text>
          </View>
          <TouchableOpacity
            style={[styles.joinBtn, group.joined && styles.joinBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.joinBtnText, group.joined && styles.joinBtnTextActive]}>
              {group.joined ? 'Rejoint' : 'Rejoindre'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PrayerTab() {
  const prayerPosts = MOCK_COMMUNITY_POSTS.filter((p) => p.type === 'Priere');
  return (
    <View style={styles.feedList}>
      <View style={styles.prayerHeader}>
        <Text style={styles.prayerTitle}>Demandes de priere</Text>
        <Text style={styles.prayerSub}>Intercedez pour vos freres et soeurs</Text>
      </View>
      {prayerPosts.map((post) => (
        <TouchableOpacity key={post.id} style={styles.postCard} activeOpacity={0.85} onPress={() => router.push(`/community/post/${post.id}`)}>
          <View style={styles.postAuthorRow}>
            <View style={[styles.avatar, post.isAnonymous && styles.avatarAnon]}>
              <Text style={styles.avatarText}>{post.isAnonymous ? '?' : post.authorName[0]}</Text>
            </View>
            <View>
              <Text style={styles.postAuthor}>{post.authorName}</Text>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>
          </View>
          <Text style={styles.postBody}>{post.body}</Text>
          <TouchableOpacity style={styles.prayBtn} activeOpacity={0.85}>
            <Heart size={14} color="#FFF" />
            <Text style={styles.prayBtnText}>Je prie ({post.prayerCount})</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: 56,
    paddingBottom: SPACING.md,
  },
  pageTitle: { ...TYPOGRAPHY.h2, color: C.text },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  privacyText: { ...TYPOGRAPHY.micro, color: COLORS.success, fontWeight: '600' },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
  tabText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '600' },
  tabTextActive: { color: COLORS.primary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl },
  feedList: { gap: SPACING.md },
  postCard: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeTag: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  typeTagText: { ...TYPOGRAPHY.micro, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  postTime: { ...TYPOGRAPHY.micro, color: C.textHint },
  postAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarAnon: { backgroundColor: C.surfaceElevated, borderColor: C.border2 },
  avatarText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700' },
  postAuthor: { ...TYPOGRAPHY.label, color: C.textMuted, fontSize: 11 },
  postBody: { ...TYPOGRAPHY.body, color: C.text, lineHeight: 21 },
  verseQuote: {
    backgroundColor: C.surfaceElevated,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: 3,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  verseText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontStyle: 'italic' },
  verseRef: { ...TYPOGRAPHY.micro, color: COLORS.primary },
  postFooter: { flexDirection: 'row', gap: SPACING.xl, borderTopWidth: 1, borderTopColor: C.border, paddingTop: SPACING.sm },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  reactionCount: { ...TYPOGRAPHY.caption, color: COLORS.info, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: SPACING.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  groupList: { gap: SPACING.md },
  groupIntro: { ...TYPOGRAPHY.body, color: C.textMuted, marginBottom: SPACING.sm },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  groupIcon: { width: 44, height: 44, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  groupInfo: { flex: 1 },
  groupName: { ...TYPOGRAPHY.bodyLarge, color: C.text },
  groupMembers: { ...TYPOGRAPHY.caption, color: C.textMuted, marginTop: 2 },
  joinBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: C.surfaceElevated,
    borderWidth: 1,
    borderColor: C.border2,
  },
  joinBtnActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
  joinBtnText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '600' },
  joinBtnTextActive: { color: COLORS.primary },
  prayerHeader: { marginBottom: SPACING.md },
  prayerTitle: { ...TYPOGRAPHY.h4, color: C.text },
  prayerSub: { ...TYPOGRAPHY.caption, color: C.textMuted, marginTop: 3 },
  prayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
  },
  prayBtnText: { ...TYPOGRAPHY.caption, color: '#FFF', fontWeight: '700' },
});
