import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@workspace/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { Search, Download, RefreshCw, Mail, Phone, MessageCircle, ExternalLink, Trash2, Rocket } from "lucide-react";
import clsx from "clsx";

const COLLECTION = "venture_applications";

type FirestoreDate = { toDate: () => Date } | string | number | null | undefined;

type Application = {
  id: string;
  ref?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  link?: string;
  profile?: string;
  pitch?: string;
  problem?: string;
  audience?: string;
  stage?: string;
  needs?: string[];
  commitment?: string;
  why?: string;
  revshare?: string;
  status?: string;
  track?: string;
  notes?: string;
  source?: string;
  createdAt?: FirestoreDate;
};

const STATUSES = [
  { value: "new", label: "New", cls: "bg-lime-300/15 text-lime-300 border-lime-300/30" },
  { value: "reviewing", label: "Reviewing", cls: "bg-sky-400/15 text-sky-300 border-sky-400/30" },
  { value: "shortlisted", label: "Shortlisted", cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" },
  { value: "accepted", label: "Accepted", cls: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30" },
  { value: "rejected", label: "Rejected", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
] as const;

const statusMeta = (s?: string) => STATUSES.find((x) => x.value === s) ?? STATUSES[0];

function toDate(v: FirestoreDate): Date | null {
  if (!v) return null;
  if (typeof v === "object" && "toDate" in v) return v.toDate();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function fmtDate(v: FirestoreDate, withTime = false) {
  const d = toDate(v);
  if (!d) return "—";
  return d.toLocaleString("en-IN", withTime
    ? { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }
    : { day: "numeric", month: "short" });
}

function exportCsv(rows: Application[]) {
  const cols: (keyof Application)[] = ["ref", "createdAt", "status", "track", "name", "email", "phone", "city", "link", "profile", "pitch", "problem", "audience", "stage", "needs", "commitment", "why", "revshare", "notes"];
  const cell = (v: unknown) => {
    const s = Array.isArray(v) ? v.join("; ") : v && typeof v === "object" && "toDate" in v ? toDate(v as FirestoreDate)?.toISOString() ?? "" : String(v ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `forge-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Ventures() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: apps = [], isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [COLLECTION],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Application);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [COLLECTION] });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteDoc(doc(db, COLLECTION, id)),
    onSuccess: () => { setSelectedId(null); invalidate(); },
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    for (const a of apps) c[a.status ?? "new"] = (c[a.status ?? "new"] ?? 0) + 1;
    return c;
  }, [apps]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (filter !== "all" && (a.status ?? "new") !== filter) return false;
      if (!q) return true;
      return [a.name, a.email, a.phone, a.pitch, a.ref, a.city].some((v) => v?.toLowerCase().includes(q));
    });
  }, [apps, filter, search]);

  // keep a valid selection
  useEffect(() => {
    if (!visible.length) { setSelectedId(null); return; }
    if (!selectedId || !visible.some((a) => a.id === selectedId)) setSelectedId(visible[0].id);
  }, [visible, selectedId]);

  const selected = apps.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Venture Applications</h1>
            <span className="text-xs font-bold tracking-wider px-2 py-1 rounded bg-lime-300 text-zinc-900 -skew-x-6">FORGE</span>
          </div>
          <p className="text-muted-foreground mt-2">Submissions from the FORGE venture-building program survey.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-secondary/50 transition-colors">
            <RefreshCw size={16} className={clsx(isFetching && "animate-spin")} /> Refresh
          </button>
          <button onClick={() => exportCsv(visible)} disabled={!visible.length} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 p-1 bg-card border border-border rounded-lg">
          {[{ value: "all", label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={clsx("px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2",
                filter === s.value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {s.label}
              <span className={clsx("text-xs tabular-nums px-1.5 rounded", filter === s.value ? "bg-background" : "bg-secondary")}>{counts[s.value] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, pitch, ref…"
            className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:border-ring"
          />
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-card border border-destructive rounded-lg text-sm">
          Could not load applications: {(error as Error).message}. Make sure the latest <code>firestore.rules</code> are deployed and you are signed in as an admin.
        </div>
      ) : isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : !apps.length ? (
        <div className="text-center p-16 bg-card border border-border rounded-lg text-muted-foreground">
          <Rocket className="mx-auto mb-3 opacity-60" />
          No applications yet. They will appear here as founders submit the survey.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,380px)_1fr] items-start">
          {/* List */}
          <div className="bg-card border border-border rounded-lg overflow-hidden lg:sticky lg:top-0 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
            {visible.map((a) => {
              const m = statusMeta(a.status);
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={clsx("w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors border-l-2",
                    a.id === selectedId ? "bg-secondary/70 border-l-lime-300" : "border-l-transparent hover:bg-secondary/30")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold truncate">{a.name || "Unnamed"}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{fmtDate(a.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{a.pitch || "—"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={clsx("text-[11px] px-2 py-0.5 rounded-full border", m.cls)}>{m.label}</span>
                    <TrackBadge track={a.track} />
                    {a.stage && <span className="text-[11px] text-muted-foreground truncate">{a.stage}</span>}
                  </div>
                </button>
              );
            })}
            {!visible.length && <div className="p-6 text-sm text-muted-foreground text-center">No matches.</div>}
          </div>

          {/* Detail */}
          {selected && (
            <Detail
              key={selected.id}
              app={selected}
              saving={updateMutation.isPending}
              onStatus={(status) => updateMutation.mutate({ id: selected.id, data: { status } })}
              onNotes={(notes) => updateMutation.mutate({ id: selected.id, data: { notes } })}
              onDelete={() => {
                if (confirm(`Delete the application from ${selected.name || "this founder"}? This cannot be undone.`)) deleteMutation.mutate(selected.id);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ app, saving, onStatus, onNotes, onDelete }: {
  app: Application;
  saving: boolean;
  onStatus: (s: string) => void;
  onNotes: (n: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const digits = (app.phone ?? "").replace(/\D/g, "");
  const wa = digits ? `https://wa.me/${digits.length === 10 ? "91" + digits : digits}` : null;
  const notesDirty = notes !== (app.notes ?? "");

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">{app.ref || app.id} · {fmtDate(app.createdAt, true)}</p>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl font-bold tracking-tight">{app.name || "Unnamed"}</h2>
            <TrackBadge track={app.track} />
          </div>
          {app.track === "quick" && (
            <p className="text-xs text-amber-300/90 mt-2">Quick pitch — only name, contact and the idea were collected. Follow up for problem, stage and commitment.</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">{[app.profile, app.city].filter(Boolean).join(" · ")}</p>
        </div>
        <select
          value={app.status ?? "new"}
          onChange={(e) => onStatus(e.target.value)}
          disabled={saving}
          className="bg-input border border-border text-sm rounded-md px-3 py-2"
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="px-6 py-4 border-b border-border flex flex-wrap gap-2">
        {app.email && <ActionLink href={`mailto:${app.email}?subject=${encodeURIComponent("Your FORGE application")}`} icon={Mail} label={app.email} />}
        {app.phone && <ActionLink href={`tel:${app.phone}`} icon={Phone} label={app.phone} />}
        {wa && <ActionLink href={wa} icon={MessageCircle} label="WhatsApp" external />}
        {app.link && <ActionLink href={app.link} icon={ExternalLink} label="Link" external />}
      </div>

      <div className="p-6 space-y-6">
        <div>
          <Label>Pitch</Label>
          <p className="text-lg font-semibold leading-snug">{app.pitch || "—"}</p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Fact k="Stage" v={app.stage} />
          <Fact k="Weekly time" v={app.commitment} />
          <Fact k="Revenue share" v={app.revshare} />
          <Fact k="Target users" v={app.audience} />
        </div>

        {!!app.needs?.length && (
          <div>
            <Label>Needs built</Label>
            <div className="flex flex-wrap gap-2">
              {app.needs.map((n) => <span key={n} className="text-xs px-2.5 py-1 rounded-full bg-secondary">{n}</span>)}
            </div>
          </div>
        )}

        <Block title="Problem it solves" text={app.problem} />
        <Block title="Why them, why now" text={app.why} />

        <div>
          <Label>Internal notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Only visible to the Roxten team…"
            className="w-full bg-input border border-border rounded-md p-3 text-sm outline-none focus:border-ring resize-y"
          />
          <div className="flex items-center justify-between mt-2">
            <button onClick={onDelete} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 size={15} /> Delete application
            </button>
            <button
              onClick={() => onNotes(notes)}
              disabled={!notesDirty || saving}
              className="px-4 py-2 text-sm rounded-md bg-lime-300 text-zinc-900 font-semibold disabled:opacity-30 transition-opacity"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackBadge({ track }: { track?: string }) {
  const quick = track === "quick";
  return (
    <span className={clsx("text-[11px] px-2 py-0.5 rounded-full border shrink-0",
      quick ? "border-amber-400/40 text-amber-300" : "border-border text-muted-foreground")}>
      {quick ? "Quick pitch" : "Full"}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{children}</p>;
}

function Fact({ k, v }: { k: string; v?: string }) {
  return (
    <div className="bg-secondary/50 rounded-md p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="text-sm font-medium mt-1 break-words">{v || "—"}</p>
    </div>
  );
}

function Block({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div>
      <Label>{title}</Label>
      <div className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap leading-relaxed">{text}</div>
    </div>
  );
}

function ActionLink({ href, icon: Icon, label, external }: { href: string; icon: typeof Mail; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-secondary/50 transition-colors max-w-full"
    >
      <Icon size={15} className="shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}
