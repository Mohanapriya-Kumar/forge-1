import React, { createContext, useContext, useState, useEffect } from 'react';
import { playClick, playConfetti, playLevelUp, playRecovery, setRainSound } from '../utils/sounds';

// Default Mascot / Identity Definitions
export interface IdentityInfo {
  name: string;
  votes: number;
  level: number; // 1 to 8
  mascot: string; // owl, fox, beaver, turtle, rabbit, cat, lion, squirrel, spider, koala, wolf, parrot
  description: string;
  color: string; // hex or hsl
  traits: {
    consistency: number;
    health: number;
    fitness: number;
    knowledge: number;
    creativity: number;
    discipline: number;
    mindfulness: number;
    leadership: number;
  };
}

export interface HabitQuest {
  id: string;
  name: string;
  identity: string; // links to IdentityInfo.name
  isBad: boolean; // if bad habit, it's a "monster target"
  cue: string;
  craving: string;
  response: string;
  reward: string;
  scores: {
    obvious: number;
    attractive: number;
    easy: number;
    satisfying: number;
  };
  completedDates: string[]; // YYYY-MM-DD
  streak: number;
  stackPrevHabitId?: string | null;
  frictionSteps: string[]; // for bad habits
  monsterId?: string; // linked bad creature
  tinyName?: string;
  completedTinyDates?: string[];
}

export interface AvatarEquipment {
  head: string;
  body: string;
  accessory: string;
  title: string;
}

export interface AvatarState {
  stage: number; // 1 (Apprentice), 2 (Adept), 3 (Master), 4 (Legend)
  equipped: AvatarEquipment;
  unlockedItems: string[];
}

export interface EnvironmentItem {
  id: string;
  name: string;
  x: number; // grid coords 0-5
  y: number;
  isGood: boolean; // positive cue
  cueFor: string; // e.g. "Athlete"
  active: boolean;
  icon: string;
}

export interface ReflectionEntry {
  date: string;
  well: string;
  difficult: string;
  identityName: string;
  tomorrow: string;
}

export interface TimelineEvent {
  id: string;
  text: string;
  date: string;
  icon: string;
  type: 'vote' | 'level' | 'recovery' | 'monster' | 'custom';
}

export interface AppState {
  username: string;
  isOnboarded: boolean;
  selectedIdentities: string[];
  identities: Record<string, IdentityInfo>;
  quests: HabitQuest[];
  avatar: AvatarState;
  environmentItems: EnvironmentItem[];
  reflections: ReflectionEntry[];
  timeline: TimelineEvent[];
  museum: { id: string; name: string; description: string; date: string; icon: string }[];
  weather: 'sunny' | 'cloudy' | 'rainy' | 'aurora';
  settings: {
    soundEnabled: boolean;
    reduceMotion: boolean;
    theme: 'day' | 'night';
  };
  coachMessages: string[];
  futureMessages: string[];
  xp: number;
  level: number;
}

