"use client";

import { useState } from "react";
import { Bell, Shield, Trash2, Download, Mail, Smartphone, Package, Megaphone, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import NewsletterSubscription from "@/components/profile/NewsletterSubscription";

export default function UserSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: true,
  });

  const handleSettingChange = async (key: string, value: boolean) => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export-data");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user-data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Data exported successfully");
      } else {
        toast.error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/user/delete-account", {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Account deletion initiated");
          // Redirect to sign out or home page
        } else {
          toast.error("Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
            <p className="text-sm text-gray-500">Choose how you want to be notified about account activity</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("emailNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Smartphone className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("pushNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Order Updates</Label>
                <p className="text-sm text-gray-500">Get notified about order status changes</p>
              </div>
            </div>
            <Switch
              checked={settings.orderUpdates}
              onCheckedChange={(checked) =>
                handleSettingChange("orderUpdates", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Megaphone className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Marketing Emails</Label>
                <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
              </div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                handleSettingChange("marketingEmails", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-100 rounded-xl">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Security & Privacy</h2>
            <p className="text-sm text-gray-500">Manage your account security and privacy preferences</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                handleSettingChange("twoFactorAuth", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Eye className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <Label className="font-medium text-gray-900">Profile Visibility</Label>
                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
              </div>
            </div>
            <Switch
              checked={settings.profileVisibility}
              onCheckedChange={(checked) =>
                handleSettingChange("profileVisibility", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <NewsletterSubscription />

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <Download className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Data Management</h2>
            <p className="text-sm text-gray-500">Export or delete your account data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <Label className="font-medium text-gray-900">Export Data</Label>
              <p className="text-sm text-gray-500">Download a copy of your account data</p>
            </div>
            <Button variant="outline" onClick={handleExportData} className="rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-2xl bg-red-50 p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
