import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { db } from "@workspace/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function Works() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: works, isLoading } = useQuery({
    queryKey: ["works"],
    queryFn: async () => {
      const q = query(collection(db, "works"), orderBy("order", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "works", id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["works"] }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Works Portfolio</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Add Work
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-muted-foreground">Order</th>
              <th className="p-4 font-medium text-muted-foreground">Title</th>
              <th className="p-4 font-medium text-muted-foreground">Category</th>
              <th className="p-4 font-medium text-muted-foreground">Visibility</th>
              <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {works?.map((work: any) => (
              <tr key={work.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4">{work.order}</td>
                <td className="p-4 font-medium">{work.title}</td>
                <td className="p-4 capitalize">{work.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${work.isVisible ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {work.isVisible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(work)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this work?")) {
                          deleteMutation.mutate(work.id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!works || works.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No works found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(isAdding || isEditing) && (
        <WorkModal
          work={isEditing}
          onClose={() => {
            setIsAdding(false);
            setIsEditing(null);
          }}
        />
      )}
    </div>
  );
}

function WorkModal({ work, onClose }: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(
    work || {
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      category: "other",
      isVisible: true,
      order: 0,
    }
  );

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, ...saveData } = data;
      if (id) {
        await updateDoc(doc(db, "works", id), { ...saveData, updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, "works"), { ...saveData, createdAt: Date.now(), updatedAt: Date.now() });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">{work ? "Edit Work" : "Add Work"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">External Link (Live Website URL)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2 h-24"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full bg-input border border-border rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 rounded border-border bg-input"
              />
              <label htmlFor="isVisible" className="text-sm font-medium">Is Visible</label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/20">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
