import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { BottomNavigation, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/Colors';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  userId?: string;
}

export default function ForumScreen() {
  const { isAuthenticated, isGuest, userName, user } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  // Subscribe to messages from Firebase
  useEffect(() => {
    const messagesRef = collection(db, 'mensajes');
    const q = query(messagesRef, orderBy('fecha-hr', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMessages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedMessages.push({
            id: doc.id,
            username: data.usuario || 'Usuario',
            message: data.mensaje || '',
            timestamp: data['fecha-hr'] instanceof Timestamp 
              ? data['fecha-hr'].toDate() 
              : new Date(data['fecha-hr']),
            isOwn: user?.uid === data.userId,
            userId: data.userId,
          });
        });
        setMessages(loadedMessages);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading messages:', error);
        setLoading(false);
        // Allow app to continue even with permission error
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleTabPress = (tabName: string) => {
    if (tabName === 'home') {
      if (isGuest) {
        router.replace('/(tabs)/guest');
      } else {
        router.replace('/(tabs)');
      }
    } else if (tabName === 'profile') {
      if (isGuest) {
        setShowGuestModal(true);
      } else {
        router.push('/(tabs)/account');
      }
    } else if (tabName === 'stats') {
      router.push('/(tabs)/search');
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || !user) return;

    try {
      const messagesRef = collection(db, 'mensajes');
      await addDoc(messagesRef, {
        usuario: userName || 'Usuario',
        mensaje: inputText.trim(),
        'fecha-hr': Timestamp.now(),
        userId: user.uid,
      });
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return (
      <View style={[styles.messageContainer, item.isOwn && styles.messageContainerOwn]}>
        <View style={[styles.messageBubble, item.isOwn && styles.messageBubbleOwn]}>
          <Text style={[styles.username, item.isOwn && styles.usernameOwn]}>
            {item.username}
          </Text>
          <Text style={[styles.messageText, item.isOwn && styles.messageTextOwn]}>
            {item.message}
          </Text>
          <Text style={[styles.timestamp, item.isOwn && styles.timestampOwn]}>
            {item.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={80}
      >
        <View style={styles.topSpacer} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Foro de Discusión</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando mensajes...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() === '' && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={inputText.trim() === ''}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() === '' ? '#CCCCCC' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </KeyboardAvoidingView>

      <BottomNavigation
        activeTab="chat"
        isGuest={isGuest}
        onCreateAccountPress={handleCreateAccount}
        onTabPress={handleTabPress}
      />

      <GuestModal
        visible={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onCreateAccount={handleCreateAccount}
        message="Necesitas crear una cuenta para acceder a la configuración de tu perfil."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topSpacer: {
    height: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  messagesList: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginVertical: 6,
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  messageContainerOwn: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 2,
  },
  messageBubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 2,
  },
  username: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    marginBottom: 4,
  },
  usernameOwn: {
    color: '#FFFFFF',
  },
  messageText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },
  timestampOwn: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  bottomSpacer: {
    height: 70,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
