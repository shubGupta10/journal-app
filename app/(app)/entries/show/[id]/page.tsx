import { currentUser } from "@/lib/auth/currentUser";
import { getRecentEntryById } from "@/actions/entries/getRecentEntries";
import EntryShowPage from "./EntryShowPage";

export default async function DisplayEntry({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await currentUser();
  if (!user) return null;

  const entry = await getRecentEntryById(id, user.id);
  if (!entry) return null;

  return <EntryShowPage entry={entry} />;
}
