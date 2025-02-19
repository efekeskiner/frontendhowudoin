import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  const currentUserId = "676eaf9c383d346fef2cce5d";
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Home Screen!</Text>
      <Link href="/screens/FriendRequests" style={styles.link}>
        Go to Friend Requests
      </Link>
      <Link
        href={{
          pathname: "/screens/FriendListScreen", // Arkadaş Listesi ekranı yolu
          params: { currentUserId }, // Parametre olarak kullanıcı ID'sini gönderiyoruz
        }}
        style={styles.link}
      >
        Friends List
      </Link>
      <Link href="/screens/CreateGroupScreen" style={styles.link}>
  Create Group
</Link>
<Link href="/screens/GroupListScreen" style={styles.link}>
  Groups
</Link>


      <Link href="/components/Login" style={styles.link}>
        Logout
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
});
