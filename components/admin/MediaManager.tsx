import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Video, Image as ImageIcon, Trash2 } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface MediaManagerProps {
    images: any[];
    videos?: any[];
    onImagesChange: (images: any[]) => void;
    onVideosChange: (videos: any[]) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
    images = [],
    videos = [],
    onImagesChange,
    onVideosChange,
}) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // In a real implementation with Sanity, we would upload these files 
            // via the client and get back references. 
            // For this UI demo, we'll assume the parent component handles the actual upload logic
            // or we just pass the File objects up.
            // Here we'll just simulate adding them to the list for preview if they were pre-signed urls,
            // but since we need Sanity asset references, we will rely on the parent to handle the "upload" action.
            // For now, let's notify the parent that new files are selected.

            // NOTE: This is a simplification. Real Sanity upload requires client.assets.upload
            console.log("Images selected:", files);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    const removeVideo = (index: number) => {
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        onVideosChange(newVideos);
    };

    return (
        <div className="space-y-6">
            {/* Images Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Product Images</Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                    </Button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-0 bg-gray-50 shadow-sm">
                            <Image
                                src={urlFor(img).width(300).height(300).url()}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {/* Placeholder for "Add New" visual */}
                    <div
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-violet-500 hover:text-violet-500 transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Add Image</span>
                    </div>
                </div>
            </div>

            {/* Videos Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Product Videos</Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => videoInputRef.current?.click()}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Upload Video
                    </Button>
                    <input
                        type="file"
                        ref={videoInputRef}
                        className="hidden"
                        accept="video/*"
                        multiple
                    // onChange handler would logically go here
                    />
                </div>

                {videos.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                        <Video className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No videos uploaded yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Video preview logic would go here */}
                        {videos.map((vid, idx) => (
                            <div key={idx} className="relative aspect-video rounded-xl bg-black/10 flex items-center justify-center">
                                <span className="text-xs">Video {idx + 1}</span>
                                <button
                                    onClick={() => removeVideo(idx)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
