import axios from "axios";
import type { NewNote, Note } from "@/types/note";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.VITE_API_URL ??
  "https://notehub-public.goit.study/api";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? process.env.NEXT_NOTEHUB_TOKEN ?? "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

type FetchNotesArgs = {
  page: number;
  search: string;
  tag?: string;
};

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesArgs): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search,
      ...(tag ? { tag } : {}),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
