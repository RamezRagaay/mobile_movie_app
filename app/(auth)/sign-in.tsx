import Glogo from '@/assets/images/Google_icon.png'
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

WebBrowser.maybeCompleteAuthSession()

export default function ProfileAuthScreen() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  // Clerk hooks
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn()
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  // Inputs
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Email/Password Auth
  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        if (!signUpLoaded) return

        if (!firstName.trim() || !lastName.trim()) {
          Alert.alert('Missing info', 'Please fill out all name fields.')
          return
        }

        if (password !== confirmPassword) {
          Alert.alert('Password mismatch', 'Passwords do not match.')
          return
        }

        const result = await signUp.create({
          firstName,
          lastName,
          emailAddress,
          password,
        })

        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId })
          router.replace('/')
        } else {
          console.log('Sign-up incomplete:', result)
        }
      } else {
        if (!signInLoaded) return
        const result = await signIn.create({ identifier: emailAddress, password })

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId })
          router.replace('/')
        } else {
          console.log('Sign-in incomplete:', result)
        }
      }
    } catch (err) {
      console.error(isSignUp ? 'Sign-up error:' : 'Sign-in error:', err)
      Alert.alert('Error', 'Something went wrong. Please try again.')
    }
  }

  // Google OAuth
  const onGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/'),
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      Alert.alert('Google Sign-In failed')
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center px-6 bg-[#0B0B0B]">
      <Text className="text-white text-3xl font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back!'}
      </Text>

      {isSignUp && (
        <>
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-3"
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-3"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}

      <TextInput
        className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-3"
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <TextInput
        className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-3"
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isSignUp && (
        <TextInput
          className="bg-[#1E1E1E] text-white px-4 py-3 rounded-xl mb-4"
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      {!isSignUp && <View className="mb-2" />}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-[#AB8BFF] py-3.5 rounded-xl mb-4"
      >
        <Text className="text-center text-white font-semibold text-lg">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="flex flex-row items-center justify-center gap-2 mb-6">
        <View className="w-[40%] h-[1px] bg-gray-400"></View>
        <Text className="text-gray-400">or</Text>
        <View className="w-[40%] h-[1px] bg-gray-400"></View>
      </View>

      <TouchableOpacity
        onPress={onGoogleSignIn}
        className="bg-white py-3.5 rounded-xl flex-row justify-center items-center"
      >
        <Text className="text-black font-semibold text-lg">
          Continue with Google
        </Text>
        <Image source={Glogo} className="w-6 h-6 ml-2" />
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-400">
          {isSignUp ? 'Already have an account? ' : "Don’t have an account? "}
        </Text>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text className="text-[#AB8BFF] font-semibold">
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
