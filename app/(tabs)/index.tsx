import MovieCard from "@/components/MovieCard";
import TrendingMovieCard from "@/components/TrendingMovieCard";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import SearchBar from "../../components/searchBar";
import { icons } from "../../constants/icons";
import { images } from "../../constants/images";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError
  } = useFetch(getTrendingMovies)

  const { 
    data: movies,
    loading : moviesLoading,
    error : moviesError
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />


      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

      {moviesLoading || trendingMoviesLoading ? (
        <ActivityIndicator size="large" color="#00008A" className="mt-10 self-center" />
      ) : moviesError || trendingMoviesError ? (
        <Text className="text-white text-center mt-10">Error: {moviesError?.message || trendingMoviesError?.message}</Text>
      ) : (
        <View className="flex-1 px-5">
          <SearchBar placeholder="Search for a movie" onPress={() => {
            router.push("/search");
            
          }} value="" onChangeText={() => {}}/>

          {trendingMovies && (
            <View className="mt-10 ">
              <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
              <FlatList 
              className="mb-4 mt-3 "
              data={trendingMovies}
              renderItem={({item,index}) =>(
                <TrendingMovieCard movie={item} index = {index}/>
              )}
              keyExtractor={(item) => item.movie_id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="w-4"/>}
              ></FlatList>
            </View>
          )}
        <>
          <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Latest Movies
          </Text>
          <FlatList
            data={movies?.results ?? []} 
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard movie={item}/>
            )}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
            
            showsVerticalScrollIndicator={false}
            
            />
            </>
          </View>
        )}
    </ScrollView>

    </View>
  );
}
