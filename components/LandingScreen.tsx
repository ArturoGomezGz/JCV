import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const handleAccess = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#0066cc', '#004d99', '#003366']}
        style={styles.header}
      >
        <Text style={styles.logo}>JCV Analytics</Text>
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

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Usuarios Activos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Satisfacción</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Soporte</Text>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>¿Por qué JCV Analytics?</Text>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>📊</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Dashboards Inteligentes</Text>
            <Text style={styles.featureDescription}>
              Visualiza tus datos en tiempo real con gráficos interactivos y personalizables
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>🤖</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Análisis con IA</Text>
            <Text style={styles.featureDescription}>
              Obtén insights automáticos y predicciones basadas en machine learning
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>🔒</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Seguridad Garantizada</Text>
            <Text style={styles.featureDescription}>
              Tus datos protegidos con encriptación de nivel empresarial
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>⚡</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Velocidad Increíble</Text>
            <Text style={styles.featureDescription}>
              Procesa millones de datos en segundos con nuestra infraestructura cloud
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>Lo que dicen nuestros clientes</Text>
        
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "JCV Analytics transformó completamente nuestra forma de analizar datos. 
            Increíblemente intuitivo y potente."
          </Text>
          <Text style={styles.testimonialAuthor}>- María González, CEO TechCorp</Text>
        </View>

        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "La mejor plataforma de análisis que hemos usado. El soporte es excepcional 
            y los resultados hablan por sí mismos."
          </Text>
          <Text style={styles.testimonialAuthor}>- Carlos Rodríguez, Director de Datos</Text>
        </View>
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
        <Text style={styles.footerText}>© 2025 JCV Analytics. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#e6f2ff',
    textAlign: 'center',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: '#f8f9fa',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 30,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f2ff',
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
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  testimonialsSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  testimonialText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  ctaSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
  },
  ctaSectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaSectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  ctaSecondaryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: '#1a1a1a',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
