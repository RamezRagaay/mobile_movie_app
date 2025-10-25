import rankingTop1 from "@/assets/images/rankingGraddientTop1.png";
import { images } from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from 'expo-router';

import { Image, Text, TouchableOpacity, View } from 'react-native';
const TrendingMovieCard = ({movie, index} : any) => {
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>

        <TouchableOpacity className='w-32 relative'>
            <Image source={{uri: movie.poster_url
            ? `${movie.poster_url}`
            : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png"
            }}
            className='w-32 h-48 rounded-lg'
            resizeMode='cover'/>
            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{movie.title}</Text>
            <View className='absolute bottom-3 -left-3.5 px-2 py-1'>
                 <MaskedView 
                 maskElement={
                    <Text className='font-bold text-white text-[45px]'>{index+1}</Text>
                    }
                >
                 <Image source={
                    index === 0 ?
                    rankingTop1 :
                    images.rankingGradient
                }
                    className='size-14'
                    resizeMode='cover'
                    />
                 </MaskedView>
            </View>
        </TouchableOpacity>
    </Link>
  )
}

export default TrendingMovieCard