import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)
/*children is anything inside the provider that you need rerendered*/
export const MovieProvider = ({children}) => {
    /*constanly update for likes*/
    const [likes, setLikes] = useState([])
    
    /*local storage*/
    useEffect(() => {
        const storedLikes = localStorage.getItem("likes")
        if (storedLikes) setLikes(JSON.parse(storedLikes))
        
    },[])
    
    useEffect(() => {
        localStorage.setItem('likes', JSON.stringify(likes))
    }, [likes]) /*only runs when likes changes*/
    
    const addToLikes = (movie) => {
        setLikes(prev => [...prev, movie])
    }
    const removeFromLikes = (movieID) => {
        setLikes(prev => prev.filter(movie => movie.id !==movieID))

    }

    const isLiked = (movieID) => {
        return likes.some(movie => movie.id === movieID)
    }

    /*keep track of state*/
    const value = {
        likes,
        addToLikes,
        removeFromLikes,
        isLiked
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
