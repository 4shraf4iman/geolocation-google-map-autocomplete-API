import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Place {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface PlacesState {
  searches: Place[];
  favoriteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const loadSearchesFromCache = (): Place[] => {
  try {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load search history', e);
  }
  return [];
};

const initialState: PlacesState = {
  searches: loadSearchesFromCache(),
  favoriteStatus: 'idle',
  error: null,
};

// Redux Thunk for saving to favorite (calling Java Spring Boot API)
export const saveFavoritePlace = createAsyncThunk(
  'places/saveFavorite',
  async (place: Place) => {
    const response = await axios.post('http://localhost:8080/api/places', place);
    return response.data;
  }
);

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<Place>) => {
      // Check if already in history, avoid duplicate
      const exists = state.searches.find((p) => p.placeId === action.payload.placeId);
      if (!exists) {
        state.searches.push(action.payload);
        localStorage.setItem('searchHistory', JSON.stringify(state.searches));
      }
    },
    removeSearch: (state, action: PayloadAction<string>) => {
      state.searches = state.searches.filter((p) => p.placeId !== action.payload);
      localStorage.setItem('searchHistory', JSON.stringify(state.searches));
    },
    clearSearches: (state) => {
      state.searches = [];
      localStorage.removeItem('searchHistory');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFavoritePlace.pending, (state) => {
        state.favoriteStatus = 'loading';
        state.error = null;
      })
      .addCase(saveFavoritePlace.fulfilled, (state) => {
        state.favoriteStatus = 'succeeded';
      })
      .addCase(saveFavoritePlace.rejected, (state, action) => {
        state.favoriteStatus = 'failed';
        state.error = action.error.message || 'Failed to save favorite place';
      });
  },
});

export const { addSearch, removeSearch, clearSearches } = placesSlice.actions;

export default placesSlice.reducer;
