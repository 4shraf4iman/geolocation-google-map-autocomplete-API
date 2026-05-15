import { useState, useCallback, useRef, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch, saveFavoritePlace } from './store/placesSlice';
import type { Place } from './store/placesSlice';
import type { RootState, AppDispatch } from './store/store';

const libraries: ("places")[] = ['places'];
const API_KEY = "AIzaSyDuQ1Fl5hmHh_qoVrMRXnQ4fDRuv4B3j50";

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

  // States for custom Autocomplete (New Places API)
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sessionToken, setSessionToken] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { searches, favoriteStatus, error } = useSelector((state: RootState) => state.places);

  // Initialize session token when API loads
  useEffect(() => {
    if (isLoaded) {
      google.maps.importLibrary('places').then((placesLibrary: any) => {
        setSessionToken(new placesLibrary.AutocompleteSessionToken());
      });
    }
  }, [isLoaded]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value || !isLoaded) {
      setSuggestions([]);
      return;
    }

    try {
      const placesLibrary: any = await google.maps.importLibrary('places');
      const request = {
        input: value,
        sessionToken: sessionToken,
      };
      const { suggestions } = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      setSuggestions(suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location'] });
      
      if (place.location) {
        const newPlace: Place = {
          placeId: place.id,
          name: place.displayName || 'Unknown',
          address: place.formattedAddress || '',
          lat: place.location.lat(),
          lng: place.location.lng()
        };

        setSelectedPlace(newPlace);
        setMapCenter({ lat: newPlace.lat, lng: newPlace.lng });
        dispatch(addSearch(newPlace));
        
        // Reset custom autocomplete
        setInputValue(place.displayName || place.formattedAddress || '');
        setSuggestions([]);
        
        // Renew session token
        const placesLibrary: any = await google.maps.importLibrary('places');
        setSessionToken(new placesLibrary.AutocompleteSessionToken());
      }
    } catch (error) {
      console.error("Error fetching place details", error);
    }
  };

  const handleFavorite = () => {
    if (selectedPlace) {
      dispatch(saveFavoritePlace(selectedPlace));
    }
  };

  if (loadError) return <div className="text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="text-gray-500">Loading Google Maps...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">Location Finder</h1>
          <p className="mt-2 text-blue-100">Find and save your favorite places.</p>
        </header>

        <div className="flex flex-col md:flex-row h-[600px]">
          <div className="w-full md:w-1/3 p-6 border-r border-gray-200 overflow-y-auto relative">
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter a location..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <li 
                      key={idx} 
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium text-gray-800">
                        {suggestion.placePrediction.text?.text}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedPlace && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h2 className="text-lg font-semibold text-blue-900 mb-1">{selectedPlace.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedPlace.address}</p>
                <button
                  onClick={handleFavorite}
                  disabled={favoriteStatus === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {favoriteStatus === 'loading' ? 'Saving...' : '⭐ Mark as Favorite'}
                </button>
                {favoriteStatus === 'succeeded' && (
                  <p className="text-green-600 text-xs mt-2 text-center">Successfully saved to favorites!</p>
                )}
                {favoriteStatus === 'failed' && (
                  <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
                )}
              </div>
            )}

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🕒</span> Search History
              </h3>
              {searches.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No recent searches.</p>
              ) : (
                <ul className="space-y-3">
                  {searches.map((s, idx) => (
                    <li key={idx} className="p-3 bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setSelectedPlace(s);
                        setMapCenter({ lat: s.lat, lng: s.lng });
                        setInputValue(s.name);
                      }}
                    >
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.address}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 h-full relative">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={14}
              options={{ disableDefaultUI: true, zoomControl: true }}
            >
              {selectedPlace && (
                <Marker position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }} />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
