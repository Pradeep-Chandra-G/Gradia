import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Clerk Webhook Handler
 * This syncs Clerk users with your Prisma database
 *
 * Setup:
 * 1. Go to Clerk Dashboard > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhooks/clerk
 * 3. Subscribe to: user.created, user.updated, user.deleted
 * 4. Copy the signing secret and add to .env as CLERK_WEBHOOK_SECRET
 */

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env",
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    // Get primary email
    const email =
      email_addresses.find((e) => e.id === evt.data.primary_email_address_id)
        ?.email_address || email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error: No email found", { status: 400 });
    }

    try {
      // Create user in database
      await prisma.user.create({
        data: {
          id: id, // Use Clerk's user ID
          email: email,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          password: "", // Not used with Clerk
          role:
            (public_metadata?.role as "ADMIN" | "INSTRUCTOR" | "STUDENT") ||
            "STUDENT",
        },
      });

      console.log(`✅ User created: ${email}`);
    } catch (error) {
      console.error("Error creating user in database:", error);
      // Don't fail the webhook if user already exists
      if ((error as any)?.code !== "P2002") {
        return new Response("Error: Failed to create user", { status: 500 });
      }
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    const email =
      email_addresses.find((e) => e.id === evt.data.primary_email_address_id)
        ?.email_address || email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error: No email found", { status: 400 });
    }

    try {
      // Update user in database
      await prisma.user.update({
        where: { id: id },
        data: {
          email: email,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          role:
            (public_metadata?.role as "ADMIN" | "INSTRUCTOR" | "STUDENT") ||
            "STUDENT",
        },
      });

      console.log(`✅ User updated: ${email}`);
    } catch (error) {
      console.error("Error updating user in database:", error);
      return new Response("Error: Failed to update user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete user from database (or mark as deleted)
      await prisma.user.delete({
        where: { id: id as string },
      });

      console.log(`✅ User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user from database:", error);
      // Don't fail if user doesn't exist
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
