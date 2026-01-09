"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import {
  Crown,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import AccountRequestsOverview from "@/components/admin/AccountRequestsOverview";

interface UserRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  premiumStatus: string;
  businessStatus: string;
  premiumAppliedAt?: string;
  businessAppliedAt?: string;
  premiumApprovedAt?: string;
  businessApprovedAt?: string;
  rejectionReason?: string;
}

const ApprovedAccountsTable = ({
  premiumAccounts,
  businessAccounts,
  setCancelDialog,
}: {
  premiumAccounts: UserRequest[];
  businessAccounts: UserRequest[];
  setCancelDialog: (dialog: {
    isOpen: boolean;
    userId: string;
    type: "premium" | "business";
    userEmail: string;
  }) => void;
}) => {
  const allApprovedAccounts = [
    ...premiumAccounts.map((account) => ({
      ...account,
      accountType: "premium" as const,
    })),
    ...businessAccounts.map((account) => ({
      ...account,
      accountType: "business" as const,
    })),
  ].sort((a, b) => {
    const dateA =
      a.accountType === "premium" ? a.premiumApprovedAt : a.businessApprovedAt;
    const dateB =
      b.accountType === "premium" ? b.premiumApprovedAt : b.businessApprovedAt;
    return new Date(dateB || "").getTime() - new Date(dateA || "").getTime();
  });

  if (allApprovedAccounts.length === 0) {
    return (
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Approved Accounts
          </h3>
          <p className="text-gray-500 text-center">
            There are currently no approved accounts to manage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Approved Accounts ({allApprovedAccounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Account Type</TableHead>
                <TableHead className="font-semibold">Approved Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allApprovedAccounts.map((account) => {
                const approvedAt =
                  account.accountType === "premium"
                    ? account.premiumApprovedAt
                    : account.businessApprovedAt;

                return (
                  <TableRow
                    key={`${account._id}-${account.accountType}`}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${account.accountType === "premium"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                            }`}
                        >
                          {account.accountType === "premium" ? (
                            <Crown className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Building2 className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {account.firstName} {account.lastName}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {account.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={
                          account.accountType === "premium"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {account.accountType === "premium" ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : (
                          <Building2 className="w-3 h-3 mr-1" />
                        )}
                        {account.accountType === "premium"
                          ? "Premium"
                          : "Business"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      {approvedAt ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(approvedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => {
                            setCancelDialog({
                              isOpen: true,
                              userId: account._id,
                              type: account.accountType,
                              userEmail: account.email,
                            });
                          }}
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {allApprovedAccounts.map((account) => {
            const approvedAt =
              account.accountType === "premium"
                ? account.premiumApprovedAt
                : account.businessApprovedAt;

            return (
              <Card
                key={`${account._id}-${account.accountType}`}
                className="border border-gray-200"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${account.accountType === "premium"
                        ? "bg-amber-100"
                        : "bg-blue-100"
                        }`}
                    >
                      {account.accountType === "premium" ? (
                        <Crown className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {account.firstName} {account.lastName}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{account.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-600">Account Type:</div>
                      <Badge
                        className={
                          account.accountType === "premium"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {account.accountType === "premium" ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : (
                          <Building2 className="w-3 h-3 mr-1" />
                        )}
                        {account.accountType === "premium"
                          ? "Premium"
                          : "Business"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-gray-600">Approved:</div>
                      <div className="text-sm">
                        {approvedAt
                          ? new Date(approvedAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    <Button
                      onClick={() => {
                        setCancelDialog({
                          isOpen: true,
                          userId: account._id,
                          type: account.accountType,
                          userEmail: account.email,
                        });
                      }}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const RequestTable = ({
  users,
  type,
  handleApprove,
  setRejectDialog,
  actionLoading,
  getStatusBadge,
}: {
  users: UserRequest[];
  type: "premium" | "business";
  handleApprove: (userId: string, type: "premium" | "business") => void;
  setRejectDialog: (dialog: {
    isOpen: boolean;
    userId: string;
    type: "premium" | "business";
    userEmail: string;
  }) => void;
  actionLoading: string | null;
  getStatusBadge: (
    status: string,
    type: "premium" | "business"
  ) => React.ReactNode;
}) => {
  if (users.length === 0) {
    const Icon = type === "premium" ? Crown : Building2;
    const gradientFrom = type === "premium" ? "from-amber-100" : "from-blue-100";
    const gradientTo = type === "premium" ? "to-orange-100" : "to-indigo-100";
    const iconColor = type === "premium" ? "text-amber-500" : "text-blue-500";
    return (
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className={`p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl mb-4`}>
            <Icon className={`w-12 h-12 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {type === "premium" ? "Premium" : "Business"} Requests
          </h3>
          <p className="text-gray-500 text-center">
            There are currently no {type} account requests to review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
      <CardHeader className={`bg-gradient-to-r pb-4 ${type === "premium" ? "from-amber-50 via-orange-50 to-amber-50" : "from-blue-50 via-indigo-50 to-blue-50"}`}>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={`p-2 ${type === "premium" ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-indigo-500"} rounded-xl shadow-lg`}>
            {type === "premium" ? (
              <Crown className="w-5 h-5 text-white" />
            ) : (
              <Building2 className="w-5 h-5 text-white" />
            )}
          </div>
          {type === "premium" ? "Premium" : "Business"} Account Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Applied Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const status =
                  type === "premium" ? user.premiumStatus : user.businessStatus;
                const appliedAt =
                  type === "premium"
                    ? user.premiumAppliedAt
                    : user.businessAppliedAt;

                return (
                  <TableRow
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${type === "premium" ? "bg-amber-100" : "bg-blue-100"
                            }`}
                        >
                          {type === "premium" ? (
                            <Crown className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Building2 className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      {appliedAt ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(appliedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      {getStatusBadge(status, type)}
                      {status === "rejected" && user.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs max-w-xs">
                          <div className="flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 line-clamp-2">
                              {user.rejectionReason}
                            </span>
                          </div>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      {status === "pending" && (
                        <div className="flex gap-2 justify-center flex-wrap">
                          <Button
                            onClick={() => handleApprove(user._id, type)}
                            disabled={actionLoading === user._id}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {actionLoading === user._id ? "..." : "Approve"}
                          </Button>
                          <Button
                            onClick={() =>
                              setRejectDialog({
                                isOpen: true,
                                userId: user._id,
                                type,
                                userEmail: user.email,
                              })
                            }
                            disabled={actionLoading === user._id}
                            variant="destructive"
                            size="sm"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {status !== "pending" && (
                        <div className="text-center text-sm text-gray-500">
                          No actions available
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {users.map((user) => {
            const status =
              type === "premium" ? user.premiumStatus : user.businessStatus;
            const appliedAt =
              type === "premium"
                ? user.premiumAppliedAt
                : user.businessAppliedAt;

            return (
              <Card key={user._id} className="border border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${type === "premium" ? "bg-amber-100" : "bg-blue-100"
                        }`}
                    >
                      {type === "premium" ? (
                        <Crown className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                    {getStatusBadge(status, type)}
                  </div>

                  {appliedAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Applied: {new Date(appliedAt).toLocaleDateString()}
                    </div>
                  )}

                  {status === "rejected" && user.rejectionReason && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-700">
                          {user.rejectionReason}
                        </span>
                      </div>
                    </div>
                  )}

                  {status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApprove(user._id, type)}
                        disabled={actionLoading === user._id}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {actionLoading === user._id ? "..." : "Approve"}
                      </Button>
                      <Button
                        onClick={() =>
                          setRejectDialog({
                            isOpen: true,
                            userId: user._id,
                            type,
                            userEmail: user.email,
                          })
                        }
                        disabled={actionLoading === user._id}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AccountRequestsClient() {
  const [premiumRequests, setPremiumRequests] = useState<UserRequest[]>([]);
  const [businessRequests, setBusinessRequests] = useState<UserRequest[]>([]);
  const [approvedPremiumAccounts, setApprovedPremiumAccounts] = useState<
    UserRequest[]
  >([]);
  const [approvedBusinessAccounts, setApprovedBusinessAccounts] = useState<
    UserRequest[]
  >([]);
  const [allUsers, setAllUsers] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    userId: string;
    type: "premium" | "business";
    userEmail: string;
  }>({
    isOpen: false,
    userId: "",
    type: "premium",
    userEmail: "",
  });
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean;
    userId: string;
    type: "premium" | "business";
    userEmail: string;
  }>({
    isOpen: false,
    userId: "",
    type: "premium",
    userEmail: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/admin/account-requests?t=${timestamp}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPremiumRequests(data.premiumRequests || []);
        setBusinessRequests(data.businessRequests || []);
        setApprovedPremiumAccounts(data.approvedPremiumAccounts || []);
        setApprovedBusinessAccounts(data.approvedBusinessAccounts || []);
        setAllUsers(data.allUsers || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch account requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (
    userId: string,
    type: "premium" | "business"
  ) => {
    try {
      setActionLoading(userId);
      const response = await fetch("/api/admin/approve-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setTimeout(async () => {
          setRefreshing(true);
          toast.info("Updating account lists...", { duration: 1000 });
          await fetchRequests();
          setRefreshing(false);
        }, 500);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to approve account");
      }
    } catch (error) {
      console.error("Error approving account:", error);
      toast.error("Failed to approve account");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading(rejectDialog.userId);
      const response = await fetch("/api/admin/reject-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: rejectDialog.userId,
          type: rejectDialog.type,
          reason: rejectReason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setRejectDialog({
          isOpen: false,
          userId: "",
          type: "premium",
          userEmail: "",
        });
        setRejectReason("");
        setTimeout(async () => {
          setRefreshing(true);
          toast.info("Updating account lists...", { duration: 1000 });
          await fetchRequests();
          setRefreshing(false);
        }, 500);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to reject account");
      }
    } catch (error) {
      console.error("Error rejecting account:", error);
      toast.error("Failed to reject account");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      setActionLoading(cancelDialog.userId);
      const response = await fetch("/api/admin/cancel-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: cancelDialog.userId,
          type: cancelDialog.type,
          reason: cancelReason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setCancelDialog({
          isOpen: false,
          userId: "",
          type: "premium",
          userEmail: "",
        });
        setCancelReason("");
        setTimeout(async () => {
          setRefreshing(true);
          toast.info("Updating account lists...", { duration: 1000 });
          await fetchRequests();
          setRefreshing(false);
        }, 500);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to cancel account");
      }
    } catch (error) {
      console.error("Error cancelling account:", error);
      toast.error("Failed to cancel account");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, type: "premium" | "business") => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalPremiumRequests: allUsers.filter((u) => u.premiumStatus !== "none")
      .length,
    totalBusinessRequests: allUsers.filter((u) => u.businessStatus !== "none")
      .length,
    pendingPremiumRequests: premiumRequests.length,
    pendingBusinessRequests: businessRequests.length,
    approvedPremiumRequests: allUsers.filter(
      (u) => u.premiumStatus === "active"
    ).length,
    approvedBusinessRequests: allUsers.filter(
      (u) => u.businessStatus === "active"
    ).length,
    rejectedPremiumRequests: allUsers.filter(
      (u) => u.premiumStatus === "rejected"
    ).length,
    rejectedBusinessRequests: allUsers.filter(
      (u) => u.businessStatus === "rejected"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Account Requests</h1>
              <p className="text-white/70 text-sm">Manage premium and business applications</p>
            </div>
          </div>
          <Button
            onClick={fetchRequests}
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading || refreshing ? "animate-spin" : ""
                }`}
            />
            {refreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      <AccountRequestsOverview stats={stats} />

      <Tabs defaultValue="premium" className="space-y-6">
        <TabsList className="grid w-full max-w-4xl grid-cols-3 bg-white p-1.5 rounded-2xl shadow-lg border border-gray-100">
          <TabsTrigger value="premium" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Crown className="w-4 h-4" />
            Premium ({premiumRequests.length})
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Building2 className="w-4 h-4" />
            Business ({businessRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <CheckCircle className="w-4 h-4" />
            Approved ({approvedPremiumAccounts.length + approvedBusinessAccounts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="premium" className="space-y-4">
          <RequestTable
            users={premiumRequests}
            type="premium"
            handleApprove={handleApprove}
            setRejectDialog={setRejectDialog}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <RequestTable
            users={businessRequests}
            type="business"
            handleApprove={handleApprove}
            setRejectDialog={setRejectDialog}
            actionLoading={actionLoading}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ApprovedAccountsTable
            premiumAccounts={approvedPremiumAccounts}
            businessAccounts={approvedBusinessAccounts}
            setCancelDialog={setCancelDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setRejectDialog({
              isOpen: false,
              userId: "",
              type: "premium",
              userEmail: "",
            });
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejectDialog.type === "premium" ? "Premium" : "Business"}{" "}
              Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {rejectDialog.userEmail}
              &apos;s {rejectDialog.type} account application. This reason will
              be visible to the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog({
                  isOpen: false,
                  userId: "",
                  type: "premium",
                  userEmail: "",
                });
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={
                !rejectReason.trim() || actionLoading === rejectDialog.userId
              }
            >
              {actionLoading === rejectDialog.userId
                ? "Rejecting..."
                : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCancelDialog({
              isOpen: false,
              userId: "",
              type: "premium",
              userEmail: "",
            });
            setCancelReason("");
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
            )}
          >
            <VisuallyHidden.Root>
              <DialogTitle>
                Cancel{" "}
                {cancelDialog.type === "premium" ? "Premium" : "Business"}{" "}
                Account
              </DialogTitle>
            </VisuallyHidden.Root>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border-4 border-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Cancel{" "}
                  {cancelDialog.type === "premium" ? "Premium" : "Business"}{" "}
                  Account
                </h3>
                <p className="text-sm text-gray-600">
                  Please provide a reason for cancelling{" "}
                  {cancelDialog.userEmail}&apos;s {cancelDialog.type} account.
                  This action will deactivate their account and they will lose
                  access to {cancelDialog.type} features.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Enter cancellation reason..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCancelDialog({
                    isOpen: false,
                    userId: "",
                    type: "premium",
                    userEmail: "",
                  });
                  setCancelReason("");
                }}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={
                  !cancelReason.trim() || actionLoading === cancelDialog.userId
                }
                className="min-w-[120px] bg-red-600 hover:bg-red-700"
              >
                {actionLoading === cancelDialog.userId ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Cancelling...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Cancel Account
                  </div>
                )}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
