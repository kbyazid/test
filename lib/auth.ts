import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function requireAuth(requiredRole?: string) {
  const clerkUser = await currentUser();
  
  if (!clerkUser?.primaryEmailAddress?.emailAddress) {
    redirect("/sign-in");
  }

  const email = clerkUser.primaryEmailAddress.emailAddress;

  const appUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!appUser) {
    redirect("/sign-in");
  }

  if (!appUser.status) {
    redirect("/inactive");
  }

  if (requiredRole && appUser.role !== requiredRole) {
    redirect("/unauthorized");
  }

  return { clerkUser, appUser };
}