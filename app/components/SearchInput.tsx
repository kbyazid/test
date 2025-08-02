'use client'

import React, { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface SearchInputProps {
  search: string
}

const DEBOUNCE_DELAY = 500;

export function SearchInput({ search }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(search)
  const [isPending, startTransition] = useTransition()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchValue(search)
  }, [search])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (inputRef.current) inputRef.current.focus()
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set('search', value)
        else params.delete('search')
        params.delete('page')
        
        const newUrl = `/users${params.toString() ? `?${params.toString()}` : ''}`
        router.push(newUrl)
      })
    }, DEBOUNCE_DELAY)
  }

  const handleSearchImmediate = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (searchValue) params.set('search', searchValue)
      else params.delete('search')
      params.delete('page')
      
      const newUrl = `/users${params.toString() ? `?${params.toString()}` : ''}`
      router.push(newUrl)
    })
  }

  const clearSearch = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    setSearchValue('')
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.delete('search')
      params.delete('page')
      const newUrl = `/users${params.toString() ? `?${params.toString()}` : ''}`
      router.push(newUrl)
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="relative">
          <button
            onClick={handleSearchImmediate}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isPending}
            >
            <Search className="h-4 w-4" />
        </button>

            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher par email..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              disabled={isPending}
            />
            {searchValue && (
              <>
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </button>
                {/* <button
                  onClick={handleSearchImmediate}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  disabled={isPending}
                >
                  <Search className="h-4 w-4" />
                </button> */}
              </>
            )}
          </div>
          {isPending && (
            <div className="absolute top-full left-0 mt-1 text-sm text-gray-500">
              Recherche en cours...
            </div>
          )}
        </div>

        <Link
          href="/users/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          Ajouter un utilisateur
        </Link>
      </div>
    </div>
  )
}