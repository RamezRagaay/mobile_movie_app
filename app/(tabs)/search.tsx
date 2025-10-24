import React, { useRef, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, View, TextInput } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "@/components/searchBar";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = useRef<TextInput>(null);
  const isFocused = useIsFocused();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (movies?.results?.length > 0 && searchQuery.trim()) {
      updateSearchCount(searchQuery, movies.results[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
      <FlatList
        data={movies?.results ?? []}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "center", gap: 16, marginVertical: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                ref={inputRef}
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#00008A" className="my-3 self-center" />
            )}
            {moviesError && (
              <Text className="text-white text-center px-5 my-3">
                Error: {moviesError?.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              movies?.total_results > 0 &&
              searchQuery.trim() && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-gray-500">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
      />
    </View>
  );
};

export default Search;
