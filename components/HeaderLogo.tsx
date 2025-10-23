import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Obtener las dimensiones de la pantalla para hacer el componente responsive
const { width: screenWidth } = Dimensions.get('window');

// Componente Header con logo de Jalisco Cómo Vamos
// Se coloca en la parte superior de la pantalla de login
const HeaderLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Imagen del logo de Jalisco Cómo Vamos */}
      <Image
        source={{
          uri: 'https://jaliscocomovamos.org/wp-content/uploads/2021/04/cropped-Logo_JCV_RGB-01-1536x592.png'
        }}
        style={styles.logo}
        resizeMode="contain" // Mantiene la proporción de la imagen
      />
    </View>
  );
};

// Estilos del componente HeaderLogo
const styles = StyleSheet.create({
  // Contenedor principal: posicionado en la parte superior centrado
  container: {
    position: 'absolute',
    top: 50, // Separación del borde superior para evitar el notch/status bar
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1000, // Asegurar que esté por encima de otros elementos
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo semi-transparente para debug
  },
  // Estilo de la imagen del logo
  logo: {
    width: screenWidth * 0.7, // 70% del ancho de la pantalla para mejor centrado
    height: 100, // Altura apropiada para header
  },
});

// Exportación del componente
export default HeaderLogo;