import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Check,
  BarChart3,
  Crown,
  Globe,
  Star,
  RotateCcw,
  Flame,
  Gem
} from 'lucide-react';
import { MEGA_POKEMON_DB } from './megaPokemonData';

// ============================================================================
// KONFIGURACJA TYPÓW
// ============================================================================
const ALL_TYPES = [
  { key: 'Normal', label: 'Normal', bg: 'bg-zinc-500/20', text: 'text-zinc-200', border: 'border-zinc-500/40', dot: '#a1a1aa', bar: 'bg-zinc-400' },
  { key: 'Fire', label: 'Fire', bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/40', dot: '#f97316', bar: 'bg-orange-500' },
  { key: 'Water', label: 'Water', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40', dot: '#3b82f6', bar: 'bg-blue-500' },
  { key: 'Grass', label: 'Grass', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: '#10b981', bar: 'bg-emerald-500' },
  { key: 'Electric', label: 'Electric', bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/40', dot: '#eab308', bar: 'bg-yellow-400' },
  { key: 'Ice', label: 'Ice', bg: 'bg-cyan-400/20', text: 'text-cyan-200', border: 'border-cyan-400/40', dot: '#22d3ee', bar: 'bg-cyan-400' },
  { key: 'Fighting', label: 'Fighting', bg: 'bg-red-600/20', text: 'text-red-300', border: 'border-red-500/40', dot: '#ef4444', bar: 'bg-red-500' },
  { key: 'Poison', label: 'Poison', bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40', dot: '#a855f7', bar: 'bg-purple-500' },
  { key: 'Ground', label: 'Ground', bg: 'bg-amber-600/20', text: 'text-amber-300', border: 'border-amber-600/40', dot: '#d97706', bar: 'bg-amber-500' },
  { key: 'Flying', label: 'Flying', bg: 'bg-indigo-400/20', text: 'text-indigo-200', border: 'border-indigo-400/40', dot: '#818cf8', bar: 'bg-indigo-400' },
  { key: 'Psychic', label: 'Psychic', bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/40', dot: '#ec4899', bar: 'bg-pink-500' },
  { key: 'Bug', label: 'Bug', bg: 'bg-lime-500/20', text: 'text-lime-300', border: 'border-lime-500/40', dot: '#84cc16', bar: 'bg-lime-500' },
  { key: 'Rock', label: 'Rock', bg: 'bg-stone-500/20', text: 'text-stone-300', border: 'border-stone-500/40', dot: '#a8a29e', bar: 'bg-stone-400' },
  { key: 'Ghost', label: 'Ghost', bg: 'bg-violet-600/20', text: 'text-violet-300', border: 'border-violet-500/40', dot: '#8b5cf6', bar: 'bg-violet-500' },
  { key: 'Dragon', label: 'Dragon', bg: 'bg-indigo-600/20', text: 'text-indigo-300', border: 'border-indigo-500/40', dot: '#6366f1', bar: 'bg-indigo-500' },
  { key: 'Dark', label: 'Dark', bg: 'bg-neutral-700/40', text: 'text-neutral-300', border: 'border-neutral-600/50', dot: '#737373', bar: 'bg-neutral-400' },
  { key: 'Steel', label: 'Steel', bg: 'bg-slate-400/20', text: 'text-slate-200', border: 'border-slate-400/40', dot: '#94a3b8', bar: 'bg-slate-400' },
  { key: 'Fairy', label: 'Fairy', bg: 'bg-rose-400/20', text: 'text-rose-200', border: 'border-rose-400/40', dot: '#fb7185', bar: 'bg-rose-400' }
];

const TYPE_MAP = ALL_TYPES.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

const MEGA_LEVEL_BONUS = {
  0: 'Brak aktywnych bonusów Mega ewolucji',
  1: 'Lvl 1 · +1 Candy za złapanie (pasujący typ)',
  2: 'Lvl 2 · +1 Candy · +10% szansy XL · +50 XP',
  3: 'Lvl 3 · +2 Candy · +25% szansy XL · +100 XP',
  4: 'Lvl 4 (SUPER MAX) · Maksymalny bonus Candy, XL i XP'
};

const getSpriteUrls = (dexNumber, pokeapiId, isShiny) => {
  const candidates = [];
  if (isShiny) {
    if (pokeapiId) {
      candidates.push(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokeapiId}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokeapiId}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokeapiId}.png`
      );
    }
    candidates.push(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${dexNumber}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${dexNumber}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${dexNumber}.png`
    );
  } else {
    if (pokeapiId) {
      candidates.push(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeapiId}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeapiId}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeapiId}.png`
      );
    }
    candidates.push(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${dexNumber}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexNumber}.png`
    );
  }
  return candidates;
};

function PokemonCrossfadeSprite({ dexNumber, pokeapiId, name, isShiny, isMuted }) {
  const [normalStage, setNormalStage] = useState(0);
  const [shinyStage, setShinyStage] = useState(0);
  const [normalFailedAll, setNormalFailedAll] = useState(false);
  const [shinyFailedAll, setShinyFailedAll] = useState(false);

  const normalUrls = useMemo(() => getSpriteUrls(dexNumber, pokeapiId, false), [dexNumber, pokeapiId]);
  const shinyUrls = useMemo(() => getSpriteUrls(dexNumber, pokeapiId, true), [dexNumber, pokeapiId]);

  const currentNormalSrc = normalUrls[Math.min(normalStage, normalUrls.length - 1)];
  const currentShinySrc = shinyUrls[Math.min(shinyStage, shinyUrls.length - 1)];

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {!normalFailedAll ? (
        <img
          src={currentNormalSrc}
          alt={name}
          loading="lazy"
          onError={() => {
            if (normalStage < normalUrls.length - 1) setNormalStage((s) => s + 1);
            else setNormalFailedAll(true);
          }}
          className={`absolute inset-0 w-14 h-14 object-contain transition-all duration-500 ease-out ${
            isShiny ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
          } ${isMuted && !isShiny ? 'grayscale opacity-60' : ''}`}
        />
      ) : (
        !isShiny && (
          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-500">
            #{dexNumber}
          </div>
        )
      )}

      {!shinyFailedAll ? (
        <img
          src={currentShinySrc}
          alt={`Shiny ${name}`}
          loading="lazy"
          onError={() => {
            if (shinyStage < shinyUrls.length - 1) setShinyStage((s) => s + 1);
            else setShinyFailedAll(true);
          }}
          className={`absolute inset-0 w-14 h-14 object-contain transition-all duration-500 ease-out ${
            isShiny
              ? 'opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(234,179,8,0.45)]'
              : 'opacity-0 scale-90 pointer-events-none'
          }`}
        />
      ) : (
        isShiny && (
          <div className="w-9 h-9 rounded-full bg-amber-950/50 border border-amber-500/50 flex items-center justify-center text-[10px] font-mono font-bold text-amber-300">
            #{dexNumber}
          </div>
        )
      )}
    </div>
  );
}

