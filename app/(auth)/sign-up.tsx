import Glogo from '@/assets/images/Google_icon.png';
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
;

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        console.log(JSON.stringify(attempt, null, 2));
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const onGoogleSignUp = async () => {
  try {
    const result = await startOAuthFlow({
      redirectUrl: Linking.createURL("/"),
    });

    if (result?.createdSessionId && setActive) {
      await setActive({ session: result.createdSessionId });
      router.replace("/");
    } else {
      console.log("OAuth result:", result);
    }
  } catch (err) {
    console.error("Google Sign-Up Error:", err);
  }
};


  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center px-6 bg-[#0B0B0B]">
        <Text className="text-white text-2xl font-bold mb-6">
          Verify Your Email
        </Text>
        <TextInput
          className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          onPress={onVerifyPress}
          className="bg-[#AB8BFF] py-3.5 rounded-xl"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Verify
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center px-6 bg-[#0B0B0B]">
      <Text className="text-white text-3xl font-bold mb-6">Create Account 🪄</Text>

      <TextInput
        className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-3"
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <TextInput
        className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-4"
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      

      <TouchableOpacity
        onPress={onSignUpPress}
        className="bg-[#AB8BFF] py-3.5 rounded-xl mb-4"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Sign Up
        </Text>
      </TouchableOpacity>

      <View className='flex flex-row items-center justify-center gap-2'>
        <View className='w-[40%] h-[1px] bg-gray-400'></View>
        <Text className="text-gray-400">or</Text>
        <View className='w-[40%] h-[1px] bg-gray-400'></View>
      </View>

      <TouchableOpacity
        onPress={onGoogleSignUp}
        className="bg-white py-3.5 rounded-xl mb-6 mt-4 flex-row justify-center items-center"
      >
        <Text className="text-black font-semibold text-lg">
          Continue with Google
        </Text>
        <Image
          source={Glogo}
          className="w-6 h-6 ml-2"
        />
        
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-400">Already have an account? </Text>
        <Link href="/(auth)/sign-in" className="text-[#AB8BFF] font-semibold">
          Sign in
        </Link>
      </View>
    </SafeAreaView>
  );
}
