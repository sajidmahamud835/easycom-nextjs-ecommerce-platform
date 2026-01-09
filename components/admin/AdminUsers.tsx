"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RefreshCw,
  Trash2,
  UserCheck,
  UserX,
  Database,
  Briefcase,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersSkeleton } from "./SkeletonLoaders";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { UserActionModal } from "./UserActionModal";
import { UserDetailsSidebar } from "./UserDetailsSidebar";
import { EmployeeAssignmentSidebar } from "./EmployeeAssignmentSidebar";
import { safeApiCall, handleApiError } from "./apiHelpers";
import {
  assignEmployeeRole,
  removeEmployeeRole,
} from "@/actions/employeeActions";
import {
  EmployeeRole,
  getRoleDisplayName,
  getRoleBadgeColor,
} from "@/types/employee";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CombinedUser {
  id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt?: number;
  emailVerified: boolean;
  banned: boolean;
  locked: boolean;
  // Sanity-specific fields
  isActive: boolean;
  activatedAt?: string;
  activatedBy?: string;
  sanityId?: string;
  inSanity: boolean;
  loyaltyPoints: number;
  totalSpent: number;
  notificationCount: number;
  // Employee fields
  isEmployee?: boolean;
  employeeRole?: string;
  employeeStatus?: string;
}

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [sanityUsersCount, setSanityUsersCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activatingUsers, setActivatingUsers] = useState<Set<string>>(
    new Set()
  );
  const [tableLoading, setTableLoading] = useState(false);

  // Modal state
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    user: CombinedUser | null;
    action: "activate" | "deactivate" | "delete" | null;
  }>({
    isOpen: false,
    user: null,
    action: null,
  });

  // Sidebar state
  const [sidebarState, setSidebarState] = useState<{
    isOpen: boolean;
    user: CombinedUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Employee assignment sidebar state
  const [employeeSidebarState, setEmployeeSidebarState] = useState<{
    isOpen: boolean;
    user: CombinedUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  const perPageOptions = [20, 30, 40, 50, 100];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes or per page changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(0);
    }
  }, [debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    setCurrentPage(0);
  }, [perPage]);

  // Utility functions
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Modal handlers
  const openActionModal = (
    user: CombinedUser,
    action: "activate" | "deactivate" | "delete"
  ) => {
    setActionModal({
      isOpen: true,
      user,
      action,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      user: null,
      action: null,
    });
  };

  // Sidebar handlers
  const openSidebar = (user: CombinedUser) => {
    setSidebarState({
      isOpen: true,
      user,
    });
  };

  const closeSidebar = () => {
    setSidebarState({
      isOpen: false,
      user: null,
    });
  };

  // User activation functions
  const handleUserActivation = async (userId: string, activate: boolean) => {
    setActivatingUsers((prev) => new Set(prev).add(userId));

    try {
      const action = activate ? "activate" : "deactivate";
      await safeApiCall(`/api/admin/users/${userId}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      // Immediately fetch fresh data
      await fetchUsers(currentPage, true);
    } catch (error) {
      handleApiError(error, `User ${activate ? "activation" : "deactivation"}`);
    } finally {
      setActivatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Handle user update for instant feedback
  const handleUserUpdate = (updatedUser: CombinedUser) => {
    // Update the user in the users list
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    // Update the sidebar state with the new user data
    setSidebarState((prev) => ({
      ...prev,
      user: updatedUser,
    }));

    // Update counts
    setSanityUsersCount((prev) => prev + 1);
    setActiveUsersCount((prev) => prev + 1);
  };

  // User deletion from Sanity
  const handleUserDeletion = async (userId: string) => {
    setActivatingUsers((prev) => new Set(prev).add(userId));

    try {
      await safeApiCall(`/api/admin/users/${userId}/delete-sanity`, {
        method: "DELETE",
      });

      // Immediately fetch fresh data
      await fetchUsers(currentPage, true);
    } catch (error) {
      handleApiError(error, "User deletion from Sanity");
    } finally {
      setActivatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Confirm action handler
  const handleConfirmAction = async () => {
    if (!actionModal.user || !actionModal.action) return;

    const { user, action } = actionModal;
    closeActionModal();

    switch (action) {
      case "activate":
        await handleUserActivation(user.id, true);
        break;
      case "deactivate":
        await handleUserActivation(user.id, false);
        break;
      case "delete":
        await handleUserDeletion(user.id);
        break;
    }
  };

  // Open employee assignment dialog
  const openEmployeeDialog = (user: CombinedUser) => {
    setEmployeeSidebarState({
      isOpen: true,
      user,
    });
  };

  // Close employee assignment dialog
  const closeEmployeeDialog = () => {
    setEmployeeSidebarState({
      isOpen: false,
      user: null,
    });
  };

  // Handle employee role assignment
  const handleAssignEmployee = async (sanityId: string, role: EmployeeRole) => {
    try {
      const result = await assignEmployeeRole(sanityId, role);

      if (result.success) {
        toast.success(result.message);
        // Immediately fetch fresh data
        await fetchUsers(currentPage, true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error assigning employee role:", error);
      toast.error("Failed to assign employee role");
    }
  };

  // Handle employee role removal
  const handleRemoveEmployee = async (sanityId: string, userName: string) => {
    try {
      const result = await removeEmployeeRole(sanityId);

      if (result.success) {
        toast.success(result.message);
        // Immediately fetch fresh data and close sidebar
        await fetchUsers(currentPage, true);
        closeEmployeeDialog();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error removing employee role:", error);
      toast.error("Failed to remove employee role");
    }
  };

  // Fetch users
  const fetchUsers = useCallback(
    async (page = 0, forceFresh = false) => {
      setTableLoading(true);
      try {
        // Add cache-busting parameter for fresh data
        const cacheBuster = forceFresh ? `&_t=${Date.now()}` : "";
        const data = await safeApiCall(
          `/api/admin/users/combined?limit=${perPage}&offset=${page * perPage
          }&query=${debouncedSearchTerm}${cacheBuster}`
        );
        setUsers(data.users);
        setTotalUsersCount(data.totalCount);
        setSanityUsersCount(data.sanityUsersCount || 0);
        setActiveUsersCount(data.activeUsersCount || 0);
      } catch (error) {
        handleApiError(error, "Users fetch");
      } finally {
        setTableLoading(false);
      }
    },
    [debouncedSearchTerm, perPage]
  );

  // Selection functions
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // Delete functions
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUsers = async () => {
    setIsDeleting(true);
    try {
      await safeApiCall("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      fetchUsers(currentPage);
      setSelectedUsers([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      handleApiError(error, "Users delete");
    } finally {
      setIsDeleting(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  return (
    <>
      <div className="space-y-6">
        {/* Modern Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Users Management</h1>
                <p className="text-white/70 text-sm">Manage and monitor user accounts</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <span className="text-sm text-white/70">Total</span>
                <span className="text-xl font-bold">{totalUsersCount}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/30 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                <Database className="h-4 w-4" />
                <span className="text-sm text-white/70">Sanity</span>
                <span className="text-xl font-bold">{sanityUsersCount}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-xl border border-green-400/30">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm text-white/70">Active</span>
                <span className="text-xl font-bold">{activeUsersCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Show:</span>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => setPerPage(Number(value))}
            >
              <SelectTrigger className="w-20 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {perPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-xl"
            />
            <Button
              onClick={() => fetchUsers(currentPage)}
              size="sm"
              className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              disabled={tableLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", tableLoading && "animate-spin")}
              />
            </Button>
          </div>
        </div>

        {(loading && users.length === 0) || tableLoading ? (
          <UsersSkeleton />
        ) : (
          <>
            {selectedUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-md">
                <span className="text-sm font-semibold text-blue-900 text-center sm:text-left">
                  ✓ {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                </span>
                <Button
                  onClick={openDeleteDialog}
                  variant="destructive"
                  size="sm"
                  className="gap-2 w-full sm:w-auto rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}

            <Card className="relative border-0 shadow-xl rounded-2xl overflow-hidden">
              {tableLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-2xl">
                  <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              )}
              <div className="hidden md:block responsive-table-container overflow-x-auto">
                <Table className="border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-none">
                      <TableHead className="w-12 border-b border-gray-200/60 text-gray-600 font-semibold">
                        <Checkbox
                          checked={
                            selectedUsers.length === users.length &&
                            users.length > 0
                          }
                          onCheckedChange={selectAllUsers}
                        />
                      </TableHead>
                      <TableHead className="min-w-[200px] border-b border-gray-200/60 text-gray-600 font-semibold">User</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[200px] border-b border-gray-200/60 text-gray-600 font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="hidden xl:table-cell min-w-[120px] border-b border-gray-200/60 text-gray-600 font-semibold">
                        Joined
                      </TableHead>
                      <TableHead className="hidden xl:table-cell min-w-[120px] border-b border-gray-200/60 text-gray-600 font-semibold">
                        Last Sign In
                      </TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[120px] border-b border-gray-200/60 text-gray-600 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="min-w-[140px] border-b border-gray-200/60 text-gray-600 font-semibold">
                        Sanity Status
                      </TableHead>
                      <TableHead className="min-w-[120px] border-b border-gray-200/60 text-gray-600 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <TableRow className="border-none">
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-gray-400"
                        >
                          No users found.{" "}
                          {totalUsersCount > 0
                            ? `Total users: ${totalUsersCount}`
                            : "No users in database."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <TableRow key={user.id} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-200 border-none group">
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() =>
                                toggleUserSelection(user.id)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={user.imageUrl}
                                alt={user.fullName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-500 lg:hidden">
                                  {user.email}
                                </div>
                                {user.inSanity && (
                                  <div className="text-xs text-muted-foreground">
                                    Points: {user.loyaltyPoints} | Spent: $
                                    {user.totalSpent}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {user.email}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {user.lastSignInAt
                              ? formatDate(user.lastSignInAt)
                              : "Never"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex gap-1">
                              <Badge
                                variant={
                                  user.emailVerified ? "default" : "secondary"
                                }
                              >
                                {user.emailVerified ? "Verified" : "Unverified"}
                              </Badge>
                              {user.banned && (
                                <Badge variant="destructive">Banned</Badge>
                              )}
                              {user.locked && (
                                <Badge variant="outline">Locked</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.inSanity ? (
                                <Badge
                                  variant={
                                    user.isActive ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  <Database className="h-3 w-3 mr-1" />
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Not in Sanity
                                </Badge>
                              )}
                              {user.isEmployee && user.employeeRole && (
                                <Badge variant="secondary" className="text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {user.employeeRole}
                                </Badge>
                              )}
                              {!user.isEmployee &&
                                user.notificationCount > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs hidden lg:inline-flex"
                                  >
                                    {user.notificationCount} notifications
                                  </Badge>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {!user.inSanity ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => openSidebar(user)}
                                  disabled={activatingUsers.has(user.id)}
                                  className="h-8 px-3"
                                >
                                  {activatingUsers.has(user.id) ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <UserCheck className="h-3 w-3" />
                                  )}
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant={
                                      user.isEmployee ? "outline" : "secondary"
                                    }
                                    size="sm"
                                    onClick={() => openEmployeeDialog(user)}
                                    className="h-8 px-3"
                                    title={
                                      user.isEmployee
                                        ? "Manage Employee Role"
                                        : "Assign Employee Role"
                                    }
                                  >
                                    <Briefcase className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant={
                                      user.isActive ? "destructive" : "default"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      openActionModal(
                                        user,
                                        user.isActive
                                          ? "deactivate"
                                          : "activate"
                                      )
                                    }
                                    disabled={activatingUsers.has(user.id)}
                                    className="h-8 px-3"
                                  >
                                    {activatingUsers.has(user.id) ? (
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : user.isActive ? (
                                      <UserX className="h-3 w-3" />
                                    ) : (
                                      <UserCheck className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      openActionModal(user, "delete")
                                    }
                                    disabled={activatingUsers.has(user.id)}
                                    className="h-8 px-3"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-3">
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found.{" "}
                    {totalUsersCount > 0
                      ? `Total users: ${totalUsersCount}`
                      : "No users in database."}
                  </div>
                ) : (
                  users.map((user, index) => (
                    <Card
                      key={user.id}
                      className="mobile-user-card p-3"
                      style={{ "--card-index": index } as React.CSSProperties}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                          <img
                            src={user.imageUrl}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {user.email}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Joined: {formatDate(user.createdAt)}
                            </div>
                            {user.inSanity && (
                              <div className="text-xs text-muted-foreground">
                                Points: {user.loyaltyPoints} | Spent: $
                                {user.totalSpent}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-3">
                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={
                              user.emailVerified ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                          {user.banned && (
                            <Badge variant="destructive" className="text-xs">
                              Banned
                            </Badge>
                          )}
                          {user.locked && (
                            <Badge variant="outline" className="text-xs">
                              Locked
                            </Badge>
                          )}
                          {user.inSanity ? (
                            <Badge
                              variant={user.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              <Database className="h-3 w-3 mr-1" />
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Not in Sanity
                            </Badge>
                          )}
                          {user.isEmployee && user.employeeRole && (
                            <Badge variant="secondary" className="text-xs">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {user.employeeRole}
                            </Badge>
                          )}
                          {user.notificationCount > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {user.notificationCount} notifications
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <div className="text-xs text-muted-foreground">
                            Last:{" "}
                            {user.lastSignInAt
                              ? formatDate(user.lastSignInAt)
                              : "Never"}
                          </div>
                          <div className="flex items-center gap-2">
                            {!user.inSanity ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openSidebar(user)}
                                disabled={activatingUsers.has(user.id)}
                                className="h-7 px-2 text-xs"
                              >
                                {activatingUsers.has(user.id) ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Add
                                  </>
                                )}
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant={
                                    user.isEmployee ? "outline" : "secondary"
                                  }
                                  size="sm"
                                  onClick={() => openEmployeeDialog(user)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {user.isEmployee ? "Manage" : "Assign"}
                                </Button>
                                <Button
                                  variant={
                                    user.isActive ? "destructive" : "default"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    openActionModal(
                                      user,
                                      user.isActive ? "deactivate" : "activate"
                                    )
                                  }
                                  disabled={activatingUsers.has(user.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  {activatingUsers.has(user.id) ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : user.isActive ? (
                                    <>
                                      <UserX className="h-3 w-3 mr-1" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Activate
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openActionModal(user, "delete")
                                  }
                                  disabled={activatingUsers.has(user.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {Math.min(currentPage * perPage + 1, totalUsersCount)}{" "}
                to {Math.min((currentPage + 1) * perPage, totalUsersCount)} of{" "}
                {totalUsersCount} users
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || tableLoading}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2 whitespace-nowrap">
                  Page {currentPage + 1} of{" "}
                  {Math.max(1, Math.ceil(totalUsersCount / perPage))}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    (currentPage + 1) * perPage >= totalUsersCount ||
                    tableLoading ||
                    totalUsersCount <= perPage
                  }
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUsers}
        title="Delete Users"
        description={`Are you sure you want to delete ${selectedUsers.length
          } user${selectedUsers.length > 1 ? "s" : ""
          }? This action cannot be undone.`}
        itemCount={selectedUsers.length}
        isLoading={isDeleting}
      />

      {/* User Action Confirmation Modal */}
      <UserActionModal
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
        user={
          actionModal.user
            ? {
              firstName: actionModal.user.firstName,
              lastName: actionModal.user.lastName,
              email: actionModal.user.email,
              isActive: actionModal.user.isActive,
              inSanity: actionModal.user.inSanity,
              notificationCount: actionModal.user.notificationCount,
            }
            : null
        }
        action={actionModal.action}
        isLoading={activatingUsers.has(actionModal.user?.id || "")}
      />

      {/* User Details Sidebar */}
      <UserDetailsSidebar
        isOpen={sidebarState.isOpen}
        onClose={closeSidebar}
        user={sidebarState.user}
        onActivate={handleUserActivation}
        onDelete={handleUserDeletion}
        onUserUpdate={handleUserUpdate}
        isLoading={activatingUsers.has(sidebarState.user?.id || "")}
      />

      {/* Employee Assignment Sidebar */}
      <EmployeeAssignmentSidebar
        isOpen={employeeSidebarState.isOpen}
        onClose={closeEmployeeDialog}
        user={employeeSidebarState.user}
        onAssignRole={handleAssignEmployee}
        onRemoveRole={handleRemoveEmployee}
        isLoading={activatingUsers.has(employeeSidebarState.user?.id || "")}
      />
    </>
  );
};

export default AdminUsers;
