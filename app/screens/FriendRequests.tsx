import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { apiUrl } from "../config/apiConfig";

export default function FriendRequests() {
  const [searchUserId, setSearchUserId] = useState<string>(""); // Yeni arkadaşlık isteği için userId
  const [requestId, setRequestId] = useState<string>(""); // Kontrol edilecek request ID
  const [requestStatus, setRequestStatus] = useState<string | null>(null); // İsteğin durumu

  // Yeni bir arkadaşlık isteği gönder
  const sendFriendRequest = async () => {
    if (!searchUserId) {
      Alert.alert("Hata", "Lütfen bir kullanıcı ID'si girin.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId: "CURRENT_USER_ID", recipientId: searchUserId, status: "PENDING" }), // Backend'e userId ve status gönderilir
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Arkadaşlık isteği gönderildi!");
        setSearchUserId(""); // Form temizlenir
      } else if (response.status === 404) {
        Alert.alert("Hata", "Girilen ID'ye sahip bir kullanıcı bulunamadı.");
      } else {
        const errorText = await response.text();
        console.error("Friend request hatası:", errorText);
        Alert.alert("Hata", "Arkadaşlık isteği gönderilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Arkadaşlık isteği gönderilirken bir sorun oluştu.");
    }
  };

  // Request ID ile arkadaşlık isteğini kontrol et
  const checkFriendRequest = async () => {
    if (!requestId) {
      Alert.alert("Hata", "Lütfen bir request ID girin.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/friends/pending/${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequestStatus(data.status); // İsteğin durumunu kaydet
        Alert.alert("Başarılı", `İstek Durumu: ${data.status}`);
      } else if (response.status === 404) {
        Alert.alert("Hata", "Bu request ID'ye ait bir arkadaşlık isteği bulunamadı.");
      } else {
        const errorText = await response.text();
        console.error("Check request hatası:", errorText);
        Alert.alert("Hata", "Arkadaşlık isteği kontrol edilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Arkadaşlık isteği kontrol edilirken bir sorun oluştu.");
    }
  };

  // İsteği kabul et
  const acceptFriendRequest = async () => {
    if (!requestId) {
      Alert.alert("Hata", "Kabul edilecek bir request ID yok.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/friends/accept/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Arkadaşlık isteği kabul edildi!");
        setRequestStatus("ACCEPTED"); // Durumu güncelle
      } else {
        Alert.alert("Hata", "İstek kabul edilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "İstek kabul edilirken bir sorun oluştu.");
    }
  };

  // İsteği reddet
  const rejectFriendRequest = async () => {
    if (!requestId) {
      Alert.alert("Hata", "Reddedilecek bir request ID yok.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/friends/reject/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Arkadaşlık isteği reddedildi!");
        setRequestStatus("REJECTED"); // Durumu güncelle
      } else {
        Alert.alert("Hata", "İstek reddedilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "İstek reddedilirken bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Yeni arkadaşlık isteği gönderme */}
      <Text style={styles.header}>Arkadaşlık İsteği Gönder</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID girin"
        value={searchUserId}
        onChangeText={setSearchUserId}
      />
      <Pressable style={styles.button} onPress={sendFriendRequest}>
        <Text style={styles.buttonText}>Arkadaşlık İsteği Gönder</Text>
      </Pressable>

      {/* Request ID ile kontrol ve yönetim */}
      <Text style={styles.header}>Request ID ile Kontrol</Text>
      <TextInput
        style={styles.input}
        placeholder="Request ID girin"
        value={requestId}
        onChangeText={setRequestId}
      />
      <Pressable style={styles.button} onPress={checkFriendRequest}>
        <Text style={styles.buttonText}>Arkadaşlık İsteğini Kontrol Et</Text>
      </Pressable>
      {requestStatus && (
        <View>
          <Text>İstek Durumu: {requestStatus}</Text>
          <Pressable style={styles.acceptButton} onPress={acceptFriendRequest}>
            <Text style={styles.buttonText}>Kabul Et</Text>
          </Pressable>
          <Pressable style={styles.rejectButton} onPress={rejectFriendRequest}>
            <Text style={styles.buttonText}>Reddet</Text>
          </Pressable>
        </View>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
