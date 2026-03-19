"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Search, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AISearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState('')
  const [locality, setLocality] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    window.openAISearch = (currentLocality) => {
      setLocality(currentLocality)
      onOpenChange(true)
    }
  }, [onOpenChange])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim() || !locality.trim()) return

    setLoading(true)
    try {
      // Mock AI search - replace with actual AI implementation
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResult(`Found results for "${query}" in ${locality}`)
    } catch (error) {
      console.error('AI search failed:', error)
      setResult('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-400" />
            AI Salon Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60">Location</label>
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
              {locality || 'Select location first'}
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/60">What are you looking for?</label>
              <Input
                placeholder="e.g., hair coloring, facial, bridal makeup..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Salons
                </>
              )}
            </Button>
          </form>
          
          {result && (
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">Search Results</h3>
              <p className="text-white/80">{result}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
