import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

function normalizeTag(tagParam?: string[]) {
  const raw = tagParam?.[0];
  if (!raw || raw === "all") return null;
  return raw;
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const normalizedTag = normalizeTag(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", normalizedTag ?? "all", "", 1],
    queryFn: () => fetchNotes({ page: 1, search: "", tag: normalizedTag ?? undefined }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={normalizedTag} />
    </HydrationBoundary>
  );
}
