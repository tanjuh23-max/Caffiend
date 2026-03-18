import { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronRight, Coffee, Zap, Leaf, Droplets, Pill } from 'lucide-react';
import { DRINKS, CATEGORIES, searchDrinks } from '../data/drinks';
import { useApp } from '../context/AppContext';

const CATEGORY_ICONS = {
  all: Search,
  coffee: Coffee,
  tea: Leaf,
  energy: Zap,
  soda: Droplets,
  supplement: Pill,
};

function DrinkRow({ drink, onAdd }) {
  return (
    <button
      onClick={() => onAdd(drink)}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] active:bg-[#333] transition-colors text-left"
    >
      <span className="text-2xl w-8 text-center">{drink.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{drink.name}</p>
        <p className="text-neutral-500 text-xs">{drink.size}</p>
      </div>
      <span className="text-brand-400 font-semibold text-sm shrink-0">{drink.caffeine}mg</span>
    </button>
  );
}

function CustomForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !caffeine) return;
    onAdd({ name: name.trim(), caffeine: parseFloat(caffeine), size: size.trim() || 'Custom', emoji: '☕' });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
      <h3 className="text-white font-semibold text-sm">Custom Entry</h3>
      <div>
        <label className="text-neutral-400 text-xs mb-1 block">Drink name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Starbucks Reserve"
          className="w-full bg-[#222] border border-[#333] rounded-xl px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-brand-500"
          autoFocus
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-neutral-400 text-xs mb-1 block">Caffeine (mg)</label>
          <input
            type="number"
            value={caffeine}
            onChange={e => setCaffeine(e.target.value)}
            placeholder="e.g. 150"
            min="0"
            max="1000"
            className="w-full bg-[#222] border border-[#333] rounded-xl px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-neutral-400 text-xs mb-1 block">Size (optional)</label>
          <input
            type="text"
            value={size}
            onChange={e => setSize(e.target.value)}
            placeholder="e.g. 16oz"
            className="w-full bg-[#222] border border-[#333] rounded-xl px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!name.trim() || !caffeine}
        className="w-full bg-brand-500 disabled:bg-[#333] disabled:text-neutral-600 text-black font-semibold rounded-xl py-3 text-sm transition-colors"
      >
        Add Entry
      </button>
    </form>
  );
}

export default function AddDrinkModal({ isOpen, onClose, prefill = null }) {
  const { addEntry } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showCustom, setShowCustom] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCategory('all');
      setShowCustom(false);
      if (prefill) {
        setShowCustom(true);
      }
    }
  }, [isOpen, prefill]);

  if (!isOpen) return null;

  const filtered = searchDrinks(query, category);

  const handleAdd = (drink) => {
    addEntry({
      name: drink.name,
      caffeine: drink.caffeine,
      size: drink.size || '',
      emoji: drink.emoji || '☕',
      drinkId: drink.id || null,
    });
    onClose();
  };

  const handleCustomAdd = (data) => {
    addEntry({ ...data, drinkId: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-[#111] rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-[#3a3a3a] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <h2 className="text-white font-bold text-lg">Add a Drink</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-neutral-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
            <Search size={15} className="text-neutral-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search drinks..."
              className="flex-1 bg-transparent text-white text-sm placeholder-neutral-600 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-neutral-500">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar shrink-0">
          {CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.id] || Search;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  category === cat.id
                    ? 'bg-brand-500 text-black'
                    : 'bg-[#1f1f1f] text-neutral-400 border border-[#2a2a2a]'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showCustom ? (
            <CustomForm
              onAdd={handleCustomAdd}
              onClose={() => setShowCustom(false)}
              prefill={prefill}
            />
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-neutral-500 gap-2">
                  <p className="text-sm">No results for "{query}"</p>
                  <button
                    onClick={() => setShowCustom(true)}
                    className="text-brand-400 text-sm font-medium"
                  >
                    + Add custom entry
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#1f1f1f]">
                  {filtered.map(drink => (
                    <DrinkRow key={drink.id} drink={drink} onAdd={handleAdd} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Custom entry toggle */}
        {!showCustom && (
          <div className="px-4 py-3 border-t border-[#1f1f1f] shrink-0">
            <button
              onClick={() => setShowCustom(true)}
              className="flex items-center justify-between w-full text-neutral-400 text-sm hover:text-white transition-colors"
            >
              <span>Not seeing your drink? Add custom</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom safe area */}
        <div className="h-safe-bottom" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  );
}
