import { useEffect } from "react";
import { Client, Databases, ID, Query } from "react-native-appwrite";


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;


// const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(process.env.EXPO_PUBLIC_APPWRITE__PROJECT_ID!);
const client = new Client().setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!).setPlatform('com.rrm.movieapp');
const database = new Databases(client);


export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('search_term', query)]);    
        
        
        if(result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        }else {
            await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    search_term: query,
                    movie_id: movie.id,
                    count: 1,
                    title: movie.title,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            )
        }
    } catch (error) {
        console.error(error);
        
    }
    
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('count'), Query.limit(10)]);
        
        return result.documents as unknown as TrendingMovie[];
        
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

useEffect(() => {
  getTrendingMovies();
}, [])
