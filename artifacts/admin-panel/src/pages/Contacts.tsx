import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@workspace/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";

export default function Contacts() {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateDoc(doc(db, "contacts", id), { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground mt-2">Manage inquiries from the Contact Us form.</p>
      </div>

      <div className="grid gap-4">
        {contacts?.map((contact: any) => (
          <div key={contact.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{contact.name}</h3>
                <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
                <select
                  value={contact.status}
                  onChange={(e) => updateStatusMutation.mutate({ id: contact.id, status: e.target.value })}
                  className="bg-input border border-border text-sm rounded-md px-3 py-1"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        ))}
        {(!contacts || contacts.length === 0) && (
          <div className="text-center p-12 bg-card border border-border rounded-lg text-muted-foreground">
            No contact submissions yet.
          </div>
        )}
      </div>
    </div>
  );
}
