import { Clock, Navigation, X, Trash2 } from 'lucide-react';
import type { Place } from '../store/placesSlice';

interface SearchHistoryListProps {
  searches: Place[];
  onHistorySelect: (place: Place) => void;
  onRemoveSearch: (placeId: string) => void;
  onClearSearches: () => void;
}

export function SearchHistoryList({ searches, onHistorySelect, onRemoveSearch, onClearSearches }: SearchHistoryListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h3>
        {searches.length > 0 && (
          <button 
            onClick={onClearSearches}
            className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>
      
      {searches.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl border-dashed">
          <p className="text-sm text-slate-400 font-medium">No recent searches</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {searches.map((s) => (
            <li 
              key={s.placeId} 
              className="group p-3 bg-white hover:bg-indigo-50 border border-slate-100 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow relative overflow-hidden"
              onClick={() => onHistorySelect(s)}
            >
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-400" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSearch(s.placeId);
                  }}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remove from history"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="pr-16">
                <p className="font-semibold text-slate-800 text-sm mb-0.5 truncate">{s.name}</p>
                <p className="text-xs text-slate-500 truncate">{s.address}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
