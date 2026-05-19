import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  favoriteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlacesState = {
  searches: [],
  status: 'idle',
  favoriteStatus: 'idle',
  error: null,
};

const API_BASE = 'https://backend-production-7dfc.up.railway.app/api/places';

interface SearchHistoryParams {
  page?: number;
  size?: number;
}

export const fetchSearchHistory = createAsyncThunk('places/fetchSearchHistory', async ({ page = 0, size = 10 }: SearchHistoryParams = {}) => {
  const response = await axios.get<{ content: Place[] }>(`${API_BASE}?page=${page}&size=${size}`);
  return response.data.content || [];
});

export const saveSearchPlace = createAsyncThunk('places/saveSearchPlace', async (place: Place) => {
  const response = await axios.post<Place>(API_BASE, place);
  return response.data;
});

export const deleteSearchPlace = createAsyncThunk('places/deleteSearchPlace', async (placeId: string) => {
  await axios.delete(`${API_BASE}?placeId=${encodeURIComponent(placeId)}`);
  return placeId;
});

export const clearSearchHistory = createAsyncThunk('places/clearSearchHistory', async () => {
  await axios.delete(API_BASE);
});

export const saveFavoritePlace = createAsyncThunk('places/saveFavorite', async (place: Place) => {
  const response = await axios.post<Place>(API_BASE, place);
  return response.data;
});

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSearchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searches = action.payload;
      })
      .addCase(fetchSearchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load search history';
      })
      .addCase(saveSearchPlace.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(saveSearchPlace.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const exists = state.searches.find((p) => p.placeId === action.payload.placeId);
        if (!exists) {
          state.searches.push(action.payload);
        }
      })
      .addCase(saveSearchPlace.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to save search history';
      })
      .addCase(deleteSearchPlace.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSearchPlace.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searches = state.searches.filter((p) => p.placeId !== action.payload);
      })
      .addCase(deleteSearchPlace.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete search history item';
      })
      .addCase(clearSearchHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearSearchHistory.fulfilled, (state) => {
        state.status = 'succeeded';
        state.searches = [];
      })
      .addCase(clearSearchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to clear search history';
      })
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

export default placesSlice.reducer;
