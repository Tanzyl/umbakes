import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="font-script text-4xl text-accent-ink">Oh, crumbs!</p>
      <h1 className="text-5xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted">That page may have moved, or the design is no longer listed.</p>
      <Link href="/" className="btn-primary mt-4">Back to home</Link>
    </main>
  );
}
