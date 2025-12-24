import { Suspense } from "react";
import { currentUser } from "@/lib/auth/currentUser";
import { getDashboardData } from "@/actions/user/getDashboardData";
import DashboardClient from "./DashboardClient";
import { DashboardSkeleton } from "@/components/app/skeletons/DashboardSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;

  const data = await getDashboardData(user.id);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient user={user} data={data} />
    </Suspense>
  );
}
