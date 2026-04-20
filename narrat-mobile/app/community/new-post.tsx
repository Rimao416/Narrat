import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { X, Heart, BookOpen, HelpCircle, MessageCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const C = COLORS.dark;
const MAX_CHARS = 500;

const POST_TYPES = [
  { id: 'priere', label: 'Priere', icon: Heart, color: COLORS.info },
  { id: 'temoignage', label: 'Temoignage', icon: BookOpen, color: COLORS.success },
  { id: 'question', label: 'Question', icon: HelpCircle, color: COLORS.purple },
  { id: 'reflexion', label: 'Reflexion', icon: MessageCircle, color: COLORS.gold },
];

const VISIBILITY = [
  { id: 'communaute', label: 'Communaute' },
  { id: 'groupe', label: 'Mon groupe' },
  { id: 'priere', label: 'Groupe Priere' },
];

export default function NewPostScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [visibility, setVisibility] = useState('communaute');
  const [verse, setVerse] = useState('');

  const containerOp = useSharedValue(0);
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOp.value,
    transform: [{ translateY: (1 - containerOp.value) * 30 }],
  }));

  useEffect(() => {
    containerOp.value = withTiming(1, { duration: 350 });
  }, []);

  const canPublish = selectedType && body.trim().length >= 10;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <X size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau message</Text>
        <TouchableOpacity
          style={[styles.publishBtn, !canPublish && styles.publishBtnDisabled]}
          activeOpacity={canPublish ? 0.85 : 1}
          onPress={() => canPublish && router.back()}
        >
          <Text style={[styles.publishBtnText, !canPublish && styles.publishBtnTextDisabled]}>Publier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={containerStyle}>
          {/* Type selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de message</Text>
            <View style={styles.typeGrid}>
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <TypeCard
                    key={type.id}
                    type={type}
                    isSelected={isSelected}
                    onPress={() => setSelectedType(type.id)}
                  />
                );
              })}
            </View>
          </View>

          {/* Anonymous toggle */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Publier anonymement</Text>
                <Text style={styles.toggleSub}>Votre nom ne sera pas visible</Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: C.border2, true: COLORS.primaryBorder }}
                thumbColor={isAnonymous ? COLORS.primary : C.textMuted}
              />
            </View>
          </View>

          {/* Text area */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Votre message</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Partagez ce que vous avez sur le coeur..."
              placeholderTextColor={C.textHint}
              multiline
              numberOfLines={6}
              value={body}
              onChangeText={(t) => setBody(t.slice(0, MAX_CHARS))}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{body.length}/{MAX_CHARS}</Text>
          </View>

          {/* Verse picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajouter un verset (optionnel)</Text>
            <TextInput
              style={styles.verseInput}
              placeholder="ex. Jean 3:16 — Rechercher..."
              placeholderTextColor={C.textHint}
              value={verse}
              onChangeText={setVerse}
            />
          </View>

          {/* Visibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visibilite</Text>
            <View style={styles.visibilityRow}>
              {VISIBILITY.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.visBtn, visibility === v.id && styles.visBtnActive]}
                  onPress={() => setVisibility(v.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.visBtnText, visibility === v.id && styles.visBtnTextActive]}>
                    {v.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: SPACING.xl }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function TypeCard({ type, isSelected, onPress }: { type: any; isSelected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const Icon = type.icon;

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 10 }, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <Animated.View style={scaleStyle}>
      <TouchableOpacity
        style={[styles.typeCard, isSelected && styles.typeCardActive, isSelected && { borderColor: type.color + '60' }]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={[styles.typeIconWrap, { backgroundColor: type.color + '18' }]}>
          <Icon size={20} color={type.color} />
        </View>
        <Text style={[styles.typeCardLabel, isSelected && { color: type.color }]}>{type.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h4, color: C.text },
  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
  },
  publishBtnDisabled: { backgroundColor: C.surfaceElevated },
  publishBtnText: { ...TYPOGRAPHY.caption, color: '#FFF', fontWeight: '700' },
  publishBtnTextDisabled: { color: C.textHint },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  typeCard: {
    width: '47%',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  typeCardActive: { backgroundColor: C.surfaceElevated },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCardLabel: { ...TYPOGRAPHY.label, color: C.textMuted, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
  },
  toggleInfo: { flex: 1, gap: 3 },
  toggleLabel: { ...TYPOGRAPHY.body, color: C.text, fontWeight: '500' },
  toggleSub: { ...TYPOGRAPHY.caption, color: C.textHint },
  textarea: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    ...TYPOGRAPHY.body,
    color: C.text,
    minHeight: 130,
    lineHeight: 22,
  },
  charCount: { ...TYPOGRAPHY.micro, color: C.textHint, textAlign: 'right', marginTop: 6 },
  verseInput: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    ...TYPOGRAPHY.body,
    color: C.text,
  },
  visibilityRow: { flexDirection: 'row', gap: SPACING.sm },
  visBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  visBtnActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
  visBtnText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '600' },
  visBtnTextActive: { color: COLORS.primary },
});
