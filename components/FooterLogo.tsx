import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Obtener las dimensiones de la pantalla para hacer el componente responsive
const { width: screenWidth } = Dimensions.get('window');

// Componente Footer con logo de Jalisco Cómo Vamos
// Se coloca en la parte inferior de la pantalla de login
const FooterLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Imagen del logo de Jalisco Cómo Vamos */}
      <Image
        source={{
          uri: 'https://jaliscocomovamos.org/wp-content/uploads/2024/07/image_2024-07-05_155606714.png'
        }}
        style={styles.logo}
        resizeMode="contain" // Mantiene la proporción de la imagen
      />
    </View>
  );
};

// Estilos del componente FooterLogo
const styles = StyleSheet.create({
  // Contenedor principal: posicionado en la parte inferior
  container: {
    position: 'absolute',
    bottom: 0, // Separación del borde inferior
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Estilo de la imagen del logo
  logo: {
    width: screenWidth, // 90% del ancho de la pantalla
    height: 250, // Altura fija que permite ver la imagen claramente
    opacity: 0.9, // Ligeramente transparente para no interferir con el contenido
  },
});

// Exportación del componente
export default FooterLogo;