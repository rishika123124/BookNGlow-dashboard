"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Search, Loader2 } from 'lucide-react'
import { aiSalonServiceSearch } from '@/ai/flows/ai-salon-service-search'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AISearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [locality, setLocality] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    (window as any).openAISearch = (currentLocality: string) => {
      setLocality(currentLocality)
      setIsOpen(true)
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResult(null)
    try {
      const response = await aiSalonServiceSearch({ query, locality })
      setResult(response.searchResults)
    } catch (error) {
      setResult("I'm sorry, I couldn't process your request at the moment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Luxury Concierge
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            Ask about services, specific salons, or availability in <span className="font-bold text-accent">{locality}</span>.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Best place for a luxury facial near me?"
              className="pl-10 h-12 rounded-xl font-body border-gray-200 focus:ring-primary"
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-body"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search with Intelligence'}
          </Button>
        </form>

        <div className="mt-6 min-h-[100px] bg-gray-50 rounded-xl border border-gray-100 p-4 relative overflow-hidden">
          {loading && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-accent animate-[loading_1.5s_infinite]" style={{width: '30%'}} />
                  </div>
                  <span className="text-xs font-body text-muted-foreground">Consulting our experts...</span>
                </div>
             </div>
          )}
          
          <ScrollArea className="h-[250px]">
            {result ? (
              <div className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                {result}
              </div>
            ) : (
              !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4 opacity-40">
                  <Sparkles className="h-12 w-12 text-accent" />
                  <p className="font-body text-sm">
                    Enter a query to see AI-powered results personalized for {locality}.
                  </p>
                </div>
              )
            )}
          </ScrollArea>
        </div>
      </DialogContent>
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </Dialog>
  )
}