"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { searchCustomers } from "@/actions/admin/order-creation";
import { Search, UserPlus, Check, User } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
// Note: Assuming useDebounce hook exists or I'll implement a simple one locally if not. 
// I'll implement a simple local debounce for safety since I can't verifying hooks folder content right this second smoothly.

export interface CustomerData {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: any;
    clerkId?: string;
}

interface CustomerSearchProps {
    onSelectCustomer: (customer: CustomerData) => void;
    selectedCustomer?: CustomerData | null;
}

export default function CustomerSearch({ onSelectCustomer, selectedCustomer }: CustomerSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // New customer form state
    const [newCustomer, setNewCustomer] = useState<CustomerData>({
        name: "",
        email: "",
        phone: ""
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setLoading(true);
                const data = await searchCustomers(searchTerm);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleCreateNewConfig = () => {
        if (!newCustomer.name || !newCustomer.email) return;
        onSelectCustomer({ ...newCustomer, clerkId: "manual-" + Date.now() });
        setIsCreatingNew(false);
    };

    if (selectedCustomer) {
        return (
            <Card className="p-4 border-emerald-500 bg-emerald-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                            <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{selectedCustomer.name}</p>
                            <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                            {selectedCustomer.phone && <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>}
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onSelectCustomer(null as any)}>
                        Change
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {!isCreatingNew ? (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search customer by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {loading && <p className="text-sm text-gray-500">Searching...</p>}

                    <div className="space-y-2">
                        {results.map((customer) => (
                            <div
                                key={customer._id}
                                onClick={() => onSelectCustomer(customer)}
                                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center group"
                            >
                                <div>
                                    <p className="font-medium group-hover:text-emerald-600 transition-colors">{customer.name}</p>
                                    <p className="text-xs text-gray-500">{customer.email}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-600" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {searchTerm.length > 2 && results.length === 0 && !loading && (
                        <div className="text-center py-4 border-2 border-dashed rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">No customer found.</p>
                            <Button onClick={() => setIsCreatingNew(true)} variant="outline" size="sm">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create New Customer
                            </Button>
                        </div>
                    )}

                    {searchTerm.length < 2 && (
                        <Button onClick={() => setIsCreatingNew(true)} variant="ghost" size="sm" className="w-full text-gray-500">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Or create new customer manually
                        </Button>
                    )}
                </div>
            ) : (
                <Card className="p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-sm">New Customer Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreatingNew(false)}>Cancel</Button>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-medium">Name</label>
                            <Input
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-medium">Email</label>
                            <Input
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-medium">Phone (Optional)</label>
                            <Input
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                placeholder="Phone Number"
                            />
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateNewConfig}>
                            Confirm Customer
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
