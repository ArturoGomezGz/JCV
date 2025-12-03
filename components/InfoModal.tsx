import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, semanticColors } from '../constants/Colors';

interface InfoModalProps {
  title: string;
  message: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, message }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Botón de info */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={handleOpen}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="information-circle" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* Botón cerrar */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>

              {/* Título */}
              <View style={styles.headerContainer}>
                <Ionicons name="information-circle" size={32} color={colors.primary} />
                <Text style={styles.modalTitle}>{title}</Text>
              </View>

              {/* Mensaje */}
              <Text style={styles.modalMessage}>{message}</Text>

              {/* Botón de cerrar */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleClose}
              >
                <Text style={styles.buttonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  infoButton: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    maxWidth: '90%',
    minWidth: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InfoModal;
