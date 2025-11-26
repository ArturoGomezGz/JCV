import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import colors from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const handleAccess = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
      colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
        style={styles.header}
      >
      <Text style={styles.logo}>Jalisco Cómo Vamos</Text>
        <Text style={styles.tagline}>Transforma datos en decisiones inteligentes</Text>
      </LinearGradient>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Bienvenido a la Nueva Era del Análisis</Text>
        <Text style={styles.heroSubtitle}>
          Potencia tu negocio con insights basados en IA y visualizaciones en tiempo real
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleAccess}>
          <Text style={styles.ctaButtonText}>Accede</Text>
        </TouchableOpacity>
      </View>

      {/* Sección reemplazada: explicación del proyecto según solicitud
          Aquí eliminamos métricas y testimonios y mostramos el texto descriptivo */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>¿Qué es Cómo Vamos Jalisco?</Text>
        <Text style={styles.aboutText}>
          {`Cómo Vamos Jalisco es una plataforma ciudadana que reúne y visualiza datos sobre el desarrollo social, económico y ambiental del estado. Su objetivo es acercar la información pública a todas las personas, promoviendo la transparencia, la participación ciudadana y el análisis basado en evidencia.

A través de gráficas interactivas, indicadores y comparativas municipales, la app permite conocer cómo avanza Jalisco en temas como seguridad, educación, salud, medio ambiente y movilidad, impulsando una ciudadanía más informada y comprometida con su entorno.`}
        </Text>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaSectionTitle}>¿Listo para empezar?</Text>
        <Text style={styles.ctaSectionSubtitle}>
          Únete a miles de empresas que ya confían en JCV Analytics
        </Text>
        <TouchableOpacity style={styles.ctaSecondaryButton} onPress={handleAccess}>
          <Text style={styles.ctaSecondaryButtonText}>Comenzar Ahora</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.socialRowFooter}>
          <TouchableOpacity onPress={() => Linking.openURL('https://jaliscocomovamos.org/')} style={styles.socialIcon}>
            <Entypo name="link" size={18} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/jaliscomovamos')} style={styles.socialIcon}>
            <FontAwesome name="facebook-square" size={20} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://x.com/jaliscomovamos')} style={styles.socialIcon}>
            <FontAwesome name="twitter" size={20} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/jaliscomovamos/')} style={styles.socialIcon}>
            <FontAwesome name="instagram" size={20} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/channel/UCn1zLVu1oCAcXzlhMEMgE2w')} style={styles.socialIcon}>
            <FontAwesome name="youtube-play" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            // Placeholder: sustituir por el enlace real de Google Drive si se dispone
            const avisoUrl = 'https://drive.google.com';
            Linking.openURL(avisoUrl).catch(() => Alert.alert('No se pudo abrir el aviso de privacidad'));
          }}
        >
          <Text style={styles.privacyLink}>Aviso de Privacidad integral (Google Drive)</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>© 2025 JALISCO CÓMO VAMOS. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  testimonialsSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  testimonialCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  testimonialText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  ctaSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  ctaSectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaSectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  ctaSecondaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  ctaSecondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  aboutSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  socialRowFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  privacyLink: {
    color: colors.link,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
});