function CategoryCornerIcon({ category }) {
  if (category === 'Legendary') {
    return (
      <span title="Legendary" className="w-5 h-5 rounded-md bg-red-950/95 border border-red-500/60 text-red-400 flex items-center justify-center shadow">
        <Crown className="w-3 h-3" />
      </span>
    );
  }
  if (category === 'Mythical') {
    return (
      <span title="Mythical" className="w-5 h-5 rounded-md bg-purple-950/95 border border-purple-400/60 text-purple-400 flex items-center justify-center shadow">
        <Gem className="w-3 h-3" />
      </span>
    );
  }
  if (category === 'Regional') {
    return (
      <span title="Regional" className="w-5 h-5 rounded-md bg-emerald-950/95 border border-emerald-400/60 text-emerald-400 flex items-center justify-center shadow">
        <Globe className="w-3 h-3" />
      </span>
    );
  }
  return null;
}

function AppHeaderIcon({ className = 'w-10 h-10' }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (imgFailed) {
    return (
      <div className={`${className} rounded-xl bg-gradient-to-b from-[#dc2626] via-[#18181b] to-[#f4f4f5] border border-zinc-700 flex items-center justify-center shrink-0 shadow-md`}>
        <span className="w-3.5 h-3.5 rounded-full bg-[#0f0f12] border-2 border-white" />
      </div>
    );
  }
  return (
    <img src="/icon.PNG" alt="MegaDex GO" onError={() => setImgFailed(true)} className={`${className} rounded-xl object-cover shrink-0 border border-zinc-800 shadow-md bg-[#0f0f12]`} />
  );
}

