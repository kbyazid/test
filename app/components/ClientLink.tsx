// app/components/ClientLink.tsx
"use client";

import Link from "next/link";
import React from "react";

interface ClientLinkProps {
  href: string;
  children: React.ReactNode;
  key?: string | number; // Pour le key dans le map
}

export default function ClientLink({ href, children, key }: ClientLinkProps) {
  return (
    <Link href={href} key={key}>
      {children}
    </Link>
  );
}