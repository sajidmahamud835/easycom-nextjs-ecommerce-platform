"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, Tag, AlertCircle, CheckCircle } from "lucide-react";
import { createTicket } from "@/actions/createTicket";
import { motion, AnimatePresence } from "motion/react";

interface TicketFormProps {
    className?: string;
}

const TicketForm = ({ className }: TicketFormProps) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError("");
        setSuccess(false);

        const result = await createTicket(formData);

        if (result.success && result.ticketId) {
            setSuccess(true);
            setTicketId(result.ticketId);
        } else {
            setError(result.error || "Failed to create ticket");
        }
        setLoading(false);
    };

    if (success && ticketId) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-green-100 text-center"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-shop_dark_green mb-2">
                    Ticket Created!
                </h3>
                <p className="text-gray-600 mb-6">
                    Your support ticket has been successfully submitted.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 inline-block">
                    <span className="text-sm text-gray-500 block mb-1">Ticket ID</span>
                    <span className="text-xl font-mono font-bold text-shop_dark_blue tracking-wider">
                        {ticketId}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Please save this ID to track your request status. We've also sent a confirmation to your email.
                </p>
                <Button
                    onClick={() => {
                        setSuccess(false);
                        setTicketId(null);
                    }}
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    Submit Another Ticket
                </Button>
            </motion.div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 ${className}`}>
            <h2 className="text-2xl font-bold text-shop_dark_green mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6" />
                Submit a Support Ticket
            </h2>

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-shop_dark_green font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            required
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-shop_dark_green font-medium">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-shop_dark_green font-medium">
                            Priority
                        </Label>
                        <Select name="priority" defaultValue="medium">
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low - General Question</SelectItem>
                                <SelectItem value="medium">Medium - Order Issue</SelectItem>
                                <SelectItem value="high">High - Urgent Problem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-shop_dark_green font-medium">
                            Subject *
                        </Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Brief summary of issue"
                            required
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-shop_dark_green font-medium">
                        Message *
                    </Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your issue in detail..."
                        required
                        className="min-h-[150px] resize-y"
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-shop_dark_green hover:bg-shop_light_green text-white h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Ticket...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Ticket
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default TicketForm;
