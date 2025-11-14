"use client"

import { useState, useEffect } from "react"
import { EntryCard } from "./entry-card"
import { Button} from "../ui/button.tsx";
import { Input} from "../ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import { Search, Filter, Calendar } from "lucide-react"
import { useHealthStore } from "../../lib/store"
import type { HealthEntry } from "../../types"

export function EntryList() {
    const { entries } = useHealthStore()
    const [filteredEntries, setFilteredEntries] = useState<HealthEntry[]>(entries)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("date")
    const [filterBy, setFilterBy] = useState("all")

    useEffect(() => {
        let filtered = [...entries]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((entry) => entry.entryText.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        // Sentiment filter
        if (filterBy !== "all") {
            filtered = filtered.filter((entry) => entry.aiAnalysis?.sentiment === filterBy)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "mood":
                    return b.moodScore - a.moodScore
                case "energy":
                    return b.energyScore - a.energyScore
                case "sleep":
                    return b.sleepHours - a.sleepHours
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        setFilteredEntries(filtered)
    }, [entries, searchTerm, sortBy, filterBy])

    if (entries.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No journal entries yet</h3>
                <p className="text-muted-foreground">Start by creating your first health journal entry above.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Latest First</SelectItem>
                        <SelectItem value="mood">Highest Mood</SelectItem>
                        <SelectItem value="energy">Highest Energy</SelectItem>
                        <SelectItem value="sleep">Most Sleep</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Entries</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredEntries.length} of {entries.length} entries
                </p>
            </div>

            {/* Entry Cards */}
            <div className="space-y-6">
                {filteredEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                ))}
            </div>

            {filteredEntries.length === 0 && entries.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No entries match your current filters.</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("")
                            setFilterBy("all")
                        }}
                        className="mt-4"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}
