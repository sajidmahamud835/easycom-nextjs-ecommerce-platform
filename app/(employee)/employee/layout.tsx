import { PaidFeatureMessage } from "@/components/employee/PaidFeatureMessage";

// Employee features are under development (coming soon)
// Anyone can access this route to see the upgrade message

export const dynamic = "force-dynamic";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Show paid feature message instead of actual employee dashboard
  return <PaidFeatureMessage />;
}
