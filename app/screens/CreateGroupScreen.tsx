import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { apiUrl } from "../config/apiConfig";

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const currentUserId = "676eaf9c383d346fef2cce5d"; // Şu anki kullanıcı ID'si

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers((prevMembers) => [...prevMembers, newMember.trim()]);
      setNewMember("");
    }
  };

  const createGroup = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/groups/create?name=${groupName}&creatorId=${currentUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(members),
        }
      );

      if (!response.ok) {
        throw new Error("Grup oluşturulamadı.");
      }

      Alert.alert("Başarılı", "Grup başarıyla oluşturuldu.");
      setGroupName("");
      setMembers([]);
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Grup Oluştur</Text>
      <TextInput
        style={styles.input}
        placeholder="Grup Adı"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Üye ID Ekle"
        value={newMember}
        onChangeText={setNewMember}
      />
      <Pressable style={styles.button} onPress={addMember}>
        <Text style={styles.buttonText}>Üye Ekle</Text>
      </Pressable>
      {members.map((member, index) => (
        <Text key={index} style={styles.member}>
          {member}
        </Text>
      ))}
      <Pressable style={styles.button} onPress={createGroup}>
        <Text style={styles.buttonText}>Grup Oluştur</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  member: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderBottomColor: "gray" },
});
