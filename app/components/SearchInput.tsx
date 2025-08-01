"use client"
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

export function SearchInput({search}:{search?:string}) {
    const router = useRouter();
    return (
        <>
            {/* Section de recherche */}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row items-center gap-4 my-6">
                <div className="relative w-full md:flex-1">
                    {/*                     <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" /> */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-10">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" /> {/* Icône de loupe */}
                    </div>
                    <input
                        type="search"
                        value={search}
                        placeholder="Rechercher par email ..."
                        defaultValue={search || ""} //Garde la valeur de la recherche dans l'input
                        onChange={(event) => {
                            router.push(`/users?search=${event.target.value}`)
                        }}
                        className="input w-full rounded-md border-accent-300 pl-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none"
                    />
                </div>

                
  {/* className="input input-bordered w-full pl-8" */} 


                <div className='w-full md:w-auto flex justify-end'>
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add user
                    </button>
                </div>
            </div>

                  


   
        </>
    )
}


