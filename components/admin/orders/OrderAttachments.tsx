"use client";

import { useState } from "react";
import { uploadOrderAttachment } from "@/actions/admin/upload-attachment";
import { deleteOrderAttachment } from "@/actions/admin/delete-attachment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Paperclip, X, Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Attachment {
    _type: "file";
    asset: {
        _ref: string;
        _type: "reference";
    };
    description?: string;
    category?: string;
    _key: string;
}

interface OrderAttachmentsProps {
    orderId: string;
    attachments?: Attachment[];
    onUpdate: () => void;
}

export default function OrderAttachments({
    orderId,
    attachments = [],
    onUpdate,
}: OrderAttachmentsProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("other");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("file", file);
        formData.append("description", description);
        formData.append("category", category);

        const result = await uploadOrderAttachment(formData);

        if (result.success) {
            toast.success("File uploaded successfully");
            setFile(null);
            setDescription("");
            setCategory("other");
            setIsFormOpen(false);
            onUpdate();
        } else {
            toast.error(result.error || "Failed to upload file");
        }
        setIsUploading(false);
    };

    const handleDelete = async (assetRef: string) => {
        if (!confirm("Are you sure you want to delete this attachment?")) return;

        const result = await deleteOrderAttachment(orderId, assetRef);
        if (result.success) {
            toast.success("Attachment deleted");
            onUpdate();
        } else {
            toast.error(result.error || "Failed to delete attachment");
        }
    };

    // Helper to get download URL (Sanity specific construction or just a placeholder if we don't have the project ID handy in client)
    // For now, we will just show the asset ref or a generic view button if possible. 
    // In a real Sanity app, we'd use useNextSanityImage or similar helper to construct the URL.
    // Actually, standard Sanity URL format: https://cdn.sanity.io/files/<projectId>/<dataset>/<assetName>.<ext>
    // Parsing asset ref: file-beef...-pdf -> beef... .pdf
    const getFileUrl = (assetRef: string) => {
        const parts = assetRef.split('-');
        // parts[0] is 'file' or 'image'
        // parts[1] is the asset ID
        // parts[2] is the extension
        if (parts.length < 3) return "#";
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
        return `https://cdn.sanity.io/files/${projectId}/${dataset}/${parts[1]}.${parts[2]}`;
    };

    return (
        <div className="space-y-4">
            {/* List existing attachments */}
            <div className="space-y-2">
                {attachments.map((att) => (
                    <div
                        key={att._key}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{att.description || "No description"}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded capitalize">{att.category || "other"}</span>
                                    {/* If we had uploadedAt, we'd show it here. For now just extension maybe? */}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild title="Download">
                                <a href={`${getFileUrl(att.asset._ref)}?dl=`} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4 text-blue-600" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(att.asset._ref)}
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}

                {attachments.length === 0 && !isFormOpen && (
                    <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed rounded-lg">No attachments yet</p>
                )}
            </div>

            {/* Upload Form Trigger */}
            {!isFormOpen ? (
                <Button
                    onClick={() => setIsFormOpen(true)}
                    variant="outline"
                    className="w-full border-dashed"
                >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Add Attachment
                </Button>
            ) : (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Upload File</h4>
                        <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)} className="h-6 w-6 p-0">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="category" className="text-xs">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="invoice">Invoice</SelectItem>
                                    <SelectItem value="receipt">Receipt</SelectItem>
                                    <SelectItem value="proof_of_delivery">Proof of Delivery</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description" className="text-xs">Description</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Signed Invoice"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="file" className="text-xs">File</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="bg-white"
                            />
                        </div>

                        <Button type="submit" disabled={!file || isUploading} className="w-full">
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : "Upload"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
