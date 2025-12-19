import { currentUser } from "@/lib/auth/currentUser";
import { getALLEntries } from "@/actions/entries/getRecentEntries";
import { getALLEntriesByUserId } from "@/actions/entries/getEntries";
import EntriesClient from "./EntriesClient";

type EntriesPageProps = {
  searchParams: Promise<{ 
    sort?: string
    mood?: string
    tag?: string
  }>;
};

export default async function EntriesPage({searchParams}: EntriesPageProps) {
  const user = await currentUser();
  if (!user) return null;
  const { sort = "newest", mood, tag } = await searchParams;

  const entries = await getALLEntriesByUserId(
    user.id, 
    sort as "newest" | "oldest" | "title",
    { mood, tag }
  );

  return <EntriesClient initialEntries={entries} />;
}
