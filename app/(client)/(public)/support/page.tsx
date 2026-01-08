import { redirect } from "next/navigation";

export default function SupportPage() {
    // Redirect to help page which already has customer service content
    redirect("/help");
}
