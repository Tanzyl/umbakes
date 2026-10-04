import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { categoryPath } from "@/lib/data";
import { ConfirmAction, QuickAction } from "@/components/admin/forms";
import { Badge, PageTitle, Panel, Thumb } from "@/components/admin/ui";
import { deleteCategory, moveCategory, toggleCategory } from "./actions";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const cats = await db.category.findMany({
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    include: { image: true, _count: { select: { products: true } } },
  });
  const groups = [
    { kind: "CAKE", title: "Custom cake categories", note: "Shown under Custom Cakes and in the Special Occasions section." },
    { kind: "MENU", title: "Menu categories", note: "Shown under Menu and in the Explore Our Menu section." },
  ] as const;

  return (
    <>
      <PageTitle
        title="Categories"
        description="Organise cakes and bakes into categories. Use the arrows to change the order customers see."
        action={<Link href="/admin/categories/new" className="btn-primary"><Plus className="size-4" aria-hidden /> New category</Link>}
      />
      <div className="space-y-8">
        {groups.map((g) => {
          const list = cats.filter((c) => c.kind === g.kind);
          return (
            <Panel key={g.kind} title={g.title}>
              <p className="-mt-3 mb-4 text-sm text-muted">{g.note}</p>
              {list.length === 0 ? <p className="text-muted">No categories yet.</p> : (
                <ul className="divide-y divide-line">
                  {list.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                      <Thumb src={c.image ? mediaUrl(c.image.path) : null} />
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/categories/${c.id}`} className="font-medium hover:text-brand">{c.name}</Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span>{categoryPath(c.kind, c.slug)}</span>
                          <span>· {c._count.products} products</span>
                          {!c.isVisible && <Badge tone="amber">Hidden</Badge>}
                          {c.isVisible && !c.showOnHome && <Badge>Not on homepage</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <QuickAction action={moveCategory} hidden={{ id: c.id, dir: "up" }} label="Move up"><ArrowUp className="size-4" /></QuickAction>
                        <QuickAction action={moveCategory} hidden={{ id: c.id, dir: "down" }} label="Move down"><ArrowDown className="size-4" /></QuickAction>
                        <QuickAction action={toggleCategory} hidden={{ id: c.id }} label={c.isVisible ? "Hide" : "Show"}>
                          {c.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </QuickAction>
                        <Link href={`/admin/categories/${c.id}`} aria-label={`Edit ${c.name}`} className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white hover:bg-brand-soft"><Pencil className="size-4" /></Link>
                        <ConfirmAction
                          action={deleteCategory}
                          hidden={{ id: c.id }}
                          title={`Delete “${c.name}”?`}
                          description={c._count.products > 0
                            ? <>This category still has <strong>{c._count.products} product(s)</strong>. Move them to another category or delete them first. Deleting will be refused until then.</>
                            : <>This can&apos;t be undone. Gallery designs in this category will become uncategorised.</>}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" aria-label="Delete" />
                        </ConfirmAction>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>
    </>
  );
}
