import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@workspace/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";

export default function Projects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateDoc(doc(db, "projects", id), { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Requests</h1>
        <p className="text-muted-foreground mt-2">Manage inquiries from the Start a Project form.</p>
      </div>

      <div className="grid gap-4">
        {projects?.map((project: any) => (
          <div key={project.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{project.name}</h3>
                <a href={`mailto:${project.email}`} className="text-sm text-primary hover:underline">
                  {project.email}
                </a>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Budget: {project.budget}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={project.status}
                    onChange={(e) => updateStatusMutation.mutate({ id: project.id, status: e.target.value })}
                    className="bg-input border border-border text-sm rounded-md px-3 py-1"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap">
              {project.details}
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && (
          <div className="text-center p-12 bg-card border border-border rounded-lg text-muted-foreground">
            No project requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
