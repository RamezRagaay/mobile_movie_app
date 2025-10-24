import React from 'react';
import { Image, TextInput, View } from 'react-native';
import { icons } from './../constants/icons';

interface Props {
    placeholder: string;
    onPress?: () => void;
    value? : string;
    onChangeText : (text : string) => void;
    autoFocus? : boolean
    ref? : any
}

const SearchBar = ({ placeholder, onPress, value, onChangeText, autoFocus = false, ref}  : Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
        <Image source={icons.search} className='size-5'
        resizeMode='contain' tintColor="#ab8bff"/>

        <TextInput onPress={onPress} onChangeText={onChangeText}
        ref={ref}
        autoFocus={autoFocus}
        placeholder={placeholder} value={value}
        placeholderTextColor="#ab8bff" 
        className='text-white ml-2 flex-1'/>
        
    </View>
  )
}

export default SearchBar