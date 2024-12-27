import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiUrl } from "../config/apiConfig";

interface GroupMessage {
  id: string;
  senderId: string;
  content: string;
}

interface User {
  id: string;
  name: string;
  surname: string;
}

export default function GroupChatScreen() {
  const { groupId } = useLocalSearchParams();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<Record<string, User>>({}); // Map of senderId to user details

  // Fetch messages and user details
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/groups/${groupId}/messages`);
      if (response.ok) {
        const data: GroupMessage[] = await response.json();
        setMessages(data);

        // Extract unique sender IDs and fetch user details
        const senderIds = [...new Set(data.map((message) => message.senderId))];
        fetchUserDetails(senderIds);
      } else {
        Alert.alert("Hata", "Mesajlar yüklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Mesajlar alınamadı.");
    }
  };

  // Fetch user details by sender IDs
  const fetchUserDetails = async (userIds: string[]) => {
    try {
      const response = await fetch(`${apiUrl}/users?ids=${userIds.join(",")}`); // Fetch user details for sender IDs
      if (response.ok) {
        const data: User[] = await response.json();
        const userMap: Record<string, User> = {};
        data.forEach((user) => {
          userMap[user.id] = user; // Map user ID to user details
        });
        setUsers(userMap);
      } else {
        // console.error("Kullanıcı detayları yüklenirken bir sorun oluştu.");   // we are facing with the problem when we go to the Group Chat
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Kullanıcı detayları alınamadı.");
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Hata", "Mesaj boş olamaz.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/groups/${groupId}/send?senderId=676ada3d372fdc341958fc55`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage), // Backend expects plain string for the content
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        setNewMessage(""); // Clear the input field
      } else {
        const errorData = await response.json();
        console.error("API Hatası:", errorData);
        Alert.alert("Hata", "Mesaj gönderilemedi. Detay: " + (errorData.message || "Bilinmiyor"));
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Mesaj gönderilirken bir sorun oluştu.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Group Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            {users[item.senderId]?.name
              ? `${users[item.senderId].name} ${users[item.senderId].surname}: ${item.content}`
              : `${item.senderId}: ${item.content}`}
          </Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type Message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
