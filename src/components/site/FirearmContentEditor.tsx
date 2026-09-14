import { useState, useEffect } from "react";
import type { Firearm } from "@/lib/fallbacks";
import { getDb } from "@/lib/firebase";
import { X, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface FirearmContentEditorProps {
  firearm: Firearm;
  isOpen: boolean;
  onClose: () => void;
}

export function FirearmContentEditor({ firearm, isOpen, onClose }: FirearmContentEditorProps) {
  const [name, setName] = useState(firearm.name);
  const [maker, setMaker] = useState(firearm.maker);
  const [model, setModel] = useState(firearm.model);
  const [caliber, setCaliber] = useState(firearm.caliber);
  const [year, setYear] = useState(String(firearm.year ?? ""));
  const [price, setPrice] = useState(String(firearm.price ?? ""));
  const [condition, setCondition] = useState(firearm.condition);
  const [description, setDescription] = useState(firearm.description);
  const [history, setHistory] = useState(firearm.history ?? "");
  const [notes, setNotes] = useState(firearm.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(firearm.name);
    setMaker(firearm.maker);
    setModel(firearm.model);
    setCaliber(firearm.caliber);
    setYear(String(firearm.year ?? ""));
    setPrice(String(firearm.price ?? ""));
    setCondition(firearm.condition);
    setDescription(firearm.description);
    setHistory(firearm.history ?? "");
    setNotes(firearm.notes ?? "");
  }, [firearm]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const [db, fs] = await Promise.all([getDb(), import("firebase/firestore")]);
      const ref = fs.doc(db, "firearms", firearm.id);

      const parsedPrice = price.trim()
        ? isNaN(Number(price.replace(/[^0-9.]/g, "")))
          ? price.trim()
          : Number(price.replace(/[^0-9.]/g, ""))
        : null;

      await fs.updateDoc(ref, {
        name: name.trim(),
        maker: maker.trim(),
        model: model.trim(),
        caliber: caliber.trim(),
        year: year.trim(),
        ...(parsedPrice !== null ? { price: parsedPrice } : {}),
        condition: condition.trim(),
        description: description.trim(),
        history: history.trim(),
        notes: notes.trim(),
        updatedAt: fs.serverTimestamp(),
      });

      toast.success("Archival register updated successfully.");
      onClose();
    } catch (err) {
      console.error("Failed to update firearm in Firebase:", err);
      toast.error("Unable to save changes to Firestore. Check permissions or network.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Editor Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-brass-border bg-[#131518] p-6 sm:p-8 shadow-2xl text-parchment">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brass-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-brass" />
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.24em] uppercase text-brass">
                ARCHIVAL CONTENT MANAGEMENT
              </p>
              <h2 className="mt-0.5 font-serif text-2xl text-ivory">Edit Archival Record</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-parchment-dim hover:text-ivory transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                Firearm Name / Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                Acquisition Price (USD)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1550"
                className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                Maker / Manufacturer
              </label>
              <input
                type="text"
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
                className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                Caliber
              </label>
              <input
                type="text"
                value={caliber}
                onChange={(e) => setCaliber(e.target.value)}
                className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-parchment-dim mb-1">
                Year of Manufacture
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-xs uppercase tracking-wider text-parchment-dim">
                Firearm Information &amp; Description
              </label>
              <span className="text-[0.68rem] text-parchment-dim/70">
                Add, edit, or remove descriptive text
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              placeholder="Descriptive details of configuration, finish, bore condition, or specifications..."
            />
          </div>

          {/* Historical Provenance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-xs uppercase tracking-wider text-brass">
                Historical Provenance Content
              </label>
              <span className="text-[0.68rem] text-parchment-dim/70">
                Documented origin, acquisition records, territory letters
              </span>
            </div>
            <textarea
              rows={4}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none font-serif italic text-sm"
              placeholder="Historical provenance narrative, factory shipping records, ownership lineage..."
            />
          </div>

          {/* Additional Content Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-xs uppercase tracking-wider text-parchment-dim">
                Additional Curatorial Notes / Content
              </label>
              <span className="text-[0.68rem] text-parchment-dim/70">
                Optional lower content area notes
              </span>
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-brass-border bg-obsidian-2 px-3.5 py-2.5 text-xs text-ivory placeholder:text-parchment-dim/50 focus:border-brass focus:outline-none"
              placeholder="Any additional exhibition notes, conservation details, or accession documentation..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end border-t border-brass-border/60 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="border border-brass-border px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-parchment-dim hover:text-ivory cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-brass px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-obsidian hover:bg-brass-light transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save to Firebase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
