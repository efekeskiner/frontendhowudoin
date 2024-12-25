import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to HowYouDoin</Text>
      <Link href="/components/Register" style={styles.link}>
        Go to Register
      </Link>
      <Link href="/components/Login" style={styles.link}>
        Go to Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
});
