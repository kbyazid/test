import React from 'react'

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    const pages = (await searchParams).page
    const pageParam = pages;
  // Assurez-vous que 'page' est un nombre valide, par défaut 1
  /* const page = Number(pageParam) || 1; */
  console.log('Page actuelle:', pageParam);
    
  return (
    <div>
      EN attente {pageParam} 
    </div>
  )
}

