import { useState, useEffect } from 'react';
import type { Tag, Story, Quest, UserState, HistoryItem } from './types';
import { STORIES, QUESTS } from './data';

const STORAGE_KEY = 'eco_quest_user_state';

const GLASS_CARD = "bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-8 w-full max-w-[420px]";
const GLASS_BUTTON = "bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl px-6 py-4 text-slate-800 font-semibold transition hover:bg-white/40 active:scale-95 shadow-sm mb-3 text-left w-full";

export default function App() {
  const [userState, setUserState] = useState<UserState>({
    lastCompletedDate: null,
    dailyCompletions: 0,
    streak: 0,
    history: []
  });

  const [view, setView] = useState<'home' | 'quest' | 'completed' | 'history'>('home');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: UserState = JSON.parse(saved);
      const today = new Date().toLocaleDateString();
      
      // Reset daily completions if date changed
      if (parsed.lastCompletedDate !== today) {
        parsed.dailyCompletions = 0;
      }
      
      setUserState(parsed);
      
      if (parsed.lastCompletedDate === today && parsed.dailyCompletions >= 3) {
        setView('completed');
      } else {
        generateRandomStory();
      }
    } else {
      generateRandomStory();
    }
    setIsLoaded(true);
  }, []);

  const generateRandomStory = () => {
    const randomIdx = Math.floor(Math.random() * STORIES.length);
    setCurrentStory(STORIES[randomIdx]);
  };

  const saveState = (newState: UserState) => {
    setUserState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const resetData = () => {
    if (window.confirm('모든 데이터(연속 달성, 히스토리)를 초기화하시겠습니까?')) {
      const initialState: UserState = {
        lastCompletedDate: null,
        dailyCompletions: 0,
        streak: 0,
        history: []
      };
      saveState(initialState);
      generateRandomStory();
      setView('home');
    }
  };

  const handleChoice = (tag: Tag) => {
    // Safety check: Don't allow starting a new quest if already completed 3
    if (userState.lastCompletedDate === new Date().toLocaleDateString() && userState.dailyCompletions >= 3) {
      setView('completed');
      return;
    }

    const possibleQuests = QUESTS.filter(q => q.tag === tag);
    const randomQuest = possibleQuests[Math.floor(Math.random() * possibleQuests.length)];
    setCurrentQuest(randomQuest);
    setView('quest');
  };

  const completeQuest = () => {
    if (!currentQuest) return;

    const today = new Date().toLocaleDateString();
    
    // Safety check: already completed 3 quests today
    if (userState.lastCompletedDate === today && userState.dailyCompletions >= 3) {
      setView('completed');
      return;
    }

    const newDailyCompletions = userState.dailyCompletions + 1;
    
    // Calculate streak (only on first quest of the day)
    let newStreak = userState.streak;
    if (userState.dailyCompletions === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString();

      if (userState.lastCompletedDate === yesterdayStr) {
        newStreak += 1;
      } else if (userState.lastCompletedDate !== today) {
        newStreak = 1;
      }
    }

    const newHistoryItem: HistoryItem = {
      date: today,
      title: currentQuest.title,
      tag: currentQuest.tag
    };

    const newState: UserState = {
      lastCompletedDate: today,
      dailyCompletions: newDailyCompletions,
      streak: newStreak,
      history: [newHistoryItem, ...userState.history].slice(0, 14) // Keep 14 days
    };

    saveState(newState);

    if (newDailyCompletions >= 3) {
      setView('completed');
    } else {
      generateRandomStory();
      setView('home');
    }
  };

  const getBadge = (streak: number) => {
    if (streak >= 7) return 'Legend 🏆';
    if (streak >= 3) return 'Bronze 🥉';
    return 'Seed 🌱';
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400/40 via-sky-400/40 to-indigo-400/40 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        
        {/* Header (Status) */}
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Streak</span>
              <span className="text-xl font-bold text-slate-800">{userState.streak}일 연속 🔥</span>
            </div>
            <div className="flex flex-col border-l border-white/40 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Today</span>
              <span className="text-xl font-bold text-slate-800">{userState.dailyCompletions} / 3 🌱</span>
            </div>
          </div>
          <button 
            onClick={() => setView(view === 'history' ? (userState.lastCompletedDate === new Date().toLocaleDateString() && userState.dailyCompletions >= 3 ? 'completed' : 'home') : 'history')}
            className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition shadow-sm"
          >
            {view === 'history' ? '🏠' : '📅'}
          </button>
        </div>

        {/* Main Content */}
        <div className="transition-all duration-500 transform">
          {view === 'home' && (
            userState.lastCompletedDate === new Date().toLocaleDateString() && userState.dailyCompletions >= 3 ? (
              <div className={GLASS_CARD + " text-center"}>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">오늘의 미션 완료!</h3>
                <p className="text-sm text-slate-600 mb-6">이미 모든 퀘스트를 완료했습니다.</p>
                <button 
                  onClick={() => setView('completed')}
                  className="w-full py-4 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl text-slate-800 font-semibold transition hover:bg-white/40 active:scale-95 shadow-sm"
                >
                  결과 확인하기
                </button>
              </div>
            ) : currentStory ? (
              <div className={GLASS_CARD}>
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Today's Story</span>
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Quest {userState.dailyCompletions + 1}/3</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                    {currentStory.text}
                  </h2>
                </div>
                <div className="flex flex-col">
                  {currentStory.choices.map((choice, i) => (
                    <button 
                      key={i}
                      onClick={() => handleChoice(choice.tag)}
                      className={GLASS_BUTTON}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}

          {view === 'quest' && currentQuest && (
            <div className={GLASS_CARD}>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2 block">Active Quest</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentQuest.title}</h2>
                <p className="text-slate-600 leading-relaxed">{currentQuest.desc}</p>
              </div>
              <button 
                onClick={completeQuest}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                실천 완료 ✨
              </button>
            </div>
          )}

          {view === 'completed' && (
            <div className={GLASS_CARD + " text-center"}>
              <div className="mb-6">
                <div className="text-6xl mb-4">🌳</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">오늘의 모든 퀘스트 완료!</h2>
                <p className="text-slate-600 mb-6">하루 3개의 에코 실천을 모두 마쳤습니다.<br/>정말 대단해요!</p>
              </div>
              
              <div className="bg-white/30 rounded-2xl p-4 mb-6 border border-white/40">
                <p className="text-sm text-slate-500 mb-1">나의 등급</p>
                <p className="text-xl font-bold text-slate-800">{getBadge(userState.streak)}</p>
              </div>

              <p className="text-slate-400 text-sm italic mb-8">"내일도 새로운 스토리로 찾아올게요!"</p>

              <button 
                onClick={() => setView('home')}
                className="w-full py-4 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl text-slate-800 font-semibold transition hover:bg-white/40 active:scale-95 shadow-sm"
              >
                홈으로 돌아가기
              </button>
            </div>
          )}

          {view === 'history' && (
            <div className={GLASS_CARD}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📅</span> 최근 7일 히스토리
              </h2>
              <div className="flex flex-col gap-3">
                {userState.history.length > 0 ? (
                  userState.history.slice(0, 7).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/20 rounded-xl border border-white/30">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{item.date}</p>
                        <p className="font-semibold text-slate-800">{item.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        item.tag === 'outdoor' ? 'bg-emerald-100 text-emerald-600' :
                        item.tag === 'school' ? 'bg-sky-100 text-sky-600' :
                        'bg-indigo-100 text-indigo-600'
                      }`}>
                        {item.tag === 'school' ? 'school' : item.tag}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">아직 완료한 퀘스트가 없습니다.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={resetData}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-400 transition"
          >
            데이터 초기화 🔄
          </button>
        </div>

        {/* Footer (Progress Bar) */}
        {view !== 'history' && (
          <div className="px-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              <span>Next Reward</span>
              <span>{userState.streak % 7} / 7 days</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-1000" 
                style={{ width: `${(userState.streak % 7) * 14.28}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
