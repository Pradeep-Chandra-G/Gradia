import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "../generated/prisma/client";

/**
 * Utility function to ensure Clerk user exists in database
 * Call this in your protected pages to sync user on first visit
 *
 * Usage:
 * ```tsx
 * import { ensureUserInDatabase } from "@/lib/sync-user";
 *
 * async function MyPage() {
 *   const user = await ensureUserInDatabase();
 *   // user is now guaranteed to be in database
 * }
 * ```
 */
export async function ensureUserInDatabase() {
  // Get the current Clerk user
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("No authenticated user found");
  }

  // Check if user exists in database
  let dbUser = await prisma.user.findUnique({
    where: { id: clerkUser.id },
  });

  // If user doesn't exist, create them
  if (!dbUser) {
    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User has no email address");
    }

    // Get role from Clerk metadata (default to STUDENT)
    const role = (clerkUser.publicMetadata?.role as Role) || "STUDENT";

    dbUser = await prisma.user.create({
      data: {
        id: clerkUser.id,
        email: email,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "User",
        password: "", // Not used with Clerk
        role: role,
      },
    });

    console.log(`✅ Created user in database: ${email}`);
  }

  return dbUser;
}

/**
 * Get current user from database with all relations
 * This combines Clerk auth check with database query
 */
export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: {
      memberships: {
        include: {
          batch: true,
        },
      },
      createdTests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      attempts: {
        orderBy: {
          startedAt: "desc",
        },
        take: 10,
      },
    },
  });

  return dbUser;
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(role: Role | Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
}

/**
 * Require user to have specific role (throws error if not)
 */
export async function requireRole(role: Role | Role[]) {
  const allowed = await hasRole(role);

  if (!allowed) {
    throw new Error(
      `Unauthorized: This action requires ${Array.isArray(role) ? role.join(" or ") : role} role`,
    );
  }
}
