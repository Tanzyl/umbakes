import { readFile } from "node:fs/promises";
import { resolveUploadPath } from "@/lib/media";

// Serves runtime uploads from UPLOAD_DIR. Files added to public/ after a build aren't served by
// `next start`, and UPLOAD_DIR may live outside the project, so uploads go through this handler.
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path } = await ctx.params;
  const full = resolveUploadPath(path.join("/"));
  if (!full || !full.endsWith(".webp")) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(full);
    return new Response(data, {
      headers: {
        "Content-Type": "image/webp",
        // Filenames are random and never reused, so they can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
