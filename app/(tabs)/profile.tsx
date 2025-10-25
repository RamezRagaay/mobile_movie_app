import { useAuth, useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import SignInScreen from "../(auth)/sign-in"; // adjust path if needed

export default function Profile() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // While Clerk is loading
  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // Not signed in → show sign-in screen inline
  if (!isSignedIn) {
    return <SignInScreen />;
  }

  // Signed in → show user info
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary px-6">
      <View className="items-center mb-6">
        {user?.imageUrl && (
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full mb-4 border-2 border-white"
          />
        )}
        <Text className="text-white text-2xl font-bold">
          {user?.fullName || "User"}
        </Text>
        <Text className="text-gray-300 text-base mt-1">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => signOut()}
        className="bg-[#AB8BFF] py-3 px-6 rounded-xl mt-4"
      >
        <Text className="text-white font-semibold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
