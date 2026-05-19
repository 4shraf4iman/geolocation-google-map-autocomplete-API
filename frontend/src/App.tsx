import { useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { saveFavoritePlace, removeSearch, clearSearches, addSearch } from './store/placesSlice';
import { Map as MapIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import type { Place } from './store/placesSlice';
import type { RootState, AppDispatch } from './store/store';

import { LoadingSpinner } from './components/LoadingSpinner';
import { SearchAutocomplete } from './components/SearchAutocomplete';
import { PlaceDetailsCard } from './components/PlaceDetailsCard';
import { SearchHistoryList } from './components/SearchHistoryList';

const libraries: ("places")[] = ['places'];
const API_KEY = "AIzaSyCfXg9Ln34jjPg3YezpOZrEZ6wMX3tW5os";

const defaultCenter = {
  lat: 3.1390,
  lng: 101.6869
};

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries,
    version: 'beta',
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [inputValue, setInputValue] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { searches, favoriteStatus, error } = useSelector((state: RootState) => state.places);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setMapCenter({ lat: place.lat, lng: place.lng });
    dispatch(addSearch(place));
  };

  const handleHistorySelect = (place: Place) => {
    setSelectedPlace(place);
    setMapCenter({ lat: place.lat, lng: place.lng });
    setInputValue(place.name);
  };

  const handleRemoveSearch = (placeId: string) => {
    dispatch(removeSearch(placeId));
  };

  const handleClearSearches = () => {
    dispatch(clearSearches());
  };

  const handleFavorite = () => {
    if (selectedPlace) {
      dispatch(saveFavoritePlace(selectedPlace));
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <p className="text-rose-500 font-medium">Error loading Google Maps</p>
          <p className="text-sm text-slate-500 mt-2">Please check your API key or network connection.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Initializing Workspace..." className="scale-125" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* Sidebar - Modern SaaS UI */}
      <div className="w-full md:w-[420px] h-full bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 border-r border-slate-100 flex-shrink-0 relative">

        {/* Header */}
        <header className="px-8 pt-8 pb-6 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GeoManager</h1>
          </div>
          <p className="text-slate-500 text-sm">Enterprise location intelligence.</p>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <SearchAutocomplete
            isLoaded={isLoaded}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onPlaceSelect={handlePlaceSelect}
          />

          <PlaceDetailsCard
            selectedPlace={selectedPlace}
            favoriteStatus={favoriteStatus}
            error={error}
            handleFavorite={handleFavorite}
          />

          <SearchHistoryList
            searches={searches}
            onHistorySelect={handleHistorySelect}
            onRemoveSearch={handleRemoveSearch}
            onClearSearches={handleClearSearches}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-full relative bg-slate-100">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={14}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapId: "DEMO_MAP_ID", // Adds modern map styling if configured
            styles: [ // Clean, minimal map style fallback
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              { featureType: "transit", stylers: [{ visibility: "off" }] }
            ]
          }}
        >
          {selectedPlace && (
            <Marker position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }} />
          )}
        </GoogleMap>
      </div>

    </div>
  );
}

export default App;
