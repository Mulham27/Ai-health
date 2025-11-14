import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, HealthEntry, Suggestion } from "../types"

interface HealthStore {
    user: User | null
    entries: HealthEntry[]
    suggestions: Suggestion[]
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
    addEntry: (entry: HealthEntry) => void
    setSuggestions: (suggestions: Suggestion[]) => void
    setLoading: (loading: boolean) => void
    clearStore: () => void
}

export const useHealthStore = create<HealthStore>()(
    persist(
        (set) => ({
            user: null,
            entries: [],
            suggestions: [],
            isLoading: false,

            setUser: (user) => set({ user }),

            addEntry: (entry) =>
                set((state) => ({
                    entries: [entry, ...state.entries],
                })),

            setSuggestions: (suggestions) => set({ suggestions }),

            setLoading: (loading) => set({ isLoading: loading }),

            clearStore: () =>
                set({
                    user: null,
                    entries: [],
                    suggestions: [],
                    isLoading: false,
                }),
        }),
        {
            name: "health-assistant-store",
            partialize: (state) => ({
                user: state.user,
                entries: state.entries.slice(0, 50), // Keep only recent entries
            }),
        },
    ),
)
