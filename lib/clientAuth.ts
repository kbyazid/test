"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRequireAuth(requiredRole?: string) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
      router.push("/sign-in");
      return;
    }

    // Vérifier le statut et rôle dans votre DB
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/check-user-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: user?.primaryEmailAddress?.emailAddress,
            requiredRole 
          }),
        });

        const result = await response.json();

        if (!result.authorized) {
          router.push(result.redirectTo || "/sign-in");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [isLoaded, isSignedIn, user, router, requiredRole]);

  return { isAuthorized, isLoading };
}