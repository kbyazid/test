"use client"
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

export function SearchInput({search}:{search?:string}) {
    const router = useRouter();
    return (
        <>
            {/* Section de recherche */}
            <div className="flex items-center justify-between bg-base-100 rounded-box shadow-md my-4"> {/* w-80 comme dans image_c76620.jpg */}
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" /> {/* Icône de loupe */}
                    </div>
                    {/* Input de recherche. Note : Pour une recherche interactive sans rechargement,
                  cela devrait être un Client Component. Ici, c'est pour un exemple simple
                  qui rechargera la page à la soumission ou au changement. */}
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none"
                        onChange={(event) => { 
                            console.log("saisie en cours", event.target.value);
                            router.push(`/users?search=${event.target.value}`)
                         }}
                        placeholder="Search"
                        defaultValue={search || ""} //Garde la valeur de la recherche dans l'input
                    />
                </div>


                {/* Bouton "Add user" */}
                <div className="mt-0 ml-16 flex-none"> {/* ml-16 flex-none comme dans image_c7bba0.png */}
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add user
                    </button>
                </div>
            </div>
        </>
    )
}


