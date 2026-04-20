import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Moon, Globe, ChevronRight, Shield, HelpCircle, LogOut, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeStore } from '../../store/themeStore';
import { useOnboardingStore } from '../../store/onboardingStore';

const C = COLORS.dark;

const LANGUAGES = [
  { id: 'fr', label: 'Francais' },
  { id: 'en', label: 'English' },
  { id: 'ln', label: 'Lingala' },
  { id: 'sw', label: 'Swahili' },
];

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { reset } = useOnboardingStore();

  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifStreak, setNotifStreak] = useState(true);
  const [selectedLang, setSelectedLang] = useState('fr');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const handleLogout = () => {
    reset();
    router.replace('/(onboarding)');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Section: Compte */}
        <Text style={styles.groupLabel}>Compte</Text>
        <View style={styles.group}>
          <SettingRow icon={Shield} label="Confidentialite & securite" showChevron />
          <SettingRow icon={Globe} label="Langue de l'application" showChevron last>
            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.langChip, selectedLang === l.id && styles.langChipActive]}
                  onPress={() => setSelectedLang(l.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langChipText, selectedLang === l.id && styles.langChipTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>
        </View>

        {/* Section: Notifications */}
        <Text style={styles.groupLabel}>Notifications</Text>
        <View style={styles.group}>
          <ToggleRow
            icon={Bell}
            label="Notifications push"
            sub="Rappels, mises a jour"
            value={notifPush}
            onToggle={() => setNotifPush(!notifPush)}
          />
          <ToggleRow
            icon={Bell}
            label="Rappel de streak"
            sub="Ne manquez aucun jour"
            value={notifStreak}
            onToggle={() => setNotifStreak(!notifStreak)}
          />
          <ToggleRow
            icon={Bell}
            label="Notifications email"
            sub="Resumes hebdomadaires"
            value={notifEmail}
            onToggle={() => setNotifEmail(!notifEmail)}
            last
          />
        </View>

        {/* Section: Apparence */}
        <Text style={styles.groupLabel}>Apparence</Text>
        <View style={styles.group}>
          <ToggleRow
            icon={Moon}
            label="Mode sombre"
            value={isDarkMode}
            onToggle={toggleTheme}
          />
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <Text style={styles.settingLabel}>Taille du texte</Text>
            <View style={styles.fontSizeRow}>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.fontSizeBtn, fontSize === size && styles.fontSizeBtnActive]}
                  onPress={() => setFontSize(size)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.fontSizeBtnText, fontSize === size && styles.fontSizeBtnTextActive]}>
                    {size === 'sm' ? 'A' : size === 'md' ? 'A' : 'A'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section: Contenu */}
        <Text style={styles.groupLabel}>Contenu</Text>
        <View style={styles.group}>
          <SettingRow icon={Globe} label="Version de la Bible" showChevron />
          <SettingRow icon={Shield} label="Filtres de contenu" showChevron last />
        </View>

        {/* Section: Support */}
        <Text style={styles.groupLabel}>Support</Text>
        <View style={styles.group}>
          <SettingRow icon={HelpCircle} label="Centre d'aide" showChevron />
          <SettingRow icon={HelpCircle} label="Nous contacter" showChevron />
          <SettingRow icon={Shield} label="Conditions d'utilisation" showChevron last />
        </View>

        {/* Danger zone */}
        <View style={styles.dangerGroup}>
          <TouchableOpacity style={styles.dangerRow} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut size={16} color={COLORS.primary} />
            <Text style={styles.dangerText}>Se deconnecter</Text>
          </TouchableOpacity>
          <View style={styles.dangerDivider} />
          <TouchableOpacity style={styles.dangerRow} activeOpacity={0.8}>
            <Trash2 size={16} color={COLORS.primary} />
            <Text style={styles.dangerText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Narrat v1.0.0 · Fait avec foi</Text>
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon: Icon,
  label,
  showChevron,
  last,
  children,
}: {
  icon: any;
  label: string;
  showChevron?: boolean;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, last && styles.settingRowLast]}
      activeOpacity={0.8}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>
          <Icon size={15} color={C.textMuted} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {children ? children : showChevron ? <ChevronRight size={16} color={C.textHint} /> : null}
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  sub,
  value,
  onToggle,
  last,
}: {
  icon: any;
  label: string;
  sub?: string;
  value: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.settingRow, last && styles.settingRowLast]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>
          <Icon size={15} color={C.textMuted} />
        </View>
        <View style={styles.toggleTextWrap}>
          <Text style={styles.settingLabel}>{label}</Text>
          {sub && <Text style={styles.settingSubLabel}>{sub}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: C.border2, true: COLORS.primaryBorder }}
        thumbColor={value ? COLORS.primary : C.textMuted}
      />
    </View>
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
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  groupLabel: { ...TYPOGRAPHY.micro, color: C.textHint, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm },
  group: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  settingRowLast: { borderBottomWidth: 0 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  settingIconWrap: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { ...TYPOGRAPHY.body, color: C.text, fontWeight: '500' },
  settingSubLabel: { ...TYPOGRAPHY.micro, color: C.textHint },
  toggleTextWrap: { flex: 1, gap: 2 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, paddingTop: SPACING.sm, width: '100%' },
  langChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: C.surfaceElevated,
    borderWidth: 1,
    borderColor: C.border2,
  },
  langChipActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
  langChipText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '500' },
  langChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  fontSizeRow: { flexDirection: 'row', gap: SPACING.xs },
  fontSizeBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border2,
  },
  fontSizeBtnActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
  fontSizeBtnText: { color: C.textMuted, fontWeight: '600' },
  fontSizeBtnTextActive: { color: COLORS.primary },
  dangerGroup: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  dangerDivider: { height: 1, backgroundColor: C.border },
  dangerText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: '500' },
  versionText: { ...TYPOGRAPHY.micro, color: C.textHint, textAlign: 'center', marginBottom: SPACING.md },
});
