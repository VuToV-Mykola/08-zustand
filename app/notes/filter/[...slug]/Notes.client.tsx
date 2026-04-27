"use client";

import { useState, type MouseEventHandler } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

type Props = {
  tag: string | null;
};

export default function NotesClient({ tag }: Props) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey: readonly unknown[] = ["notes", tag ?? "all", debouncedValue, currentPage];

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
    setCurrentPage(1);
  }, 1000);

  const { data, isSuccess } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        search: debouncedValue,
        tag: tag ?? undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleCreateClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={debouncedSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={handleCreateClick} type="button">
          Create note +
        </button>
      </div>

      {isSuccess && data && <NoteList notes={data.notes} queryKey={queryKey} />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm handleCancelNote={handleCloseModal} queryKey={queryKey} />
        </Modal>
      )}
    </div>
  );
}
