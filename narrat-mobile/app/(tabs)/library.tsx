import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Search, Star, Headphones, Download, BookOpen, ChevronRight, Filter } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { router } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, RADIUS, TYPOGRAPHY, FONTS } from '../../constants/theme';
import { MOCK_BOOKS } from '../../data/mockData';

const { width } = Dimensions.get('window');
const FILTERS = ['Tous', 'En cours', 'Croissance spirituelle', 'Priere', 'Theologie', 'Biographie'];

export default function LibraryScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const featured = MOCK_BOOKS[0];
  const filtered = MOCK_BOOKS.filter((b) => {
    const matchQuery = !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase());
    const matchFilter =
      activeFilter === 'Tous' ||
      b.category === activeFilter ||
      b.tags.some((t) => activeFilter.includes(t)) ||
      (activeFilter === 'En cours' && b.progress > 0);
    return matchQuery && matchFilter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Bibliotheque</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Filter size={16} color={C.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Search size={15} color={C.textHint} />
        <TextInput style={styles.searchInput} placeholder="Chercher un livre ou auteur..." placeholderTextColor={C.textHint} value={query} onChangeText={setQuery} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)} activeOpacity={0.8}>
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!query && activeFilter === 'Tous' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>A la une</Text>
          </View>
          <TouchableOpacity style={[styles.featuredCard, { backgroundColor: featured.coverGradient[0] }]} activeOpacity={0.85} onPress={() => router.push(`/book/${featured.id}`)}>
            <View style={styles.featuredOverlay} />
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>{featured.category}</Text>
              </View>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredAuthor}>{featured.author}</Text>
              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
                  <Text style={styles.ratingText}>{featured.rating}</Text>
                </View>
                {featured.hasAudio && (
                  <View style={styles.audioBadge}>
                    <Headphones size={12} color={COLORS.info} />
                    <Text style={styles.audioBadgeText}>Audio</Text>
                  </View>
                )}
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${featured.progress}%` }]} />
                </View>
                <Text style={styles.progressPct}>{featured.progress}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{query || activeFilter !== 'Tous' ? 'Resultats' : 'Tous les livres'}</Text>
          <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Trier</Text>
            <ChevronRight size={13} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.bookList}>
          {filtered.map((book) => (
            <TouchableOpacity key={book.id} style={styles.bookRow} activeOpacity={0.85} onPress={() => router.push(`/book/${book.id}`)}>
              <View style={[styles.bookCover, { backgroundColor: book.coverGradient[0] }]}>
                <BookOpen size={18} color="rgba(255,255,255,0.5)" />
              </View>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author} · {book.year}</Text>
                <View style={styles.bookTags}>
                  {book.tags.slice(0, 2).map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.bookRight}>
                <View style={styles.ratingRow}>
                  <Star size={11} color={COLORS.gold} fill={COLORS.gold} />
                  <Text style={styles.ratingSmall}>{book.rating}</Text>
                </View>
                <View style={styles.bookIcons}>
                  {book.hasAudio && <Headphones size={14} color={COLORS.info} />}
                  {book.isDownloadable && <Download size={14} color={C.textHint} />}
                </View>
                {book.progress > 0 && (
                  <View style={styles.progressDot}>
                    <Text style={styles.progressDotText}>{book.progress}%</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun livre trouve</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    content: { paddingTop: 56, paddingHorizontal: SPACING.xl },
    pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
    pageTitle: { ...TYPOGRAPHY.h2, color: C.text },
    iconBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
    searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: C.border, paddingHorizontal: SPACING.md, height: 44, gap: SPACING.sm, marginBottom: SPACING.md },
    searchInput: { flex: 1, ...TYPOGRAPHY.body, color: C.text },
    filtersScroll: { marginBottom: SPACING.xl },
    filtersContent: { gap: SPACING.sm, paddingRight: SPACING.xl },
    filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border2 },
    filterChipActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
    filterChipText: { ...TYPOGRAPHY.caption, color: C.textMuted },
    filterChipTextActive: { fontFamily: FONTS.bold, color: COLORS.primary },
    section: { marginBottom: SPACING.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    seeAllText: { ...TYPOGRAPHY.caption, fontFamily: FONTS.semiBold, color: COLORS.primary },
    featuredCard: { height: 200, borderRadius: RADIUS.card, overflow: 'hidden', justifyContent: 'flex-end' },
    featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    featuredContent: { padding: SPACING.lg, gap: SPACING.xs },
    featuredBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.primaryMuted, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 3, marginBottom: SPACING.xs },
    featuredBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.6 },
    featuredTitle: { ...TYPOGRAPHY.h3, color: '#FFFFFF' },
    featuredAuthor: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)' },
    metaRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { ...TYPOGRAPHY.caption, fontFamily: FONTS.semiBold, color: COLORS.gold },
    audioBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.infoBg, borderRadius: RADIUS.full, paddingHorizontal: 6, paddingVertical: 2 },
    audioBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.info },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
    progressBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
    progressPct: { ...TYPOGRAPHY.micro, color: 'rgba(255,255,255,0.7)' },
    bookList: { gap: SPACING.sm },
    bookRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: RADIUS.card, borderWidth: 1, borderColor: C.border, padding: SPACING.md, gap: SPACING.md },
    bookCover: { width: 48, height: 64, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
    bookInfo: { flex: 1, gap: 4 },
    bookTitle: { ...TYPOGRAPHY.h5, color: C.text },
    bookAuthor: { ...TYPOGRAPHY.caption, color: C.textMuted },
    bookTags: { flexDirection: 'row', gap: SPACING.xs, marginTop: 2 },
    tagChip: { backgroundColor: C.surfaceElevated, borderRadius: RADIUS.full, paddingHorizontal: SPACING.xs + 2, paddingVertical: 2 },
    tagText: { ...TYPOGRAPHY.micro, color: C.textHint },
    bookRight: { alignItems: 'flex-end', gap: SPACING.xs },
    ratingSmall: { ...TYPOGRAPHY.micro, fontFamily: FONTS.semiBold, color: COLORS.gold },
    bookIcons: { flexDirection: 'row', gap: SPACING.xs },
    progressDot: { backgroundColor: COLORS.primaryMuted, borderRadius: RADIUS.full, paddingHorizontal: 5, paddingVertical: 2 },
    progressDotText: { ...TYPOGRAPHY.micro, color: COLORS.primary },
    emptyState: { paddingVertical: SPACING.xxxl, alignItems: 'center' },
    emptyText: { ...TYPOGRAPHY.body, color: C.textHint },
  });
}
