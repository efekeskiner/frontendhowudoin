import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="screens/Home" options={{ title: "Home" }} />
      <Stack.Screen name="screens/FriendRequests" options={{ title: "Friend Requests" }} />
      {/* Add other screens here */}
    </Stack>
  );
}
