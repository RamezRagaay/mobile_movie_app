import { icons } from '@/constants/icons';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from './../../node_modules/expo-linear-gradient/build/LinearGradient';
import { getMovieDetails } from './../../services/api';

interface MovieInfoProps {
  lable: string;
  value: string | number | null;
}
const MovieInfo = ({ lable, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>
      {lable}
    </Text>
    {
    
    <Text className='text-light-100 font-bold text-sm mt-2'>
      {value || "N/A"}
    </Text>
    }
  </View>
)
const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useFetch(()=>getMovieDetails(`${id}`));
  const router = useRouter();
  const {width} = Dimensions.get('window');

  return (
      (loading)?
      <SafeAreaView className='bg-primary flex-1 justify-center items-center'>
        <Text className='text-white text-lg'>Loading...</Text>
      </SafeAreaView>
      :
      (error)?
      <SafeAreaView className='bg-primary flex-1 justify-center items-center'>
        <Text className='text-white text-lg'>{error?.message}</Text>
      </SafeAreaView>
      :
      <SafeAreaView className='bg-primary flex-1'>
        <ScrollView>
          <View>
            <Image source={{uri: data?.poster_path 
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
              : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png"}} 
              resizeMode='cover'
              style={{width: width, height: width*1.25}}
              />
          </View>
          <View className='flex-col items-start justify-center mt-5 px-5'>
            <Text className='text-white font-bold text-xl'>{data?.title}</Text>
            <View className='flex-row items-center gap-x-1 mt-2'>
              <Text className='text-light-200 text-sm'>{data?.release_date?.split('-')[0]}</Text>
              <Text className='text-light-200 text-sm'>{(data?.runtime)/60
                ? `${Math.floor((data?.runtime)/60)}h ${(data?.runtime)%60}m`
                : `${data?.runtime}m`
                }</Text>
            </View>
            <View className='flex-row items-center bg-dark-100 px-[10px] py-2 rounded-md gap-x-1 mt-2'>
                <Image source={icons.star} className='size-4'/>
                <View className='flex-row items-center justify-center gap-x-[1px]'>
                  <Text className='text-xs text-white font-semibold uppercase'>{data?.vote_average}</Text>
                  <Text className='text-xs text-light-300 font-medium'>/</Text>
                  <Text className='text-xs text-light-300 font-medium'>10</Text>
                  <Text className='text-xs text-light-300 font-medium ml-2'>({data?.vote_count}K)</Text>
                </View>
            </View>
            <MovieInfo lable='Overview' value={data?.overview}/>
              <View className='mt-5'>
                  <Text className='text-light-200 font-normal text-sm'>Genres</Text>
                  <View className='flex flex-row justify-center items-center gap-[9px] mt-2'>
                  {data?.genres?.map((g : any, index:any) => (
                    <View key={index} className='flex-row items-center bg-dark-100 px-[10px] py-2 rounded-md gap-x-1'>
                      <Text className='text-xs text-white font-semibold uppercase'>{g.name}</Text>
                    </View>
                  ))}
              </View>     
            </View>


            <View className='flex flex-row justify-between w-1/2'>
                <MovieInfo lable='Budget' value={`$${Math.round(data?.budget / 1000000)} million`}/>
                <MovieInfo lable='Revenue' value={`$${Math.round (data?.revenue / 1000000)} million`}/>
            </View>
            <MovieInfo lable="Production Companies" value={data?.production_companies?.map((c : any) => c.name).join(' - ') || 'N/A'}/>
            <MovieInfo lable="Tagline" value={data?.tagline}/>
            <MovieInfo lable="Countries" value={data?.production_countries?.map((c : any) => c.name).join(' • ') || 'N/A'}/>
          </View>


          <View className='h-16'></View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="absolute bottom-5 left-0 right-0 mx-5 rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={["#D6C7FF", "#AB8BFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              borderRadius: 9999,
            }}
          >
            <Image
              source={icons.arrow}
              style={{
                width: 20,
                height: 20,
                marginRight: 6,
                transform: [{ rotate: "180deg" }],
                tintColor: "#fff",
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Go Back
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    
  )
}

export default MovieDetails