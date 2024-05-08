import React, { createContext, useContext, useReducer } from "react";

// Create a global context
const GlobalContext = createContext();

// Base URL for API requests
const baseUrl = "https://api.jikan.moe/v4";

// Define action types
const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";
const GET_PICTURES = "GET_PICTURES";

// Reducer function to manage state based on actions
const reducer = (state, action) => {
    switch(action.type){
        case LOADING:
            return {...state, loading: true};
        case GET_POPULAR_ANIME:
            return {...state, popularAnime: action.payload, loading: false};
        case SEARCH:
            return {...state, searchResults: action.payload, loading: false};
        case GET_UPCOMING_ANIME:
            return {...state, upcomingAnime: action.payload, loading: false};
        case GET_AIRING_ANIME:
            return {...state, airingAnime: action.payload, loading: false};
        case GET_PICTURES:
            return {...state, pictures: action.payload, loading: false};
        default:
            return state;
    }
}

// Global Context Provider component
export const GlobalContextProvider = ({children}) => {

    // Initial state for the context
    const initialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        searchResults: [],
        loading: false,
    }

    // Use reducer to manage state
    const [state, dispatch] = useReducer(reducer, initialState);
    const [search, setSearch] = React.useState('');

    // Handle input change for search
    const handleChange = (e) => {
        setSearch(e.target.value);
        if(e.target.value === ''){
            state.isSearch = false;
        }
    }

    // Handle form submission for search
    const handleSubmit = (e) => {
        e.preventDefault();
        if(search){
            searchAnime(search);
            state.isSearch = true;
        }else{
            state.isSearch = false;
            alert('Please enter a search term');
        }
    }

    // Fetch popular anime data
    const getPopularAnime = async () => {
        dispatch({type: LOADING});
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        dispatch({type: GET_POPULAR_ANIME, payload: data.data});
    }

    // Fetch upcoming anime data
    const getUpcomingAnime = async () => {
        dispatch({type: LOADING});
        const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
        const data = await response.json();
        dispatch({type: GET_UPCOMING_ANIME, payload: data.data});
    }

    // Fetch airing anime data
    const getAiringAnime = async () => {
        dispatch({type: LOADING});
        const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
        const data = await response.json();
        dispatch({type: GET_AIRING_ANIME, payload: data.data});
    }

    // Search anime by query
    const searchAnime = async (anime) => {
        dispatch({type: LOADING});
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`);
        const data = await response.json();
        dispatch({type: SEARCH, payload: data.data});
    }

    // Fetch pictures of anime characters by ID
    const getAnimePictures = async (id) => {
        dispatch({type: LOADING});
        const response = await fetch(`https://api.jikan.moe/v4/characters/${id}/pictures`);
        const data = await response.json();
        dispatch({type: GET_PICTURES, payload: data.data});
    }

    // Fetch popular anime data on component mount
    React.useEffect(() => {
        getPopularAnime();
    }, []);

    // Provide context values to consumers
    return(
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            searchAnime,
            search,
            getPopularAnime,
            getUpcomingAnime,
            getAiringAnime,
            getAnimePictures 
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// Custom hook to use the global context
export const useGlobalContext = () => {
    return useContext(GlobalContext);
}
