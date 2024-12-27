import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiUrl } from "../config/apiConfig";

// Define the Friend interface
interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  friendId: string; // The friend's user ID for messaging
}

export default function FriendListScreen() {
  const { currentUserId } = useLocalSearchParams(); // Retrieve the parameter
  const [friends, setFriends] = useState<Friend[]>([]);
  const router = useRouter();

  // Check if currentUserId exists
  useEffect(() => {
    if (!currentUserId) {
      console.error("Missing currentUserId parameter!");
      Alert.alert(
        "Error",
        "Unable to retrieve user ID. Please log in again.",
        [
          {
            text: "Log In",
            onPress: () => router.push("/components/Login"), // Redirect to login screen
          },
        ]
      );
    } else {
      console.log("currentUserId retrieved:", currentUserId);
      fetchFriends(); // Fetch the friend list if currentUserId exists
    }
  }, [currentUserId]);

  // Function to fetch user details
  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`);
      if (response.ok) {
        const userDetails = await response.json();
        console.log(`User details (${userId}):`, userDetails);
        return userDetails;
      } else {
        console.error("Error fetching user details:", userId);
      }
    } catch (error) {
      console.error(`Error (fetchUserDetails - ID: ${userId}):`, error);
    }
    return { firstName: "Unknown", lastName: "User" }; // Default value in case of an error
  };

  // Function to fetch the friend list
  const fetchFriends = async () => {
    try {
      const response = await fetch(`${apiUrl}/friends/accepted/${currentUserId}`);
      if (response.ok) {
        const friendsData = await response.json();

        // Fetch user details for each friend
        const enhancedFriends = await Promise.all(
          friendsData.map(async (friend: any) => {
            const friendId =
              friend.recipientId === currentUserId ? friend.requesterId : friend.recipientId;

            // Retrieve user details
            const userDetails = await fetchUserDetails(friendId);

            return {
              id: friend.id, // Friendship ID
              friendId, // Friend's user ID
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
            };
          })
        );

        setFriends(enhancedFriends); // Update the friend list
      } else {
        console.error("Failed to fetch friend list:", await response.text());
      }
    } catch (error) {
      console.error("Error (fetchFriends):", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends List</Text>
      {!currentUserId ? (
        <Text style={styles.error}>Could not get USER ID.</Text>
      ) : friends.length === 0 ? (
        <Text style={styles.noFriendsText}>Your friend list is empty.</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendName}>
                {`${item.firstName} ${item.lastName}`} {/* Display full name */}
              </Text>
              <Pressable
                style={styles.messageButton}
                onPress={() =>
                  router.push({
                    pathname: "/screens/MessageScreen",
                    params: {
                      currentUserId, // Pass the current user ID
                      friendId: item.friendId, // Pass the friend's user ID
                      friendName: `${item.firstName} ${item.lastName}`, // Pass the friend's name
                    },
                  })
                }
              >
                <Text style={styles.messageButtonText}>Send Message</Text>
              </Pressable>
            </View>
          )}
        />
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
    textAlign: "center",
  },
  noFriendsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  messageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
