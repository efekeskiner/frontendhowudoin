import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { apiUrl } from "../config/apiConfig";

interface User {
  id: string;
  name: string; // User's first name
  surname: string; // User's last name
}

interface Group {
  id: string;
  name: string;
  members: string[]; // Array of user IDs
}

export default function GroupListScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Record<string, User>>({});
  const router = useRouter();

  const currentUserId = "676eaf9c383d346fef2cce5d"; // Current user ID

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${apiUrl}/groups/`);
      if (!response.ok) {
        // throw new Error("Error while loading groups.");
      }
      const data: Group[] = await response.json();

      // Filter groups where the current user is a member
      const userGroups = data.filter((group) =>
        group.members.includes(currentUserId)
      );
      setGroups(userGroups);

      // Collect all unique member IDs
      const allMemberIds = [...new Set(userGroups.flatMap((group) => group.members))];

      // Fetch member details for all IDs
      await fetchMembers(allMemberIds);
    } catch (error: any) {
      // Alert.alert("Error", error.message || "An error occurred.");
    }
  };

  // Fetch member details for all given IDs
  const fetchMembers = async (memberIds: string[]) => {
    try {
      if (memberIds.length === 0) return; // No members to fetch
      console.log(`Fetching members for IDs: ${memberIds.join(",")}`);

      const response = await fetch(`${apiUrl}/users?ids=${memberIds.join(",")}`);
      if (!response.ok) {
        // throw new Error("Error while fetching member details.");
      }

      const data: User[] = await response.json();
      const memberMap: Record<string, User> = {};
      data.forEach((member) => {
        memberMap[member.id] = member; // Map each user by their ID
      });
      setMembers(memberMap); // Update state with the new member data
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load members.");
    }
  };

  // Render members: name, surname, or fallback to user ID
  const renderGroupMembers = (memberIds: string[]) =>
    memberIds
      .map((id) => {
        const member = members[id];
        if (member) {
          return `${member.name || "Unknown"} ${member.surname || "Unknown"}`;
        }
        return id; // Fallback to ID if no name or surname found
      })
      .join(", ");

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>
      {groups.length === 0 ? (
        <Text style={styles.noGroupsText}>You don't have any groups yet.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <View style={styles.groupDetails}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.memberList}>
                  Users: {renderGroupMembers(item.members)}
                </Text>
              </View>
              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "/screens/GroupChatScreen",
                    params: { groupId: item.id },
                  })
                }
              >
                <Text style={styles.buttonText}>Send Message</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  noGroupsText: { fontSize: 16, color: "gray", textAlign: "center" },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  groupDetails: { marginBottom: 10 },
  groupName: { fontSize: 18, fontWeight: "bold" },
  memberList: { fontSize: 14, color: "#555" },
  button: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5, alignSelf: "flex-end" },
  buttonText: { color: "white", fontWeight: "bold" },
});
