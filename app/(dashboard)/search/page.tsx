import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { getStageColor, getStageLabel, formatDate } from "@/lib/utils";
import { Building2, StickyNote, MessageSquare } from "lucide-react";

async function search(query: string) {
  if (!query || query.length < 2) return { prospects: [], notes: [], activities: [] };

  const [prospects, notes, activities] = await Promise.all([
    prisma.prospect.findMany({
      where: {
        isActive: true,
        OR: [
          { restaurantName: { contains: query, mode: "insensitive" } },
          { contactPerson: { contains: query, mode: "insensitive" } },
          { area: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } },
          { whatsapp: { contains: query } },
        ],
      },
      take: 10,
    }),
    prisma.note.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: "insensitive" } },
          { title: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { prospect: { select: { id: true, restaurantName: true } } },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.activity.findMany({
      where: {
        OR: [
          { notes: { contains: query, mode: "insensitive" } },
          { outcome: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { prospect: { select: { id: true, restaurantName: true } } },
      take: 5,
      orderBy: { date: "desc" },
    }),
  ]);

  return { prospects, notes, activities };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await search(q);
  const totalResults = results.prospects.length + results.notes.length + results.activities.length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Search" subtitle="Search across all your CRM data" />
      <div className="flex-1 p-6 overflow-y-auto">
        {q && (
          <div className="mb-4">
            <p className="text-sm text-slate-500">
              {totalResults} results for "<strong className="text-slate-800">{q}</strong>"
            </p>
          </div>
        )}

        {!q && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">Type a search query in the header to search</p>
          </div>
        )}

        {q && totalResults === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">No results found for "{q}"</p>
          </div>
        )}

        <div className="space-y-6">
          {results.prospects.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Restaurants ({results.prospects.length})
              </h3>
              <div className="space-y-2">
                {results.prospects.map((p) => (
                  <Link key={p.id} href={`/prospects/${p.id}`} className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                      {p.restaurantName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{p.restaurantName}</p>
                      <p className="text-xs text-slate-500">{[p.contactPerson, p.area].filter(Boolean).join(" · ")}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStageColor(p.stage)}`}>
                      {getStageLabel(p.stage)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.notes.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5" /> Notes ({results.notes.length})
              </h3>
              <div className="space-y-2">
                {results.notes.map((note) => (
                  <Link key={note.id} href={`/prospects/${note.prospect?.id}`} className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <p className="text-xs text-indigo-600 font-medium mb-1">{note.prospect?.restaurantName}</p>
                    {note.title && <p className="text-sm font-semibold text-slate-800 mb-0.5">{note.title}</p>}
                    <p className="text-sm text-slate-600 line-clamp-2">{note.content}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(note.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.activities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Activities ({results.activities.length})
              </h3>
              <div className="space-y-2">
                {results.activities.map((activity) => (
                  <Link key={activity.id} href={`/prospects/${activity.prospect?.id}`} className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <p className="text-xs text-indigo-600 font-medium mb-1">{activity.prospect?.restaurantName}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{activity.notes}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(activity.date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