function SplashScreen({ isFadingOut }) {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <div className={`fixed inset-0 z-[100] bg-[#0f0f12] flex flex-col items-center justify-center px-6 transition-opacity duration-500 ease-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        <div className="w-32 h-32 rounded-3xl bg-[#18181b] border-2 border-zinc-800 shadow-2xl shadow-black flex items-center justify-center overflow-hidden mb-6 relative">
          {!logoFailed ? (
            <img src="/icon.PNG" alt="MegaDex GO" onError={() => setLogoFailed(true)} className="w-full h-full object-contain p-2" />
          ) : (
            <div className="w-full h-full flex flex-col relative">
              <div className="h-1/2 bg-[#dc2626]" />
              <div className="h-2 bg-[#0f0f12]" />
              <div className="flex-1 bg-[#f4f4f5]" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black tracking-widest text-white uppercase">
          MEGADEX <span className="text-[#dc2626]">GO</span>
        </h1>
        <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase mt-1.5">Tracker Mega Ewolucji</p>
        <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 mt-8">
          <div className="h-full bg-[#dc2626] rounded-full animate-[splashProgress_1.45s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}

function PokemonNameContainer({ name }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const overflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsOverflowing(overflowing);
        if (overflowing) {
          const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
          textRef.current.style.setProperty('--marquee-distance', `-${diff + 6}px`);
        }
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [name]);

  return (
    <div ref={containerRef} className="truncate overflow-hidden relative max-w-full">
      <h2
        ref={textRef}
        className={`text-sm font-bold text-white whitespace-nowrap ${isOverflowing ? 'marquee-text' : 'truncate'}`}
      >
        {name}
      </h2>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeSplash(true), 1200);
    const hideTimer = setTimeout(() => setShowSplash(false), 1700);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDraggingTab, setIsDraggingTab] = useState(false);
  const viewportRef = useRef(null);
  const swipeRef = useRef({ active: false, startX: 0, startY: 0, lock: null });

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const listContainerRef = useRef(null);

  const handleDexScroll = (e) => {
    const target = e.currentTarget;
    const threshold = 30;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= threshold;
    setIsScrolledToBottom(isAtBottom);
  };

  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('megadex_go_progress_v3');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem('megadex_go_progress_v3', JSON.stringify(userProgress)); } catch (e) {}
  }, [userProgress]);

  const [cardShineBurst, setCardShineBurst] = useState({});

  const triggerCardShine = (pokemonId, type) => {
    const burstKey = Date.now() + Math.random();
    setCardShineBurst((prev) => ({ ...prev, [pokemonId]: { type, key: burstKey } }));
    setTimeout(() => {
      setCardShineBurst((prev) => {
        if (prev[pokemonId]?.key !== burstKey) return prev;
        const copy = { ...prev }; delete copy[pokemonId]; return copy;
      });
    }, 750);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const [isSheetMounted, setIsSheetMounted] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const sheetDragStartRef = useRef(null);

  const [showHundo, setShowHundo] = useState(true);
  const [showShiny, setShowShiny] = useState(true);
  const [showReleased, setShowReleased] = useState(() => {
    try {
      const saved = localStorage.getItem('megadex_go_show_released');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  const [showUnreleased, setShowUnreleased] = useState(() => {
    try {
      const saved = localStorage.getItem('megadex_go_show_unreleased');
      return saved !== null ? JSON.parse(saved) : false;
    } catch { return false; }
  });
  useEffect(() => {
    try {
      localStorage.setItem('megadex_go_show_released', JSON.stringify(showReleased));
      localStorage.setItem('megadex_go_show_unreleased', JSON.stringify(showUnreleased));
    } catch (e) {}
  }, [showReleased, showUnreleased]);
  const [summaryMode, setSummaryMode] = useState('released');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEX_ASC');

  // Funkcja resetująca pozycję listy do góry
  const resetScrollToTop = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
      setIsScrolledToBottom(false);
    }
  };

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toggleSearch = () => {
    if (isSearchOpen) { setSearchQuery(''); setIsSearchOpen(false); }
    else { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 60); }
  };

  const openFilterSheet = () => {
    setIsSheetMounted(true); setSheetDragY(0);
    requestAnimationFrame(() => { requestAnimationFrame(() => { setIsSheetVisible(true); }); });
  };

  const closeFilterSheet = () => {
    setIsSheetVisible(false); setIsDraggingSheet(false);
    setTimeout(() => { setIsSheetMounted(false); setSheetDragY(0); }, 300);
  };

  const handleSheetDragStart = (clientY) => { sheetDragStartRef.current = clientY; setIsDraggingSheet(true); };
  const handleSheetDragMove = (clientY) => {
    if (sheetDragStartRef.current === null) return;
    const deltaY = clientY - sheetDragStartRef.current;
    setSheetDragY(deltaY > 0 ? deltaY : 0);
  };
  const handleSheetDragEnd = () => {
    if (sheetDragStartRef.current === null) return;
    sheetDragStartRef.current = null; setIsDraggingSheet(false);
    if (sheetDragY > 110) closeFilterSheet(); else setSheetDragY(0);
  };

  const onTabTouchStart = (clientX, clientY) => {
    if (isSheetMounted) return;
    swipeRef.current = { active: true, startX: clientX, startY: clientY, lock: null };
  };

  const onTabTouchMove = (clientX, clientY) => {
    const g = swipeRef.current;
    if (!g.active) return;
    const dx = clientX - g.startX; const dy = clientY - g.startY;
    if (!g.lock) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.15) { g.lock = 'horizontal'; setIsDraggingTab(true); }
      else { g.lock = 'vertical'; g.active = false; return; }
    }
    if (g.lock === 'horizontal') {
      const hittingEdge = (activeTab === 0 && dx > 0) || (activeTab === 1 && dx < 0);
      if (hittingEdge) {
        setDragOffsetPx(Math.sign(dx) * Math.min(54, Math.pow(Math.abs(dx), 0.72)));
      } else {
        const width = viewportRef.current?.offsetWidth || 400;
        setDragOffsetPx(Math.max(-width, Math.min(width, dx)));
      }
    }
  };

  const onTabTouchEnd = () => {
    const g = swipeRef.current;
    if (!g.active) return;
    if (g.lock === 'horizontal') {
      const width = viewportRef.current?.offsetWidth || 400;
      const threshold = width * 0.22;
      if (activeTab === 0 && dragOffsetPx < -threshold) setActiveTab(1);
      else if (activeTab === 1 && dragOffsetPx > threshold) setActiveTab(0);
    }
    swipeRef.current = { active: false, startX: 0, startY: 0, lock: null };
    setIsDraggingTab(false); setDragOffsetPx(0);
  };

  const toggleCategoryFilter = (catKey) => {
    setSelectedCategories((prev) => prev.includes(catKey) ? prev.filter((c) => c !== catKey) : [...prev, catKey]);
    resetScrollToTop();
  };

  const toggleTypeFilter = (typeKey) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeKey)) return prev.filter((t) => t !== typeKey);
      if (prev.length >= 2) { showToast('Możesz wybrać maksymalnie 2 typy naraz'); return prev; }
      return [...prev, typeKey];
    });
    resetScrollToTop();
  };

  const getProgress = (id) => {
    const p = userProgress[id];
    return { isHundo: Boolean(p?.isHundo), isShiny: Boolean(p?.isShiny), megaLevel: typeof p?.megaLevel === 'number' ? p.megaLevel : 0 };
  };

  const toggleHundo = (pokemon) => {
    const curr = getProgress(pokemon.id);
    const next = !curr.isHundo;
    setUserProgress((prev) => ({ ...prev, [pokemon.id]: { ...curr, isHundo: next } }));
    if (next) { triggerCardShine(pokemon.id, 'hundo'); showToast(`${pokemon.name} — zapisano jako hundo`); }
    else { showToast(`${pokemon.name} — usunięto hundo`); }
  };

  const toggleShiny = (pokemon) => {
    const curr = getProgress(pokemon.id);
    const next = !curr.isShiny;
    setUserProgress((prev) => ({ ...prev, [pokemon.id]: { ...curr, isShiny: next } }));
    if (next) { triggerCardShine(pokemon.id, 'shiny'); showToast(`${pokemon.name} — aktywowano wersję Shiny`); }
    else { showToast(`${pokemon.name} — wersja standardowa`); }
  };

  const setMegaLevel = (pokemon, lvl) => {
    if (pokemon.released !== 1) return;
    const maxLvl = pokemon.super_mega === 1 ? 4 : 3;
    const clampedLvl = Math.min(lvl, maxLvl);
    const curr = getProgress(pokemon.id);
    const wasZero = curr.megaLevel === 0;
    setUserProgress((prev) => ({ ...prev, [pokemon.id]: { ...curr, megaLevel: clampedLvl } }));
    if (wasZero && clampedLvl > 0) {
      triggerCardShine(pokemon.id, `mega_${clampedLvl}`);
    }
  };

  const fullPokemonList = useMemo(() => MEGA_POKEMON_DB, []);

  const summaryStats = useMemo(() => {
    const targetList = fullPokemonList.filter((p) => (summaryMode === 'released' ? p.released === 1 : p.released === 0));
    const total = targetList.length;
    const hundoCount = targetList.filter((p) => getProgress(p.id).isHundo).length;
    const shinyEligibleList = targetList.filter((p) => p.shiny_released === 1 || p.released !== 1);
    const shinyTotal = shinyEligibleList.length;
    const shinyCount = shinyEligibleList.filter((p) => getProgress(p.id).isShiny).length;
    const superMegaList = targetList.filter((p) => p.super_mega === 1);
    const levels = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    targetList.forEach((p) => { const lvl = getProgress(p.id).megaLevel; levels[lvl] = (levels[lvl] || 0) + 1; });

    const specialCategories = [
      { key: 'Legendary', label: 'Legendary' },
      { key: 'Mythical', label: 'Mythical' },
      { key: 'Regional', label: 'Regional' }
    ].map((cat) => {
      const items = targetList.filter((p) => p.category === cat.key);
      const shinyItems = items.filter((p) => p.shiny_released === 1 || p.released !== 1);
      const hundo = items.filter((p) => getProgress(p.id).isHundo).length;
      const shiny = shinyItems.filter((p) => getProgress(p.id).isShiny).length;
      const unlocked = items.filter((p) => getProgress(p.id).megaLevel > 0 || getProgress(p.id).isShiny || getProgress(p.id).isHundo).length;
      return { ...cat, total: items.length, shinyTotal: shinyItems.length, hundo, shiny, unlocked, pct: items.length > 0 ? Math.round((unlocked / items.length) * 100) : 0 };
    });

    const typeBreakdown = ALL_TYPES.map((t) => {
      const items = targetList.filter((p) => p.types.includes(t.key));
      const shinyItems = items.filter((p) => p.shiny_released === 1 || p.released !== 1);
      const hundo = items.filter((p) => getProgress(p.id).isHundo).length;
      const shiny = shinyItems.filter((p) => getProgress(p.id).isShiny).length;
      const unlocked = items.filter((p) => getProgress(p.id).megaLevel > 0 || getProgress(p.id).isShiny || getProgress(p.id).isHundo).length;
      return { ...t, total: items.length, shinyTotal: shinyItems.length, hundo, shiny, unlocked, pct: items.length > 0 ? Math.round((unlocked / items.length) * 100) : 0 };
    }).filter((t) => t.total > 0);

    return {
      total, hundoCount, hundoPct: total > 0 ? Math.round((hundoCount / total) * 100) : 0,
      shinyCount, shinyTotal, shinyPct: shinyTotal > 0 ? Math.round((shinyCount / shinyTotal) * 100) : 0,
      superMegaTotal: superMegaList.length, levels, unlockedTotal: total - levels[0], specialCategories, typeBreakdown
    };
  }, [fullPokemonList, summaryMode, userProgress]);

const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!showHundo) count += 1;
    if (!showShiny) count += 1;
    if (selectedCategories.length > 0) count += 1;
    if (selectedTypes.length > 0) count += 1;
    if (levelFilter !== 'ALL') count += 1;
    return count;
  }, [showHundo, showShiny, selectedCategories, selectedTypes, levelFilter]);

  const resetAllFilters = () => {
    setShowHundo(true); setShowShiny(true); setShowReleased(true); setShowUnreleased(false); setSelectedCategories([]); setSelectedTypes([]); setLevelFilter('ALL'); setSortBy('DEX_ASC');
    resetScrollToTop();
  };

  const filteredPokemon = useMemo(() => {
    return fullPokemonList.filter((poke) => {
      const isRel = poke.released === 1;
      if (showReleased && !showUnreleased && !isRel) return false;
      if (!showReleased && showUnreleased && isRel) return false;
      if (!showReleased && !showUnreleased) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = poke.name.toLowerCase().includes(q);
        const matchDex = String(poke.dexNumber).includes(q.replace('#', ''));
        if (!matchName && !matchDex) return false;
      }
      const prog = getProgress(poke.id);
      if (!showHundo && prog.isHundo) return false;
      if (!showShiny && prog.isShiny) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(poke.category)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.every((t) => poke.types.includes(t))) return false;
      if (levelFilter !== 'ALL' && prog.megaLevel !== Number(levelFilter)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'LEVEL_DESC') {
        const lvlA = getProgress(a.id).megaLevel; const lvlB = getProgress(b.id).megaLevel;
        if (lvlB !== lvlA) return lvlB - lvlA;
        return a.dexNumber - b.dexNumber;
      }
      if (a.dexNumber !== b.dexNumber) return a.dexNumber - b.dexNumber;
      return a.id.localeCompare(b.id);
    });
  }, [fullPokemonList, searchQuery, showHundo, showShiny, showReleased, showUnreleased, selectedCategories, selectedTypes, levelFilter, sortBy, userProgress]);

  const getShineGradientClass = (type) => {
    switch (type) {
      case 'hundo': return 'bg-gradient-to-r from-transparent via-red-500/45 to-transparent';
      case 'shiny': return 'bg-gradient-to-r from-transparent via-amber-300/45 to-transparent';
      default: return 'bg-gradient-to-r from-transparent via-white/35 to-transparent';
    }
  };

  return (
    <div className="h-[100dvh] bg-[#08080a] text-[#f4f4f5] flex justify-center selection:bg-[#dc2626] selection:text-white font-sans overflow-hidden">
      <style>{`
        @keyframes cardShineSweep {
          0% { transform: translateX(-140%) skewX(-22deg); opacity: 0; }
          18% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(240%) skewX(-22deg); opacity: 0; }
        }
        @keyframes splashProgress {
          0% { width: 0%; } 65% { width: 82%; } 100% { width: 100%; }
        }
        @keyframes marqueeBounce {
          0%, 15% { transform: translateX(0); }
          85%, 100% { transform: translateX(var(--marquee-distance, -30px)); }
        }
        .animate-card-shine { animation: cardShineSweep 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .marquee-text {
          display: inline-block;
          white-space: nowrap;
          animation: marqueeBounce 6s ease-in-out infinite alternate;
        }
      `}</style>

      {showSplash && <SplashScreen isFadingOut={fadeSplash} />}

      <div className="w-full max-w-md h-full bg-[#0f0f12] flex flex-col relative shadow-2xl shadow-black sm:border-x sm:border-zinc-800 overflow-hidden">
        
        {/* NAGŁÓWEK */}
        <header className="shrink-0 z-30 bg-[#141418] border-b border-zinc-800 relative">
          <div className="absolute top-0 left-0 right-0 bg-[#141418]" style={{ height: 'env(safe-area-inset-top)', transform: 'translateY(-100%)' }} />
          
          <div className="px-4 py-3 bg-[#141418] pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AppHeaderIcon className="w-10 h-10" />
                <div>
                  <h1 className="text-base font-black tracking-tight text-white leading-tight">
                    MegaDex <span className="text-[#dc2626]">GO</span>
                  </h1>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Hundo: <strong className="text-white">{summaryStats.hundoCount}/{summaryStats.total}</strong>
                    <span className="mx-1.5 text-zinc-600">•</span>
                    Shiny: <strong className="text-amber-400">{summaryStats.shinyCount}/{summaryStats.shinyTotal}</strong>
                  </p>
                </div>
              </div>

              {activeTab === 0 && (
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-label="Szukaj"
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 ${
                    isSearchOpen || searchQuery
                      ? 'bg-[#dc2626] border-red-400 text-white shadow-md shadow-red-950/50'
                      : 'bg-[#0f0f12] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
              )}
            </div>

            {activeTab === 0 && (
              <div className={`grid transition-all duration-300 ease-out ${isSearchOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); resetScrollToTop(); }}
                      placeholder="Szukaj Mega ewolucji (nazwa lub #Dex)..."
                      className="w-full bg-[#0f0f12] text-sm text-white placeholder-zinc-500 pl-10 pr-9 py-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => { setSearchQuery(''); resetScrollToTop(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* KONTENER GŁÓWNY */}
        <div
          ref={viewportRef}
          onTouchStart={(e) => onTabTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => onTabTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={onTabTouchEnd}
          onMouseDown={(e) => { if (e.button === 0) onTabTouchStart(e.clientX, e.clientY); }}
          onMouseMove={(e) => { if (swipeRef.current.active) onTabTouchMove(e.clientX, e.clientY); }}
          onMouseUp={onTabTouchEnd}
          onMouseLeave={() => { if (swipeRef.current.active) onTabTouchEnd(); }}
          className="flex-1 relative overflow-hidden select-none"
        >
          <div
            style={{
              width: '200%',
              transform: `translate3d(calc(${-activeTab * 50}% + ${dragOffsetPx}px), 0, 0)`,
              transition: isDraggingTab ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            className="h-full flex"
          >
            {/* EKRAN 1: MEGADEX */}
            <div
              ref={listContainerRef}
              onScroll={handleDexScroll}
              className="w-1/2 h-full overflow-y-auto overscroll-y-contain px-4 pt-3 pb-[74px] space-y-3"
            >
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pb-1">
                  {!showHundo && (
                    <button onClick={() => { setShowHundo(true); resetScrollToTop(); }} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#dc2626]/20 text-red-200 border border-[#dc2626]/50">
                      Ukryto Hundo <X className="w-3 h-3" />
                    </button>
                  )}
                  {!showShiny && (
                    <button onClick={() => { setShowShiny(true); resetScrollToTop(); }} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/50">
                      Ukryto Shiny <X className="w-3 h-3" />
                    </button>
                  )}
                  {(!showReleased || showUnreleased) && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {showReleased && showUnreleased ? 'Wszystkie' : showReleased ? 'Tylko Wydane' : 'Tylko Niewydane'}
                    </span>
                  )}
                  {selectedCategories.map((catKey) => (
                    <button key={catKey} onClick={() => toggleCategoryFilter(catKey)} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600">
                      {catKey} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedTypes.map((tKey) => (
                    <button key={tKey} onClick={() => toggleTypeFilter(tKey)} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-white border border-zinc-600">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_MAP[tKey]?.dot }} />
                      {TYPE_MAP[tKey]?.label} <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button onClick={resetAllFilters} className="text-[11px] text-zinc-400 hover:text-white underline ml-auto">Wyczyść</button>
                </div>
              )}

              {filteredPokemon.length === 0 ? (
                <div className="text-center py-14 px-4 bg-[#18181b] rounded-2xl border border-zinc-800 mt-2">
                  <AppHeaderIcon className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <p className="text-sm font-bold text-white">Brak pasujących Mega ewolucji</p>
                  <button onClick={resetAllFilters} className="mt-4 px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-red-500 text-xs font-bold text-white transition-colors">
                    Resetuj filtry
                  </button>
                </div>
              ) : (
                filteredPokemon.map((pokemon) => {
                  const { isHundo, isShiny, megaLevel } = getProgress(pokemon.id);
                  const shineBurst = cardShineBurst[pokemon.id];
                  const isReleased = pokemon.released === 1;
                  
                  const shouldHighlightMega = isReleased && megaLevel > 0 && !isHundo && !(isShiny && pokemon.shiny_released === 1);

                  let cardBorderClass = 'bg-[#18181b] border-zinc-800';
                  if (!isReleased) {
                    if (isHundo) cardBorderClass = 'bg-[#1b1719] border-[#dc2626] border-dashed shadow-md shadow-red-950/20';
                    else if (isShiny) cardBorderClass = 'bg-[#1a1916] border-amber-500/60 border-dashed';
                    else cardBorderClass = 'bg-[#18181b] border-zinc-700 border-dashed opacity-95';
                  } else {
                    if (shouldHighlightMega) cardBorderClass = 'bg-[#1c1c21] border-white shadow-md shadow-white/10';
                    else if (isHundo) cardBorderClass = 'bg-[#1b1719] border-[#dc2626] shadow-md shadow-red-950/20';
                    else if (isShiny && pokemon.shiny_released === 1) cardBorderClass = 'bg-[#1a1916] border-amber-500/60';
                  }

                  return (
                    <div key={pokemon.id} className={`relative overflow-hidden rounded-2xl p-3.5 border transition-colors duration-200 ${cardBorderClass}`}>
                      {shineBurst && (
                        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                          <div className={`w-1/2 h-full animate-card-shine ${getShineGradientClass(shineBurst.type)}`} />
                        </div>
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <div className={`relative w-16 h-16 rounded-xl bg-[#0f0f12] border flex items-center justify-center shrink-0 transition-colors duration-300 ${shouldHighlightMega ? 'border-white' : isShiny && (pokemon.shiny_released === 1 || !isReleased) ? 'border-amber-400/70' : isHundo ? 'border-[#dc2626]' : 'border-zinc-800'}`}>
                          <PokemonCrossfadeSprite
                            dexNumber={pokemon.dexNumber}
                            pokeapiId={pokemon.pokeapiId}
                            name={pokemon.name}
                            isShiny={isShiny && (pokemon.shiny_released === 1 || !isReleased)}
                            isMuted={!isHundo && !isShiny && (isReleased ? megaLevel === 0 : true)}
                          />
                          {pokemon.category !== 'Standard' && (
                            <div className="absolute -top-1.5 -right-1.5"><CategoryCornerIcon category={pokemon.category} /></div>
                          )}
                          {isShiny && (pokemon.shiny_released === 1 || !isReleased) && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 text-[#0f0f12] flex items-center justify-center shadow">
                              <Sparkles className="w-2.5 h-2.5 fill-[#0f0f12]" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <PokemonNameContainer name={pokemon.name} />
                            <span className="text-[10px] font-mono font-bold bg-[#222227] text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/80 shrink-0">
                              #{String(pokemon.dexNumber).padStart(3, '0')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {pokemon.types.map((typeKey) => {
                              const style = TYPE_MAP[typeKey] || TYPE_MAP.Normal;
                              return (
                                <span key={typeKey} className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                                  {style.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleHundo(pokemon)}
                            className={`flex flex-col items-center justify-center w-13 h-14 px-2 rounded-xl border transition-all duration-300 active:scale-95 ${isHundo ? 'bg-[#dc2626] text-white border-red-300 shadow-md shadow-red-950/50 font-black' : 'bg-[#0f0f12] text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'}`}
                          >
                            <Flame className={`w-4 h-4 mb-0.5 ${isHundo ? 'fill-white text-white' : 'text-zinc-600'}`} />
                            <span className="text-[10px] font-black tracking-tight leading-none">HUNDO</span>
                          </button>

                          {(pokemon.shiny_released === 1 || !isReleased) && (
                            <button
                              type="button"
                              onClick={() => toggleShiny(pokemon)}
                              className={`flex flex-col items-center justify-center w-13 h-14 px-2 rounded-xl border transition-all duration-300 active:scale-95 ${isShiny ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-zinc-950 border-amber-200 shadow-md shadow-amber-950/50 font-black' : 'bg-[#0f0f12] text-zinc-500 border-zinc-800 hover:border-amber-500/40 hover:text-amber-300/80'}`}
                            >
                              <Star className={`w-4 h-4 mb-0.5 ${isShiny ? 'fill-zinc-950 text-zinc-950' : 'text-zinc-600'}`} />
                              <span className="text-[10px] font-black tracking-tight leading-none">SHINY</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Poziomy Mega dla wydanych lub komunikat Wkrótce dla niewydanych */}
                      {isReleased ? (
                        <div className="relative z-10 mt-3 pt-2.5 border-t border-zinc-800/90">
                          <div className={`grid gap-1.5 ${pokemon.super_mega === 1 ? 'grid-cols-5' : 'grid-cols-4'}`}>
                            {(pokemon.super_mega === 1 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3]).map((lvl) => {
                              const active = megaLevel === lvl;
                              let btnStyle = 'bg-[#0f0f12] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200';
                              if (active) {
                                if (lvl === 0) btnStyle = 'bg-zinc-700 text-white border-zinc-500';
                                else if (lvl === 1) btnStyle = 'bg-zinc-200 text-[#0f0f12] border-white font-extrabold';
                                else if (lvl === 2) btnStyle = 'bg-white text-[#0f0f12] border-white font-extrabold';
                                else if (lvl === 3) btnStyle = 'bg-[#dc2626] text-white border-red-400 font-extrabold';
                                else if (lvl === 4) btnStyle = 'bg-gradient-to-r from-red-600 via-[#dc2626] to-amber-500 text-white border-amber-300 font-black shadow-sm';
                              }
                              return (
                                <button key={lvl} type="button" onClick={() => setMegaLevel(pokemon, lvl)} className={`py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 active:scale-95 ${btnStyle}`}>
                                  {lvl === 0 ? 'Brak' : `Lvl ${lvl}`}
                                </button>
                              );
                            })}
                          </div>
                          <p className={`mt-1.5 text-[11px] px-1 ${megaLevel === 4 ? 'text-amber-300 font-semibold' : megaLevel === 3 ? 'text-red-300 font-semibold' : megaLevel > 0 ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            {MEGA_LEVEL_BONUS[megaLevel]}
                          </p>
                        </div>
                      ) : (
                        <div className="relative z-10 mt-3 pt-2.5 border-t border-zinc-800/90 text-center">
                          <span className="text-[11px] font-semibold text-indigo-300 tracking-wide uppercase">
                            Wkrótce w Pokémon GO
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* EKRAN 2: PODSUMOWANIE */}
            <div className="w-1/2 h-full overflow-y-auto overscroll-y-contain px-4 pt-4 pb-4 space-y-3">
              
              {/* Przełącznik trybu statystyk: Wydane / Niewydane */}
              <div className="bg-[#18181b] p-1.5 rounded-2xl border border-zinc-800 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setSummaryMode('released')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${summaryMode === 'released' ? 'bg-[#dc2626] text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  Wydane
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryMode('unreleased')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${summaryMode === 'unreleased' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  Niewydane
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <section className="rounded-2xl p-4 bg-[#18181b] border border-[#dc2626] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white bg-[#dc2626] px-2 py-0.5 rounded">
                      <Flame className="w-3 h-3 fill-white" /> Hundo
                    </span>
                    <StatRing percent={summaryStats.hundoPct} stroke="#dc2626" />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">{summaryStats.hundoCount}</span>
                      <span className="text-xs font-bold text-zinc-400">/ {summaryStats.total}</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full h-2 bg-[#0f0f12] rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full rounded-full bg-[#dc2626] transition-all duration-500" style={{ width: `${summaryStats.hundoPct}%` }} />
                  </div>
                </section>

                <section className="rounded-2xl p-4 bg-[#18181b] border border-amber-500/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-950 bg-gradient-to-r from-amber-300 to-yellow-500 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-zinc-950 text-zinc-950" /> Shiny
                    </span>
                    <StatRing percent={summaryStats.shinyPct} stroke="#facc15" />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">{summaryStats.shinyCount}</span>
                      <span className="text-xs font-bold text-zinc-400">/ {summaryStats.shinyTotal}</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full h-2 bg-[#0f0f12] rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-all duration-500" style={{ width: `${summaryStats.shinyPct}%` }} />
                  </div>
                </section>
              </div>

              {/* Rozkład poziomów Mega */}
              <div className={`grid transition-all duration-500 ease-out overflow-hidden ${summaryMode === 'released' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 -mt-6'}`}>
                <div className="overflow-hidden">
                  <section className="rounded-2xl p-4 bg-[#18181b] border border-zinc-800">
                    <h2 className="text-sm font-bold text-white mb-3">Poziomy Mega ewolucji</h2>
                    <div className="space-y-2">
                      {[
                        { lvl: 4, label: 'Poziom 4 (Super Max)', bar: 'bg-gradient-to-r from-[#dc2626] to-amber-400', badge: 'bg-amber-400 text-zinc-950 font-black' },
                        { lvl: 3, label: 'Poziom 3 (MAX)', bar: 'bg-[#dc2626]', badge: 'bg-[#dc2626] text-white' },
                        { lvl: 2, label: 'Poziom 2', bar: 'bg-white', badge: 'bg-white text-[#0f0f12]' },
                        { lvl: 1, label: 'Poziom 1', bar: 'bg-zinc-400', badge: 'bg-zinc-700 text-white' },
                        { lvl: 0, label: 'Nieodblokowane', bar: 'bg-zinc-700', badge: 'bg-zinc-900 text-zinc-400' }
                      ].map((item) => {
                        const count = summaryStats.levels[item.lvl] || 0;
                        const denom = item.lvl === 4 ? summaryStats.superMegaTotal : summaryStats.total;
                        const pct = denom > 0 ? Math.round((count / denom) * 100) : 0;
                        return (
                          <div key={item.lvl} className="bg-[#0f0f12] p-2.5 rounded-xl border border-zinc-800">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-semibold text-zinc-200">{item.label}</span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${item.badge}`}>{count}/{denom} ({pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>


              {/* Specjalne */}
              <section className="rounded-2xl p-4 bg-[#18181b] border border-zinc-800">
                <h2 className="text-sm font-bold text-white mb-3">Specjalne</h2>
                <div className="space-y-2.5">
                  {summaryStats.specialCategories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => { setSelectedCategories([cat.key]); setActiveTab(0); }}
                      className="w-full p-3 rounded-xl bg-[#0f0f12] border border-zinc-800 hover:border-zinc-700 text-left transition-colors active:scale-99"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {cat.key === 'Legendary' && <Crown className="w-3.5 h-3.5 text-red-400" />}
                          {cat.key === 'Mythical' && <Gem className="w-3.5 h-3.5 text-purple-400" />}
                          {cat.key === 'Regional' && <Globe className="w-3.5 h-3.5 text-emerald-400" />}
                          {cat.label}
                        </span>
                        <div className="flex items-center gap-2.5 text-[11px]">
                          <span className="text-zinc-400">Hundo: <strong className="text-red-400">{cat.hundo}/{cat.total}</strong></span>
                          <span className="text-zinc-400">Shiny: <strong className="text-amber-400">{cat.shiny}/{cat.shinyTotal}</strong></span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#dc2626] transition-all duration-500" style={{ width: `${cat.pct}%` }} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* PODZIAŁ NA TYPY W PODSUMOWANIU */}
              <section className="rounded-2xl p-4 bg-[#18181b] border border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white">Postęp według typów</h2>
                  <span className="text-[11px] text-zinc-500">Kliknij typ, aby filtrować</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {summaryStats.typeBreakdown.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => { setSelectedTypes([t.key]); setActiveTab(0); }}
                      className="p-2.5 rounded-xl bg-[#0f0f12] border border-zinc-800 hover:border-zinc-700 text-left transition-colors active:scale-98"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.dot }} />
                          {t.label}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">{t.unlocked}/{t.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-1.5">
                        <div className={`h-full rounded-full ${t.bar} transition-all duration-500`} style={{ width: `${t.pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>Hundo: <strong className="text-zinc-200">{t.hundo}</strong></span>
                        <span>Shiny: <strong className="text-amber-400">{t.shiny}/{t.shinyTotal}</strong></span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* DYNAMICZNY PRZYCISK FAB */}
        {activeTab === 0 && (
          <div className="absolute bottom-[76px] right-4 left-4 z-30 flex justify-end pointer-events-none">
            <button
              type="button"
              onClick={openFilterSheet}
              aria-label="Filtry i Sortowanie"
              className={`pointer-events-auto relative bg-[#dc2626] hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-black border-2 border-white active:scale-95 transition-all duration-200 ease-out overflow-visible ${
                isScrolledToBottom
                  ? 'w-full max-w-sm mx-auto h-14 rounded-2xl px-5 gap-3 shadow-[0_10px_25px_rgba(220,38,38,0.5)]'
                  : 'w-14 h-14 rounded-full'
              }`}
            >
              <SlidersHorizontal className={`shrink-0 transition-transform duration-500 ${isScrolledToBottom ? 'w-5 h-5 stroke-[2.5]' : 'w-6 h-6 stroke-[2.5]'}`} />
              
              <span className={`font-black text-sm tracking-tight uppercase whitespace-nowrap transition-all duration-300 ${isScrolledToBottom ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute pointer-events-none'}`}>
                Filtrowanie i Sortowanie
              </span>

              {activeFiltersCount > 0 && (
                <span className={`rounded-full bg-white text-[#0f0f12] font-black flex items-center justify-center border-2 border-[#0f0f12] shrink-0 transition-all duration-300 ${
                  isScrolledToBottom ? 'w-6 h-6 text-xs ml-auto' : 'absolute -top-2 -right-2 w-5 h-5 text-[11px] shadow-md z-20'
                }`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* DOLNY PASEK NAWIGACJI */}
        <nav className="shrink-0 z-40 bg-[#141418] border-t border-zinc-800 px-3 pt-3 pb-6">
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab(0)}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-sm font-black transition-all duration-300 active:scale-95 ${
                activeTab === 0
                  ? 'bg-[#dc2626] text-white border border-red-400 shadow-lg shadow-red-950/50'
                  : 'bg-[#0f0f12] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <AppHeaderIcon className="w-5 h-5 rounded-lg" />
              <span>MegaDex</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(1)}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-sm font-black transition-all duration-300 active:scale-95 ${
                activeTab === 1
                  ? 'bg-white text-[#0f0f12] border border-white shadow-lg shadow-black/50'
                  : 'bg-[#0f0f12] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <BarChart3 className={`w-5 h-5 ${activeTab === 1 ? 'text-[#dc2626]' : 'text-zinc-500'}`} />
              <span>Podsumowanie</span>
            </button>
          </div>
        </nav>


        {/* WYSUWANY PANEL FILTRÓW I SORTOWANIA */}
        {isSheetMounted && (
          <div onClick={(e) => { if (e.target === e.currentTarget) closeFilterSheet(); }} className={`fixed inset-0 z-50 flex items-end justify-center transition-colors duration-500 ${isSheetVisible ? 'bg-black/80' : 'bg-black/0'}`}>
            <div
              style={{ transform: isSheetVisible ? `translate3d(0, ${sheetDragY}px, 0)` : 'translate3d(0, 100%, 0)', transition: isDraggingSheet ? 'none' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
              className="w-full max-w-md bg-[#18181b] border-t-2 border-[#dc2626] rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh]"
            >
              <div
                onTouchStart={(e) => handleSheetDragStart(e.touches[0].clientY)}
                onTouchMove={(e) => handleSheetDragMove(e.touches[0].clientY)}
                onTouchEnd={handleSheetDragEnd}
                onMouseDown={(e) => handleSheetDragStart(e.clientY)}
                onMouseMove={(e) => { if (isDraggingSheet) handleSheetDragMove(e.clientY); }}
                onMouseUp={handleSheetDragEnd}
                onMouseLeave={() => { if (isDraggingSheet) handleSheetDragEnd(); }}
                className="pt-3 pb-2 px-5 cursor-grab active:cursor-grabbing select-none shrink-0"
              >
                <div className="w-12 h-1.5 bg-zinc-600 rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#dc2626]" />
                    <h3 className="text-base font-bold text-white">Filtrowanie i Sortowanie</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button type="button" onClick={resetAllFilters} className="text-xs text-[#ef4444] hover:text-red-300 font-bold flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Resetuj
                      </button>
                    )}
                    <button type="button" onClick={closeFilterSheet} className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-8 pt-2 overflow-y-auto space-y-5">
                {/* Status w Pokémon GO (Released / Unreleased) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Status w Pokémon GO</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setShowReleased((prev) => !prev); resetScrollToTop(); }} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${showReleased ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-500'}`}>
                      <span>Wydane</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${showReleased ? 'bg-white border-white text-emerald-600' : 'bg-zinc-900 border-zinc-700 text-transparent'}`}><Check className="w-3 h-3 stroke-[3]" /></span>
                    </button>
                    <button type="button" onClick={() => { setShowUnreleased((prev) => !prev); resetScrollToTop(); }} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${showUnreleased ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-500'}`}>
                      <span>Niewydane</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${showUnreleased ? 'bg-white border-white text-indigo-600' : 'bg-zinc-900 border-zinc-700 text-transparent'}`}><Check className="w-3 h-3 stroke-[3]" /></span>
                    </button>
                  </div>
                </div>

                {/* Status kolekcji (Hundo / Shiny) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Status w kolekcji</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setShowHundo((prev) => !prev); resetScrollToTop(); }} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${showHundo ? 'bg-[#dc2626] border-red-400 text-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-500'}`}>
                      <span className="inline-flex items-center gap-1.5"><Flame className={`w-3.5 h-3.5 ${showHundo ? 'fill-white text-white' : 'text-zinc-600'}`} /> Hundo</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${showHundo ? 'bg-white border-white text-[#dc2626]' : 'bg-zinc-900 border-zinc-700 text-transparent'}`}><Check className="w-3 h-3 stroke-[3]" /></span>
                    </button>
                    <button type="button" onClick={() => { setShowShiny((prev) => !prev); resetScrollToTop(); }} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${showShiny ? 'bg-gradient-to-r from-amber-300 to-yellow-500 border-amber-200 text-zinc-950' : 'bg-[#0f0f12] border-zinc-800 text-zinc-500'}`}>
                      <span className="inline-flex items-center gap-1.5"><Star className={`w-3.5 h-3.5 ${showShiny ? 'fill-zinc-950 text-zinc-950' : 'text-zinc-600'}`} /> Shiny</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${showShiny ? 'bg-zinc-950 border-zinc-950 text-amber-300' : 'bg-zinc-900 border-zinc-700 text-transparent'}`}><Check className="w-3 h-3 stroke-[3]" /></span>
                    </button>
                  </div>
                </div>

                {/* Kategorie specjalne */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Specjalne</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Legendary', label: 'Legendary', icon: Crown, iconColor: 'text-red-400' },
                      { id: 'Mythical', label: 'Mythical', icon: Gem, iconColor: 'text-purple-400' },
                      { id: 'Regional', label: 'Regional', icon: Globe, iconColor: 'text-emerald-400' }
                    ].map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button key={cat.id} type="button" onClick={() => toggleCategoryFilter(cat.id)} className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${isSelected ? 'bg-white text-[#0f0f12] border-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-400'}`}>
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#0f0f12]' : cat.iconColor}`} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Typy Pokémonów (maks. 2)</label>
                    <span className="text-[11px] font-bold text-zinc-400">Wybrano: <strong className={selectedTypes.length > 0 ? 'text-white' : 'text-zinc-500'}>{selectedTypes.length}/2</strong></span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ALL_TYPES.map((t) => {
                      const isSelected = selectedTypes.includes(t.key);
                      const isDisabled = !isSelected && selectedTypes.length >= 2;
                      return (
                        <button key={t.key} type="button" onClick={() => toggleTypeFilter(t.key)} className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${isSelected ? `${t.bg} ${t.text} ${t.border} ring-1 ring-white/60` : isDisabled ? 'bg-[#0f0f12]/50 border-zinc-900 text-zinc-600 cursor-not-allowed' : 'bg-[#0f0f12] border-zinc-800 text-zinc-400'}`}>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.dot }} />
                          <span className="truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Poziom Mega */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Poziom Mega ewolucji</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'ALL', label: 'Wszystkie' },
                      { id: '0', label: 'Poziom 0 (Brak)' },
                      { id: '1', label: 'Poziom 1' },
                      { id: '2', label: 'Poziom 2' },
                      { id: '3', label: 'Poziom 3' },
                      { id: '4', label: 'Poziom 4 (Super)' }
                    ].map((lvl) => (
                      <button key={lvl.id} type="button" onClick={() => { setLevelFilter(lvl.id); resetScrollToTop(); }} className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${levelFilter === lvl.id ? 'bg-[#dc2626] border-red-400 text-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-400'}`}>
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sortowanie */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">Sortuj według</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'DEX_ASC', label: 'Nr Dex (#)' },
                      { id: 'NAME_ASC', label: 'Nazwa A–Z' },
                      { id: 'LEVEL_DESC', label: 'Poziom Mega' }
                    ].map((srt) => (
                      <button key={srt.id} type="button" onClick={() => { setSortBy(srt.id); resetScrollToTop(); }} className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${sortBy === srt.id ? 'bg-white text-[#0f0f12] border-white' : 'bg-[#0f0f12] border-zinc-800 text-zinc-400'}`}>
                        {sortBy === srt.id && <Check className="w-3.5 h-3.5 text-[#dc2626]" />}
                        <span>{srt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={closeFilterSheet} className="w-full py-3.5 rounded-2xl bg-[#dc2626] hover:bg-red-500 text-white font-black text-sm shadow-lg shadow-red-950/50 active:scale-98 transition-all">
                  Pokaż wyniki ({filteredPokemon.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#18181b] text-white text-xs font-bold px-4 py-2 rounded-full border border-[#dc2626] shadow-xl whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function StatRing({ percent, stroke }) {
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-11 h-11 flex items-center justify-center">
      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="transparent" stroke="#27272a" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="transparent"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-white">{percent}%</span>
    </div>
  );
}
