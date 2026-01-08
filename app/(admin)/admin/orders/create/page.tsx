import CreateOrderForm from "@/components/admin/orders/CreateOrderForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateOrderPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    // In a real app, strict role checking would happen here
    // For now relying on layout protection

    return (
        <div className="container mx-auto px-4 max-w-5xl">
            <CreateOrderForm />
        </div>
    );
}
