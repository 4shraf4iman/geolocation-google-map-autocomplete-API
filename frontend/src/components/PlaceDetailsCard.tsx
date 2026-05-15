import { useEffect } from 'react';
import { Star, Map as MapIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Place } from '../store/placesSlice';

interface PlaceDetailsCardProps {
  selectedPlace: Place | null;
  favoriteStatus: string;
  error?: string | null;
  handleFavorite: () => void;
}

export function PlaceDetailsCard({ selectedPlace, favoriteStatus, error, handleFavorite }: PlaceDetailsCardProps) {
  useEffect(() => {
    if (favoriteStatus === 'succeeded') {
      toast.success('Successfully saved to favorites!');
    } else if (favoriteStatus === 'failed') {
      toast.error(error || 'Failed to save location');
    }
  }, [favoriteStatus, error]);

  if (!selectedPlace) return null;

  return (
    <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1 leading-tight flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-indigo-500" />
            {selectedPlace.name}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed pl-7">{selectedPlace.address}</p>
        </div>
      </div>
      
      <button
        onClick={handleFavorite}
        disabled={favoriteStatus === 'loading'}
        className="w-full relative group overflow-hidden rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-medium py-3 px-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        {favoriteStatus === 'loading' ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <>
            <Star className="w-4 h-4 group-hover:fill-current transition-all" />
            <span>Mark as Favorite</span>
          </>
        )}
      </button>
    </div>
  );
}
