import { revalidatePath } from "next/cache";

async function createVendor(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name) return;
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vendors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  revalidatePath("/vendors");
}

export default async function VendorsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vendors`, {
    cache: "no-store"
  });
  const vendors = await res.json();
  return (
    <div>
      <h1 className="text-xl mb-4">Vendors</h1>
      <form action={createVendor} className="flex space-x-2 mb-4">
        <input name="name" placeholder="Name" className="border p-1" />
        <button type="submit" className="bg-blue-500 text-white px-2">Add</button>
      </form>
      <ul className="list-disc pl-5">
        {vendors.map((v: any) => (
          <li key={v.id}>{v.name}</li>
        ))}
      </ul>
    </div>
  );
}
