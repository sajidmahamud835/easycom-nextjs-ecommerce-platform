"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, CreditCard, Sparkles, CheckCircle, AlertCircle, Copy, Wallet } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { purchaseGiftCard, redeemGiftCard } from "@/actions/giftCard";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const GiftCardPage = () => {
    const { user } = useUser();
    const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [message, setMessage] = useState("");
    const [purchasedCode, setPurchasedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [redeemCode, setRedeemCode] = useState("");
    const [redeemStatus, setRedeemStatus] = useState<{ success: boolean; message: string; amount?: number } | null>(null);

    const handlePurchase = async () => {
        const amount = purchaseAmount || Number(customAmount);
        if (!amount || amount <= 0) {
            toast.error("Please select a valid amount");
            return;
        }

        setLoading(true);
        // Simulate fetching user's Sanity ID (In a real app, this would be robust)
        // For now, we pass undefined if not logged in, or handled by backend matching Clerk ID
        const result = await purchaseGiftCard(amount, recipientEmail, message, undefined);

        if (result.success && result.code) {
            setPurchasedCode(result.code);
            toast.success("Gift Card Purchased Successfully!");
        } else {
            toast.error(result.error || "Purchase failed");
        }
        setLoading(false);
    };

    const handleRedeem = async () => {
        if (!redeemCode) return;
        if (!user) {
            toast.error("Please sign in to redeem gift cards");
            return;
        }

        setLoading(true);
        setRedeemStatus(null);

        // Note: In a real implementation, we'd need to securely fetch the Sanity Document ID for the Clerk User
        // Since we don't have a direct hook for that here without exposing it, 
        // we'll assume the backend can find the user via Clerk ID if we pass it, 
        // OR we'd need a utility. For this demo, we'll need to update the action to find user by Clerk ID.
        // I'll update the action next to handle Clerk ID lookup.

        // For now, let's assume the action can handle it.
        // Actually, I need to update the server action to lookup by Clerk ID if userId isn't the sanity ID.

        // Placeholder call - likely to fail if I don't update action logic.
        // I will fix the action logic in the next step.
        const result = await redeemGiftCard(redeemCode, "USER_SANITY_ID_PLACEHOLDER", user.id);

        if (result.success) {
            setRedeemStatus({ success: true, message: "Redeemed successfully!", amount: result.amount });
            setRedeemCode("");
        } else {
            setRedeemStatus({ success: false, message: result.error || "Redemption failed" });
        }
        setLoading(false);
    }

    const copyCode = () => {
        if (purchasedCode) {
            navigator.clipboard.writeText(purchasedCode);
            toast.success("Code copied to clipboard!");
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                            <Gift className="w-10 h-10 text-[#febd69]" />
                            EasyCom Gift Cards
                        </h1>
                        <p className="text-lg text-gray-600">The perfect gift for everyone. Purchase instantly or redeem your balance.</p>
                    </div>

                    <Card className="bg-white shadow-xl overflow-hidden border-0 rounded-2xl">
                        <Tabs defaultValue="buy" className="w-full">
                            <div className="bg-gray-100 p-2">
                                <TabsList className="grid w-full grid-cols-2 h-14 bg-white rounded-xl p-1 shadow-sm">
                                    <TabsTrigger value="buy" className="text-lg font-bold data-[state=active]:bg-[#232f3e] data-[state=active]:text-white rounded-lg transition-all">Buy Gift Card</TabsTrigger>
                                    <TabsTrigger value="redeem" className="text-lg font-bold data-[state=active]:bg-[#232f3e] data-[state=active]:text-white rounded-lg transition-all">Redeem Code</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="buy" className="p-8 outline-none">
                                {purchasedCode ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
                                        <p className="text-gray-600 mb-8">Here is your unique gift card code:</p>

                                        <div className="bg-[#232f3e] text-white p-6 rounded-xl shadow-lg max-w-md mx-auto mb-8 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><Gift className="w-32 h-32" /></div>
                                            <p className="text-sm text-gray-400 mb-1">EASYCOM GIFT CARD</p>
                                            <p className="text-3xl font-mono font-bold tracking-widest mb-4">{purchasedCode}</p>
                                            <div className="flex justify-between items-end">
                                                <p className="font-bold text-[#febd69] text-xl">${purchaseAmount || customAmount}</p>
                                                <Button size="sm" variant="secondary" onClick={copyCode} className="gap-2">
                                                    <Copy className="w-4 h-4" /> Copy
                                                </Button>
                                            </div>
                                        </div>

                                        <Button onClick={() => {
                                            setPurchasedCode(null);
                                            setPurchaseAmount(null);
                                            setCustomAmount("");
                                        }} variant="outline">
                                            Purchase Another
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div>
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <Wallet className="w-5 h-5" /> Select Amount
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                {[25, 50, 100].map((amt) => (
                                                    <button
                                                        key={amt}
                                                        onClick={() => { setPurchaseAmount(amt); setCustomAmount(""); }}
                                                        className={`py-4 rounded-xl border-2 font-bold text-xl transition-all ${purchaseAmount === amt
                                                                ? "border-[#febd69] bg-[#febd69]/10 text-[#232f3e]"
                                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                            }`}
                                                    >
                                                        ${amt}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="mb-8">
                                                <Label className="mb-2 block">Custom Amount</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter amount"
                                                        className="pl-8 h-12 text-lg"
                                                        value={customAmount}
                                                        onChange={(e) => {
                                                            setCustomAmount(e.target.value);
                                                            setPurchaseAmount(null);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Recipient Email (Optional)</Label>
                                                    <Input
                                                        type="email"
                                                        placeholder="friend@example.com"
                                                        value={recipientEmail}
                                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Message (Optional)</Label>
                                                    <Input
                                                        placeholder="Happy Birthday!"
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between">
                                            <div className="bg-gradient-to-r from-[#232f3e] to-[#37475a] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden h-64 flex flex-col justify-between transform transition-transform hover:scale-[1.02]">
                                                <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-[#febd69] w-32 h-32 rounded-full opacity-20 blur-2xl"></div>
                                                <div className="flex justify-between items-start z-10">
                                                    <span className="font-bold tracking-widest">EASYCOM</span>
                                                    <CreditCard className="w-8 h-8 opacity-80" />
                                                </div>
                                                <div className="z-10 text-center">
                                                    <Sparkles className="w-12 h-12 mx-auto mb-2 text-[#febd69] opacity-80" />
                                                    <p className="text-3xl font-bold">
                                                        ${purchaseAmount || customAmount || "0"}
                                                    </p>
                                                </div>
                                                <div className="z-10 opacity-60 font-mono text-sm">
                                                    XXXX XXXX XXXX XXXX
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full h-14 text-lg font-bold bg-[#febd69] hover:bg-[#f3a847] text-black mt-8"
                                                disabled={loading || (!purchaseAmount && !customAmount)}
                                                onClick={handlePurchase}
                                            >
                                                {loading ? "Processing..." : "Purchase Gift Card"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="redeem" className="p-8 outline-none">
                                <div className="max-w-md mx-auto text-center">
                                    <h3 className="text-2xl font-bold mb-2">Redeem a Gift Card</h3>
                                    <p className="text-gray-500 mb-8">Enter your code below to add funds to your wallet.</p>

                                    <div className="space-y-4 mb-8">
                                        <Input
                                            className="text-center text-2xl font-mono uppercase tracking-widest h-14 border-2 focus-visible:ring-[#febd69]"
                                            placeholder="GIFT-XXXX-XXXX"
                                            value={redeemCode}
                                            onChange={(e) => setRedeemCode(e.target.value)}
                                            maxLength={24}
                                        />
                                        <Button
                                            className="w-full h-12 font-bold"
                                            size="lg"
                                            onClick={handleRedeem}
                                            disabled={loading || !redeemCode}
                                        >
                                            {loading ? "Verifying..." : "Apply to Balance"}
                                        </Button>
                                    </div>

                                    <AnimatePresence>
                                        {redeemStatus && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-4 rounded-lg flex items-center gap-3 text-left ${redeemStatus.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                                                    }`}
                                            >
                                                {redeemStatus.success ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                                                <div>
                                                    <p className="font-bold">{redeemStatus.message}</p>
                                                    {redeemStatus.amount && (
                                                        <p className="text-sm">New balance available at checkout.</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default GiftCardPage;
