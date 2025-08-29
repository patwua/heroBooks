import { revalidatePath } from "next/cache";

interface Organization {
  id: number;
  name: string;
}

let organizations: Organization[] = [];

async function listOrganizations(): Promise<Organization[]> {
  "use server";
  return organizations;
}

async function createOrganization(formData: FormData): Promise<void> {
  "use server";
  const name = formData.get("name")?.toString() || "";
  organizations.push({ id: Date.now(), name });
  revalidatePath("/app/settings");
}

export default async function SettingsPage() {
  const allOrgs = await listOrganizations();
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Organizations</h1>
      <form action={createOrganization} className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
        />
        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Add Organization
        </button>
      </form>
      <ul>
        {allOrgs.map((org) => (
          <li key={org.id}>{org.name}</li>
        ))}
      </ul>
    </div>
  );
}
