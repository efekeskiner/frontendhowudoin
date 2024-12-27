import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiUrl } from "../config/apiConfig";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

export default function MessageScreen() {
  const { currentUserId, friendId, friendName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch message history
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/messages/chat/${currentUserId}/${friendId}`);
      if (response.ok) {
        const data: Message[] = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch message history");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      id: Date.now().toString(), // Temporary ID (can be replaced by backend-generated ID)
      senderId: currentUserId as string,
      recipientId: friendId as string,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${apiUrl}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage(""); // Clear the input field
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messaging by {friendName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === currentUserId ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yazın..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    color: "white",
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
