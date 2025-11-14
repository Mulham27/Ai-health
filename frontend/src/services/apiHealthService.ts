import { api } from "../lib/api"
import type { HealthEntry, AIAnalysis, Suggestion, HealthAnalytics } from "../types"

export const apiHealthService = {
    async analyzeEntry(entryText: string): Promise<AIAnalysis> {
        const response = await api.post("/health/analyze", { entryText })
        return response.data
    },

    async createEntry(entry: Omit<HealthEntry, "id" | "createdAt">): Promise<HealthEntry> {
        const response = await api.post("/health/entries", entry)
        return response.data
    },

    async getEntries(limit = 20): Promise<HealthEntry[]> {
        const response = await api.get(`/health/entries?limit=${limit}`)
        return response.data
    },

    async getSuggestions(): Promise<Suggestion[]> {
        const response = await api.get("/suggestions")
        return response.data
    },

    async getAnalytics(): Promise<HealthAnalytics> {
        const response = await api.get("/analytics/health")
        return response.data
    },
}
