import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Place } from '../store/placesSlice';

interface SearchAutocompleteProps {
  isLoaded: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onPlaceSelect: (place: Place) => void;
}

export function SearchAutocomplete({ isLoaded, inputValue, setInputValue, onPlaceSelect }: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sessionToken, setSessionToken] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);

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
    } catch (error: any) {
      console.error("Error fetching suggestions", error);
      
      // Check for Google Maps Quota Error (429)
      if (error?.message?.includes('Quota exceeded') || error?.message?.includes('429')) {
        toast.error(
          (t) => (
            <div className="flex flex-col gap-1">
              <span className="font-bold">Maximum Quota Reached</span>
              <span className="text-xs text-slate-300">
                Please change your API key or upgrade via the{' '}
                <a 
                  href="https://console.cloud.google.com/apis/api/places.googleapis.com/quotas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-indigo-300 hover:text-indigo-200"
                >
                  Google Cloud Console
                </a>.
              </span>
            </div>
          ),
          { duration: 6000 }
        );
      }
      
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

        onPlaceSelect(newPlace);
        setInputValue(place.displayName || place.formattedAddress || '');
        setSuggestions([]);
        setIsFocused(false);
        
        toast.success('Location selected successfully!');
        
        // Renew session token
        const placesLibrary: any = await google.maps.importLibrary('places');
        setSessionToken(new placesLibrary.AutocompleteSessionToken());
      }
    } catch (error) {
      console.error("Error fetching place details", error);
    }
  };

  return (
    <div className="relative mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">Search Location</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          // Delay hiding suggestions to allow click events to register
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for an address or place..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-slate-100 rounded-xl mt-2 shadow-xl max-h-72 overflow-y-auto ring-1 ring-black ring-opacity-5">
          {suggestions.map((suggestion, idx) => (
            <li 
              key={idx} 
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-b-0 transition-colors flex items-start space-x-3"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-slate-800">
                  {suggestion.placePrediction.text?.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
