import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import { apiUrl } from "../config/apiConfig";

export default function FriendRequests() {
  const [searchUserId, setSearchUserId] = useState<string>(""); // User ID for new friend request
  const [pendingRequests, setPendingRequests] = useState<any[]>([]); // Pending requests

  // Fetch pending friend requests from the backend
  const fetchPendingRequests = async () => {
    try {
      const currentUserId = "676e97d8383d346fef2cce56"; // Logged-in user ID
      const response = await fetch(`${apiUrl}/friends/pending/${currentUserId}`);

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      } else {
        console.error("Error fetching pending requests:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests(); // Fetch pending requests when the page loads
  }, []);

  // Send a new friend request
  const sendFriendRequest = async () => {
    if (!searchUserId) {
      Alert.alert("Error", "Please enter a user ID.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterId: "676eaf9c383d346fef2cce5d", // Logged-in user ID
          recipientId: searchUserId,
          status: "PENDING",
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Friend request sent!");
        setSearchUserId("");
        fetchPendingRequests(); // Update the list
      } else {
        const errorText = await response.text();
        Alert.alert("Error", "Friend request could not be sent: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "There was an issue sending the friend request.");
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${apiUrl}/friends/accept/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        Alert.alert("Success", "Friend request accepted!");
        fetchPendingRequests(); // Update the list
      } else {
        const errorText = await response.text();
        console.error("Error accepting request:", errorText);
        Alert.alert("Error", "Request could not be accepted.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "There was an issue accepting the request.");
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${apiUrl}/friends/reject/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        Alert.alert("Success", "Friend request rejected!");
        fetchPendingRequests(); // Update the list
      } else {
        const errorText = await response.text();
        console.error("Error rejecting request:", errorText);
        Alert.alert("Error", "Request could not be rejected.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "There was an issue rejecting the request.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Send a new friend request */}
      <Text style={styles.header}>Send Friend Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={searchUserId}
        onChangeText={setSearchUserId}
      />
      <Pressable style={styles.button} onPress={sendFriendRequest}>
        <Text style={styles.buttonText}>Send Friend Request</Text>
      </Pressable>

      {/* Display pending friend requests */}
      <Text style={styles.header}>Pending Friend Requests</Text>
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item._id || item.id} // Use _id if it exists
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>
              Request ID: {item._id || item.id}, From: {item.requesterId}
            </Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.acceptButton}
                onPress={() => acceptFriendRequest(item._id || item.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>
              <Pressable
                style={styles.rejectButton}
                onPress={() => rejectFriendRequest(item._id || item.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
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
  requestItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});
