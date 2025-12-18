import { currentUser } from "@/lib/auth/currentUser";
import { getALLEntries } from "@/actions/entries/getRecentEntries";
import { getALLEntriesByUserId } from "@/actions/entries/getEntries";
import EntriesClient from "./EntriesClient";


export default async function EntriesPage() {
  const user = await currentUser();
  if (!user) return null;

  const entries = await getALLEntriesByUserId(user.id);

  return <EntriesClient initialEntries={entries} />;
}
