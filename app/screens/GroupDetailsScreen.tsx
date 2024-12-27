// 2.7 Show Group Details							(10 Points)
// When a group selected from group list, group name, creatin time and all members will be listed in the group details screen.


import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiUrl } from "../config/apiConfig";

interface User {
  id: string;
  name: string;
  surname: string;
}

interface GroupDetails {
  id: string;
  name: string;
  createdAt: string; // Group creation time
  members: User[];
}

export default function GroupDetailsScreen() {
  const { groupId } = useLocalSearchParams();
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/groups/${groupId}/details`);
      if (response.ok) {
        const data: GroupDetails = await response.json();
        setGroupDetails(data);
      } else {
        Alert.alert("Hata", "Grup detayları yüklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Grup detayları alınamadı.");
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  return (
    <View style={styles.container}>
      {groupDetails ? (
        <>
          <Text style={styles.header}>Grup Adı: {groupDetails.name}</Text>
          <Text style={styles.text}>Oluşturulma Zamanı: {new Date(groupDetails.createdAt).toLocaleString()}</Text>
          <Text style={styles.text}>Üyeler:</Text>
          <FlatList
            data={groupDetails.members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.memberItem}>
                {item.name} {item.surname} ({item.id})
              </Text>
            )}
          />
        </>
      ) : (
        <Text style={styles.text}>Grup detayları yükleniyor...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 10 },
  memberItem: { fontSize: 16, marginVertical: 5 },
});