const DEFAULT_IDENTITIES: Record<string, IdentityInfo> = {
  Builder: { name: 'Builder', votes: 0, level: 1, mascot: 'beaver', description: 'Creates systems, software, and physical items.', color: '#a855f7', traits: { consistency: 0, health: 0, fitness: 0, knowledge: 0, creativity: 2, discipline: 1, mindfulness: 0, leadership: 0 } },
  Scholar: { name: 'Scholar', votes: 0, level: 1, mascot: 'owl', description: 'Acquires deep knowledge and seeks truth.', color: '#3b82f6', traits: { consistency: 0, health: 0, fitness: 0, knowledge: 3, creativity: 0, discipline: 1, mindfulness: 0, leadership: 0 } },
  Athlete: { name: 'Athlete', votes: 0, level: 1, mascot: 'fox', description: 'Pushes physical limits and values energy.', color: '#ef4444', traits: { consistency: 0, health: 1, fitness: 3, knowledge: 0, creativity: 0, discipline: 1, mindfulness: 0, leadership: 0 } },
  Monk: { name: 'Monk', votes: 0, level: 1, mascot: 'turtle', description: 'Practices stillness, focus, and mental clarity.', color: '#10b981', traits: { consistency: 0, health: 1, fitness: 0, knowledge: 0, creativity: 0, discipline: 1, mindfulness: 3, leadership: 0 } },
  Creator: { name: 'Creator', votes: 0, level: 1, mascot: 'rabbit', description: 'Expresses beauty, art, and storytelling.', color: '#ec4899', traits: { consistency: 0, health: 0, fitness: 0, knowledge: 0, creativity: 3, discipline: 0, mindfulness: 1, leadership: 0 } },
  Explorer: { name: 'Explorer', votes: 0, level: 1, mascot: 'cat', description: 'Investigates new domains and embraces risk.', color: '#f59e0b', traits: { consistency: 0, health: 0, fitness: 1, knowledge: 1, creativity: 1, discipline: 0, mindfulness: 0, leadership: 0 } },
  Leader: { name: 'Leader', votes: 0, level: 1, mascot: 'lion', description: 'Serves others, coordinates, and inspires growth.', color: '#eab308', traits: { consistency: 0, health: 0, fitness: 0, knowledge: 0, creativity: 0, discipline: 1, mindfulness: 0, leadership: 3 } },
  Entrepreneur: { name: 'Entrepreneur', votes: 0, level: 1, mascot: 'squirrel', description: 'Builds viable ventures and manages resources.', color: '#14b8a6', traits: { consistency: 1, health: 0, fitness: 0, knowledge: 1, creativity: 1, discipline: 0, mindfulness: 0, leadership: 1 } },
  'Deep Worker': { name: 'Deep Worker', votes: 0, level: 1, mascot: 'spider', description: 'Executes highly focused undistracted sessions.', color: '#6366f1', traits: { consistency: 2, health: 0, fitness: 0, knowledge: 0, creativity: 0, discipline: 2, mindfulness: 0, leadership: 0 } },
  Reader: { name: 'Reader', votes: 0, level: 1, mascot: 'koala', description: 'Explores books and synthesizes ideas.', color: '#06b6d4', traits: { consistency: 1, health: 0, fitness: 0, knowledge: 2, creativity: 0, discipline: 0, mindfulness: 0, leadership: 0 } },
  'Health Guardian': { name: 'Health Guardian', votes: 0, level: 1, mascot: 'wolf', description: 'Nourishes the body and optimizes rest.', color: '#22c55e', traits: { consistency: 1, health: 3, fitness: 0, knowledge: 0, creativity: 0, discipline: 0, mindfulness: 0, leadership: 0 } },
  Communicator: { name: 'Communicator', votes: 0, level: 1, mascot: 'parrot', description: 'Speaks clearly, listens actively, and connects.', color: '#f97316', traits: { consistency: 0, health: 0, fitness: 0, knowledge: 1, creativity: 0, discipline: 0, mindfulness: 0, leadership: 2 } },
};

const DEFAULT_ENVIRONMENT_ITEMS: EnvironmentItem[] = [
  { id: 'desk_laptop', name: 'Work Laptop', x: 2, y: 2, isGood: true, cueFor: 'Builder', active: true, icon: '💻' },
  { id: 'desk_phone', name: 'Smartphone on Desk', x: 4, y: 2, isGood: false, cueFor: 'Doomscroll', active: true, icon: '📱' },
  { id: 'desk_water', name: 'Water Bottle', x: 1, y: 2, isGood: true, cueFor: 'Health Guardian', active: true, icon: '🥤' },
  { id: 'desk_book', name: 'Book on Pillow', x: 0, y: 1, isGood: true, cueFor: 'Reader', active: false, icon: '📖' },
  { id: 'desk_journal', name: 'Cozy Journal', x: 3, y: 1, isGood: true, cueFor: 'Creator', active: false, icon: '📔' },
  { id: 'desk_clock', name: 'Alarm Clock (Far)', x: 5, y: 0, isGood: true, cueFor: 'Deep Worker', active: false, icon: '⏰' },
  { id: 'desk_chips', name: 'Sugary Snacks', x: 4, y: 1, isGood: false, cueFor: 'Sugar Monster', active: true, icon: '🍿' },
  { id: 'desk_plant', name: 'Zen Bamboo Plant', x: 1, y: 0, isGood: true, cueFor: 'Monk', active: true, icon: '🪴' },
];

