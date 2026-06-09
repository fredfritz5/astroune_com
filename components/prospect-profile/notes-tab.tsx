"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/app/actions/modules";
import { formatDateTime, getInitials } from "@/lib/utils";
import { Plus, StickyNote } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const NOTE_CATEGORIES = [
  "General", "Strategy", "Relationship", "Technical", "Financial", "Follow-Up", "Internal", "Other",
];

export function NotesTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createNote(formData);
        toast.success("Note saved");
        setShowForm(false);
        (e.currentTarget as HTMLFormElement).reset();
        router.refresh();
      } catch { toast.error("Failed to save note"); }
    });
  }

  const filteredNotes = searchQuery
    ? prospect.notes.filter((n) =>
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : prospect.notes;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Notes ({prospect.notes.length})</h4>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Note
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <input type="text" name="title" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Note title..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select name="category" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select category...</option>
                {NOTE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Note <span className="text-red-500">*</span></label>
            <textarea name="content" required rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Write your note here…" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save Note</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </form>
      )}

      {prospect.notes.length > 3 && (
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes…"
          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      )}

      {filteredNotes.length === 0 ? (
        <p className="text-xs text-slate-400 italic">{searchQuery ? "No notes match your search" : "No notes yet"}</p>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <StickyNote className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {note.title && <p className="text-sm font-semibold text-slate-800">{note.title}</p>}
                    {note.category && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{note.category}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    {note.user?.name && (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[9px] font-bold">
                          {getInitials(note.user.name)}
                        </span>
                        {note.user.name}
                      </span>
                    )}
                    <span>{formatDateTime(note.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
