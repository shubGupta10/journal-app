import { currentUser } from "@/lib/auth/currentUser";
import { getDashboardData } from "@/actions/user/getDashboardData";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;

  const data = await getDashboardData(user.id);

  return <DashboardClient user={user} data={data} />;
}
