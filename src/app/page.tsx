import Link from "next/link";

export default function Home() {
  return (
   <section className="flex justify-evenly h-screen items-center bg-gray-500">
      <h1 className="text-2xl">Replicate</h1>
      <Link href={'/integrations'}>Tntegrations</Link>
   </section>
  );
}
