"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Palette,
  Database,
} from "lucide-react";

function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState({
    email: true,
    quizReminders: true,
    results: true,
  });
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for now
      localStorage.setItem(
        "settings",
        JSON.stringify({
          notifications,
          theme,
          language,
          timezone,
        }),
      );
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.notifications || notifications);
        setTheme(parsed.theme || theme);
        setLanguage(parsed.language || language);
        setTimezone(parsed.timezone || timezone);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-background text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-foreground">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-8 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-button/10 p-2 rounded-lg">
                  <User className="text-primary-button" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <p className="text-sm text-gray-400">
                    Manage your personal information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={
                      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                      "User"
                    }
                    disabled
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Managed by Clerk. Update in your{" "}
                    <a
                      href="https://accounts.clerk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-button hover:underline"
                    >
                      Clerk account
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.emailAddresses[0]?.emailAddress || ""}
                    disabled
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email is managed by Clerk authentication
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={user?.id || ""}
                    disabled
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-gray-400 cursor-not-allowed font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <Bell className="text-amber-500" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-sm text-gray-400">
                    Configure how you receive notifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-400" />
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-400">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-400" />
                    <div>
                      <p className="font-semibold">Quiz Reminders</p>
                      <p className="text-sm text-gray-400">
                        Get reminded about upcoming quizzes
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.quizReminders}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        quizReminders: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-400" />
                    <div>
                      <p className="font-semibold">Result Notifications</p>
                      <p className="text-sm text-gray-400">
                        Get notified when results are published
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.results}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        results: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Palette className="text-blue-500" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Preferences</h2>
                  <p className="text-sm text-gray-400">
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  >
                    <option value="dark">Dark (Default)</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