interface AppContextProps {
  state: AppState;
  setUsername: (name: string) => void;
  setOnboarded: (onboarded: boolean) => void;
  setSelectedIdentities: (ids: string[]) => void;
  addVote: (identityName: string, count: number) => void;
  addHabit: (habit: Omit<HabitQuest, 'completedDates' | 'streak'>) => void;
  editHabit: (habit: HabitQuest) => void;
  deleteHabit: (id: string) => void;
  completeQuest: (id: string, isTiny?: boolean) => void;
  toggleEnvironmentItem: (id: string) => void;
  moveEnvironmentItem: (id: string, x: number, y: number) => void;
  addFrictionStep: (habitId: string, text: string) => void;
  beatMonster: (monsterName: string) => void;
  saveReflection: (well: string, difficult: string, identityName: string, tomorrow: string) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleMotion: () => void;
  equipAvatarItem: (category: keyof AvatarEquipment, item: string) => void;
  importBackupData: (json: string) => boolean;
  resetAllProgress: () => void;
  triggerDriftCheck: () => void;
  generateFutureSelfMessage: (identityName: string) => void;
  calculateMomentum: (identityName: string) => 'Dormant' | 'Recovering' | 'Growing' | 'Strong' | 'Thriving' | 'Legendary';
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'forge_1percent_state_v1';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed;
      } catch (e) {
        console.error('Error parsing local storage state:', e);
      }
    }
    return {
      username: '',
      isOnboarded: false,
      selectedIdentities: [],
      identities: DEFAULT_IDENTITIES,
      quests: [],
      avatar: {
        stage: 1,
        equipped: { head: 'basic_hair', body: 'apprentice_robe', accessory: 'none', title: 'Novice Smith' },
        unlockedItems: ['basic_hair', 'apprentice_robe', 'none', 'Novice Smith'],
      },
      environmentItems: DEFAULT_ENVIRONMENT_ITEMS,
      reflections: [],
      timeline: [
        { id: 'init', text: 'Stood before the Forge for the first time.', date: new Date().toISOString().split('T')[0], icon: '🔥', type: 'custom' as const }
      ] as TimelineEvent[],
      museum: [],
      weather: 'sunny',
      settings: { soundEnabled: true, reduceMotion: false, theme: 'night' },
      coachMessages: ['Welcome! Click on your floating islands to see details, or prepare your habits in the Lab!'],
      futureMessages: [],
      xp: 0,
      level: 1,
    };
  });


  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    // Apply theme changes to document element
    const root = document.documentElement;
    if (state.settings.theme === 'day') {
      root.classList.remove('theme-night');
      root.classList.add('theme-day');
    } else {
      root.classList.remove('theme-day');
      root.classList.add('theme-night');
    }
    // Set up background rain sound dynamically
    setRainSound(state.settings.soundEnabled && state.weather === 'rainy');
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      return next;
    });
  };

  const setUsername = (name: string) => {
    updateState((prev) => ({ ...prev, username: name }));
  };

  const setOnboarded = (onboarded: boolean) => {
    updateState((prev) => ({ ...prev, isOnboarded: onboarded }));
  };

  const setSelectedIdentities = (ids: string[]) => {
    updateState((prev) => ({ ...prev, selectedIdentities: ids }));
  };

  // Level thresholds: Level 1 (0+), Level 2 (10+), Level 3 (25+), Level 4 (50+), Level 5 (85+), Level 6 (130+), Level 7 (185+), Level 8 (250+)
  const getLevelForVotes = (votes: number): number => {
    if (votes >= 250) return 8;
    if (votes >= 185) return 7;
    if (votes >= 130) return 6;
    if (votes >= 85) return 5;
    if (votes >= 50) return 4;
    if (votes >= 25) return 3;
    if (votes >= 10) return 2;
    return 1;
  };

  const addVote = (identityName: string, count: number) => {
    updateState((prev) => {
      const target = prev.identities[identityName];
      if (!target) return prev;

      const newVotes = target.votes + count;
      const oldLevel = target.level;
      const newLevel = getLevelForVotes(newVotes);

      const updatedIdentities = {
        ...prev.identities,
        [identityName]: {
          ...target,
          votes: newVotes,
          level: newLevel,
        },
      };

      const newTimeline = [...prev.timeline];
      const newMuseum = [...prev.museum];
      const unlockedItems = [...prev.avatar.unlockedItems];
      let newStage = prev.avatar.stage;

      newTimeline.push({
        id: `vote_${Date.now()}`,
        text: `Cast a vote for ${identityName} (+${count} vote)`,
        date: new Date().toISOString().split('T')[0],
        icon: '🗳️',
        type: 'vote',
      });

      // Level up triggers
      if (newLevel > oldLevel) {
        newTimeline.push({
          id: `lvl_${Date.now()}`,
          text: `${identityName} Island evolved to Level ${newLevel}!`,
          date: new Date().toISOString().split('T')[0],
          icon: '🏝️',
          type: 'level',
        });

        newMuseum.push({
          id: `mus_${Date.now()}`,
          name: `${identityName} Evolution`,
          description: `Evolved the ${identityName} Island to level ${newLevel}.`,
          date: new Date().toISOString().split('T')[0],
          icon: '✨',
        });

        // Unlock avatar customizations
        const unlockableAccessories: Record<string, string[]> = {
          Builder: ['hardhat', 'wrench_shield', 'Builder Master'],
          Scholar: ['owl_glasses', 'scroll_backpack', 'Scholar Sage'],
          Athlete: ['sweatband', 'victory_medal', 'Iron Guardian'],
          Monk: ['wooden_beads', 'lotus_halo', 'Monk Ascendant'],
          Creator: ['art_palette', 'rabbit_ears', 'Creator Legend'],
          Explorer: ['explorer_hat', 'compass_cape', 'Path Finder'],
          Leader: ['laurel_crown', 'golden_scepter', 'Sovereign Forge'],
        };

        const rewards = unlockableAccessories[identityName] || [];
        rewards.forEach((item) => {
          if (!unlockedItems.includes(item)) {
            unlockedItems.push(item);
          }
        });

        // Stage progress based on total levels
        const totalLevels = Object.values(updatedIdentities).reduce((acc, curr) => acc + curr.level, 0);
        if (totalLevels >= 25 && prev.avatar.stage < 4) newStage = 4; // Legend
        else if (totalLevels >= 15 && prev.avatar.stage < 3) newStage = 3; // Master
        else if (totalLevels >= 8 && prev.avatar.stage < 2) newStage = 2; // Adept

        setTimeout(() => {
          playLevelUp();
        }, 100);
      }

      // Check overall XP based on cumulative votes
      const totalVotes = Object.values(updatedIdentities).reduce((sum, current) => sum + current.votes, 0);
      const overallLevel = Math.floor(Math.sqrt(totalVotes)) + 1;
      const overallXp = totalVotes * 50;

      return {
        ...prev,
        identities: updatedIdentities,
        xp: overallXp,
        level: overallLevel,
        avatar: {
          ...prev.avatar,
          stage: newStage,
          unlockedItems,
        },
        timeline: newTimeline,
        museum: newMuseum,
      };
    });
  };

  const addHabit = (habit: Omit<HabitQuest, 'completedDates' | 'streak'>) => {
    updateState((prev) => {
      const newHabit: HabitQuest = {
        ...habit,
        completedDates: [],
        streak: 0,
      };
      const newTimeline: TimelineEvent[] = [
        ...prev.timeline,
        {
          id: `habit_add_${Date.now()}`,
          text: `Forged blueprint card: "${habit.name}" (supporting ${habit.identity})`,
          date: new Date().toISOString().split('T')[0],
          icon: '📜',
          type: 'custom',
        },
      ];
      return {
        ...prev,
        quests: [...prev.quests, newHabit],
        timeline: newTimeline,
      };
    });
  };

  const editHabit = (habit: HabitQuest) => {
    updateState((prev) => {
      const updated = prev.quests.map((q) => (q.id === habit.id ? habit : q));
      return {
        ...prev,
        quests: updated,
      };
    });
  };

  const deleteHabit = (id: string) => {
    updateState((prev) => {
      const target = prev.quests.find((q) => q.id === id);
      const updated = prev.quests.filter((q) => q.id !== id);
      const newTimeline = [...prev.timeline];
      if (target) {
        newTimeline.push({
          id: `habit_del_${Date.now()}`,
          text: `Scrapped blueprint card: "${target.name}"`,
          date: new Date().toISOString().split('T')[0],
          icon: '🗑️',
          type: 'custom',
        });
      }
      return {
        ...prev,
        quests: updated,
        timeline: newTimeline,
      };
    });
  };

  const completeQuest = (id: string, isTiny: boolean = false) => {
    playClick();
    playConfetti();

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    updateState((prev) => {
      const targetQuest = prev.quests.find((q) => q.id === id);
      if (!targetQuest) return prev;

      // Toggle off if already completed today
      const alreadyDone = targetQuest.completedDates.includes(todayStr);
      let updatedDates = [...targetQuest.completedDates];
      let updatedTinyDates = [...(targetQuest.completedTinyDates || [])];
      let newStreak = targetQuest.streak;
      let recoverySuccess = false;

      if (alreadyDone) {
        // Toggle off
        updatedDates = updatedDates.filter((d) => d !== todayStr);
        updatedTinyDates = updatedTinyDates.filter((d) => d !== todayStr);
        if (newStreak > 0) newStreak -= 1;
      } else {
        // Toggle on
        updatedDates.push(todayStr);
        if (isTiny) {
          updatedTinyDates.push(todayStr);
        }

        // Calculate recovery or normal streak
        const wasDoneYesterday = targetQuest.completedDates.includes(yesterdayStr);
        if (wasDoneYesterday) {
          newStreak += 1;
        } else {
          // If missed yesterday but completed today, recovery mission accomplished!
          const hadPreviousEntries = targetQuest.completedDates.length > 0;
          if (hadPreviousEntries) {
            recoverySuccess = true;
          }
          newStreak = 1;
        }
      }

      // Map DNA traits
      const targetIdentity = prev.identities[targetQuest.identity];
      const updatedIdentities = { ...prev.identities };
      if (targetIdentity && !alreadyDone) {
        // Cast vote
        const newVotes = targetIdentity.votes + 1;
        const newLvl = getLevelForVotes(newVotes);

        // Update traits points (Reduced for Tiny Wins)
        const originalTraits = { ...targetIdentity.traits };
        Object.keys(originalTraits).forEach((trait) => {
          const key = trait as keyof typeof originalTraits;
          if (originalTraits[key] > 0) {
            originalTraits[key] += isTiny ? 1 : 2; // Primary Wins: +2, Tiny Wins: +1
          }
        });

        updatedIdentities[targetQuest.identity] = {
          ...targetIdentity,
          votes: newVotes,
          level: newLvl,
          traits: originalTraits,
        };
      }

      const updatedQuests = prev.quests.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            completedDates: updatedDates,
            completedTinyDates: updatedTinyDates,
            streak: newStreak,
          };
        }
        return q;
      });

      const newTimeline: TimelineEvent[] = [...prev.timeline];
      const newMuseum = [...prev.museum];

      if (!alreadyDone) {
        newTimeline.push({
          id: `quest_done_${Date.now()}`,
          text: isTiny 
            ? `Accomplished Tiny Win: "${targetQuest.tinyName || 'Showed up'}" (+1 ${targetQuest.identity} Vote)` 
            : `Accomplished quest: "${targetQuest.name}" (+1 ${targetQuest.identity} Vote)`,
          date: todayStr,
          icon: isTiny ? '✨' : '⚔️',
          type: 'vote',
        });

        if (recoverySuccess) {
          newTimeline.push({
            id: `recovery_${Date.now()}`,
            text: `Recovery Mission Completed for "${targetQuest.name}"! Defended the streak.`,
            date: todayStr,
            icon: '🛡️',
            type: 'recovery',
          });

          newMuseum.push({
            id: `mus_rec_${Date.now()}`,
            name: 'Recovery Guardian',
            description: `Successfully protected momentum by recovering after a missed day.`,
            date: todayStr,
            icon: '🛡️',
          });

          setTimeout(() => {
            playRecovery();
          }, 450);
        }

        // Check first vote milestone
        const totalVotes = Object.values(updatedIdentities).reduce((sum, c) => sum + c.votes, 0);
        if (totalVotes === 1) {
          newMuseum.push({
            id: `mus_first_vote`,
            name: 'First Vote Cast',
            description: 'Initiated your journey of self-transformation.',
            date: todayStr,
            icon: '🔥',
          });
        }
      }

      // Map average momentum to weather
      const getRanksForMomentum = (stateStr: string): number => {
        switch (stateStr) {
          case 'Legendary': return 6;
          case 'Thriving': return 5;
          case 'Strong': return 4;
          case 'Growing': return 3;
          case 'Recovering': return 2;
          default: return 1; // Dormant
        }
      };

      let sumRank = 0;
      const todayVal = new Date();
      const activeIds = prev.selectedIdentities;

      if (activeIds.length > 0) {
        activeIds.forEach((idName) => {
          const relevantQuests = updatedQuests.filter((q) => q.identity === idName && !q.isBad);
          if (relevantQuests.length > 0) {
            let score = 0;
            const last7Days: string[] = [];
            for (let i = 0; i < 7; i++) {
              const d = new Date();
              d.setDate(todayVal.getDate() - i);
              last7Days.push(d.toISOString().split('T')[0]);
            }
            let hasRecentRecovery = false;
            relevantQuests.forEach((q) => {
              const completedTiny = q.completedTinyDates || [];
              q.completedDates.forEach((dStr) => {
                if (last7Days.includes(dStr)) {
                  const isTinyQuest = completedTiny.includes(dStr);
                  score += isTinyQuest ? 8 : 15;
                }
              });
              const yesterdayVal = new Date();
              yesterdayVal.setDate(todayVal.getDate() - 1);
              const yesterdayStrVal = yesterdayVal.toISOString().split('T')[0];
              const todayStrVal = todayVal.toISOString().split('T')[0];
              if (q.completedDates.includes(todayStrVal) && !q.completedDates.includes(yesterdayStrVal) && q.completedDates.length > 1) {
                hasRecentRecovery = true;
              }
            });
            const finalScore = Math.min(100, score);
            let momState = 'Dormant';
            if (finalScore > 0) {
              if (hasRecentRecovery) momState = 'Recovering';
              else if (finalScore <= 20) momState = 'Dormant';
              else if (finalScore <= 45) momState = 'Growing';
              else if (finalScore <= 70) momState = 'Strong';
              else if (finalScore <= 90) momState = 'Thriving';
              else momState = 'Legendary';
            }
            sumRank += getRanksForMomentum(momState);
          } else {
            sumRank += 1;
          }
        });
      }

      const averageRank = activeIds.length > 0 ? sumRank / activeIds.length : 1;
      let newWeather: 'sunny' | 'cloudy' | 'rainy' | 'aurora' = 'sunny';
      if (averageRank >= 5.0) newWeather = 'aurora';
      else if (averageRank >= 3.8) newWeather = 'sunny';
      else if (averageRank >= 2.2) newWeather = 'cloudy';
      else newWeather = 'rainy';

      return {
        ...prev,
        quests: updatedQuests,
        identities: updatedIdentities,
        timeline: newTimeline,
        museum: newMuseum,
        weather: newWeather,
      };
    });
  };

  const calculateMomentum = (identityName: string): 'Dormant' | 'Recovering' | 'Growing' | 'Strong' | 'Thriving' | 'Legendary' => {
    const relevantQuests = state.quests.filter((q) => q.identity === identityName && !q.isBad);
    if (relevantQuests.length === 0) return 'Dormant';

    let score = 0;
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    let hasRecentRecovery = false;
    relevantQuests.forEach((q) => {
      const completedTiny = q.completedTinyDates || [];
      q.completedDates.forEach((dStr) => {
        if (last7Days.includes(dStr)) {
          const isTiny = completedTiny.includes(dStr);
          score += isTiny ? 8 : 15; // Primary Wins: +15, Tiny Wins: +8
        }
      });

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];
      if (q.completedDates.includes(todayStr) && !q.completedDates.includes(yesterdayStr) && q.completedDates.length > 1) {
        hasRecentRecovery = true;
      }
    });

    const finalScore = Math.min(100, score);
    if (finalScore === 0) return 'Dormant';
    
    if (hasRecentRecovery) return 'Recovering';
    if (finalScore <= 20) return 'Dormant';
    if (finalScore <= 45) return 'Growing';
    if (finalScore <= 70) return 'Strong';
    if (finalScore <= 90) return 'Thriving';
    return 'Legendary';
  };

  const toggleEnvironmentItem = (id: string) => {
    updateState((prev) => {
      const updated = prev.environmentItems.map((item) => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        return item;
      });
      return {
        ...prev,
        environmentItems: updated,
      };
    });
  };

  const moveEnvironmentItem = (id: string, x: number, y: number) => {
    updateState((prev) => {
      const updated = prev.environmentItems.map((item) => {
        if (item.id === id) {
          return { ...item, x, y };
        }
        return item;
      });
      return {
        ...prev,
        environmentItems: updated,
      };
    });
  };

  const addFrictionStep = (habitId: string, text: string) => {
    updateState((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === habitId) {
          return {
            ...q,
            frictionSteps: [...q.frictionSteps, text],
          };
        }
        return q;
      });

      // Monster HP decreases with friction!
      const targetHabit = prev.quests.find((q) => q.id === habitId);
      const newTimeline = [...prev.timeline];

      if (targetHabit) {
        newTimeline.push({
          id: `friction_${Date.now()}`,
          text: `Added friction step to bad habit "${targetHabit.name}": "${text}"`,
          date: new Date().toISOString().split('T')[0],
          icon: '🛡️',
          type: 'custom',
        });

        // Trigger monster damage
        const monsterName = targetHabit.name;
        newTimeline.push({
          id: `monster_hit_${Date.now()}`,
          text: `Dealt 25 DMG to the ${monsterName} Monster!`,
          date: new Date().toISOString().split('T')[0],
          icon: '⚡',
          type: 'custom',
        });
      }

      return {
        ...prev,
        quests: updatedQuests,
        timeline: newTimeline,
      };
    });
  };

  const beatMonster = (monsterName: string) => {
    updateState((prev) => {
      const newTimeline: TimelineEvent[] = [
        ...prev.timeline,
        {
          id: `monster_slay_${Date.now()}`,
          text: `Defeated the ${monsterName} Monster! Environment cleared.`,
          date: new Date().toISOString().split('T')[0],
          icon: '🏆',
          type: 'monster',
        },
      ];
      const newMuseum = [
        ...prev.museum,
        {
          id: `mus_mon_${Date.now()}`,
          name: `${monsterName} Slayer`,
          description: `Slayed the bad habit creature by adding multiple layers of friction.`,
          date: new Date().toISOString().split('T')[0],
          icon: '🏆',
        },
      ];

      return {
        ...prev,
        timeline: newTimeline,
        museum: newMuseum,
      };
    });
  };

  const saveReflection = (well: string, difficult: string, identityName: string, tomorrow: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateState((prev) => {
      const newReflection: ReflectionEntry = {
        date: todayStr,
        well,
        difficult,
        identityName,
        tomorrow,
      };

      const newTimeline: TimelineEvent[] = [
        ...prev.timeline,
        {
          id: `reflection_${Date.now()}`,
          text: `Completed Daily Forge Reflection. Reinforced focus on ${identityName}.`,
          date: todayStr,
          icon: '🧘',
          type: 'custom',
        },
      ];

      const newMuseum = [...prev.museum];
      if (prev.reflections.length === 0) {
        newMuseum.push({
          id: 'mus_first_reflect',
          name: 'Self-Aware Smith',
          description: 'Logged your very first daily forge reflection review.',
          date: todayStr,
          icon: '🧘',
        });
      }

      return {
        ...prev,
        reflections: [newReflection, ...prev.reflections],
        timeline: newTimeline,
        museum: newMuseum,
      };
    });
  };

  const toggleTheme = () => {
    updateState((prev) => {
      const nextTheme = prev.settings.theme === 'day' ? 'night' : 'day';
      return {
        ...prev,
        settings: {
          ...prev.settings,
          theme: nextTheme,
        },
      };
    });
  };

  const toggleSound = () => {
    updateState((prev) => {
      const nextMute = !prev.settings.soundEnabled;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: nextMute,
        },
      };
    });
  };

  const toggleMotion = () => {
    updateState((prev) => ({
      ...prev,
      settings: { ...prev.settings, reduceMotion: !prev.settings.reduceMotion },
    }));
  };

  const equipAvatarItem = (category: keyof AvatarEquipment, item: string) => {
    updateState((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        equipped: {
          ...prev.avatar.equipped,
          [category]: item,
        },
      },
    }));
  };

  const importBackupData = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed.hasOwnProperty('identities') && parsed.hasOwnProperty('quests')) {
        updateState(() => parsed);
        return true;
      }
    } catch (e) {
      console.error('Import backup failed:', e);
    }
    return false;
  };

  const resetAllProgress = () => {
    updateState(() => ({
      username: '',
      isOnboarded: false,
      selectedIdentities: [],
      identities: DEFAULT_IDENTITIES,
      quests: [],
      avatar: {
        stage: 1,
        equipped: { head: 'basic_hair', body: 'apprentice_robe', accessory: 'none', title: 'Novice Smith' },
        unlockedItems: ['basic_hair', 'apprentice_robe', 'none', 'Novice Smith'],
      },
      environmentItems: DEFAULT_ENVIRONMENT_ITEMS,
      reflections: [],
      timeline: [
        { id: 'init', text: 'Stood before the Forge for the first time.', date: new Date().toISOString().split('T')[0], icon: '🔥', type: 'custom' as const }
      ] as TimelineEvent[],
      museum: [],
      weather: 'sunny',
      settings: { soundEnabled: true, reduceMotion: false, theme: 'night' },
      coachMessages: ['Welcome! Click on your floating islands to see details, or prepare your habits in the Lab!'],
      futureMessages: [],
      xp: 0,
      level: 1,
    }));
  };

  // Behavioral Star Coach drift alerts & advice
  const triggerDriftCheck = () => {
    const today = new Date();
    const driftDaysLimit = 5; // 5 days since last vote

    updateState((prev) => {
      const activeIds = prev.selectedIdentities;
      const coachMsgs: string[] = [];
      const futureMsgs: string[] = [];

      for (const idName of activeIds) {
        // Find habits for this identity
        const relevantQuests = prev.quests.filter((q) => q.identity === idName);
        if (relevantQuests.length === 0) {
          coachMsgs.push(`You selected "${idName}" as a core identity but haven't added any supportive habits yet. Let's create a blueprint card!`);
          continue;
        }

        // Find last completed date
        let latestDate: Date | null = null;
        for (const q of relevantQuests) {
          for (const dStr of q.completedDates) {
            const d = new Date(dStr);
            if (!latestDate || d > latestDate) {
              latestDate = d;
            }
          }
        }

        if (!latestDate) {
          coachMsgs.push(`Drift Alert: You committed to the path of the ${idName}, but have not cast a vote for it yet. Let's make the response easy!`);
        } else {
          const diffTime = Math.abs(today.getTime() - (latestDate as Date).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= driftDaysLimit) {
            coachMsgs.push(
              `Drift Alert: The ${idName} within you feels a bit quiet. It has been ${diffDays} days since your last action. Small votes build systems, let's realign today!`
            );
          }
        }
      }

      // Generate some encouraging future messages
      if (activeIds.length > 0) {
        const randId = activeIds[Math.floor(Math.random() * activeIds.length)];
        futureMsgs.push(
          `Message from Future ${randId}: "Every small choice you make today is laying the foundations for me. Thank you for voting for us. Keep forging."`
        );
      }

      return {
        ...prev,
        coachMessages: coachMsgs.length > 0 ? coachMsgs : ['You are aligned and building consistency! "Habits are the compound interest of self-improvement."'],
        futureMessages: futureMsgs.length > 0 ? futureMsgs : prev.futureMessages,
      };
    });
  };

  const generateFutureSelfMessage = (identityName: string) => {
    updateState((prev) => {
      const messages = [
        `Thanks for reading today. You are making me wiser. - Future Scholar`,
        `That coding session was brilliant. It built another brick of my city. - Future Builder`,
        `Thank you for moving today. I feel stronger and healthier because of your choice. - Future Athlete`,
        `That quiet meditation kept us centered. You are building my peace. - Future Monk`,
        `The lines you wrote today are beautiful. Thank you for expressing us. - Future Creator`,
        `Every adventure you take broadens my horizons. Keep exploring. - Future Explorer`,
        `You chose responsibility today, and that makes me a better guide for others. - Future Leader`,
        `Our venture grows with every disciplined systems action. - Future Entrepreneur`,
        `Deep work compounds. Thank you for protecting our focus. - Future Deep Worker`,
        `The pages you turn today are writing our future. - Future Reader`,
        `Thank you for sleeping and eating well. You are protecting my vitality. - Future Health Guardian`,
        `Every conversation you bridge strengthens our community. - Future Communicator`,
      ];

      const specific = messages.find((m) => m.includes(`Future ${identityName}`)) || `You are building a better version of yourself. Keep casting votes! - Future Self`;
      return {
        ...prev,
        futureMessages: [specific, ...prev.futureMessages],
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setUsername,
        setOnboarded,
        setSelectedIdentities,
        addVote,
        addHabit,
        editHabit,
        deleteHabit,
        completeQuest,
        toggleEnvironmentItem,
        moveEnvironmentItem,
        addFrictionStep,
        beatMonster,
        saveReflection,
        toggleTheme,
        toggleSound,
        toggleMotion,
        equipAvatarItem,
        importBackupData,
        resetAllProgress,
        triggerDriftCheck,
        generateFutureSelfMessage,
        calculateMomentum,
      }}
    >

      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
