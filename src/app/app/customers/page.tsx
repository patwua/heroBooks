import { revalidatePath } from "next/cache";

interface Customer {
  id: number;
  name: string;
  email: string;
}

let customers: Customer[] = [];

async function listCustomers(): Promise<Customer[]> {
  "use server";
  return customers;
}

async function createCustomer(formData: FormData): Promise<void> {
  "use server";
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  customers.push({ id: Date.now(), name, email });
  revalidatePath("/app/customers");
}

export default async function CustomersPage() {
  const allCustomers = await listCustomers();
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Customers</h1>
      <form action={createCustomer} className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2"
        />
        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Add Customer
        </button>
      </form>
      <ul>
        {allCustomers.map((customer) => (
          <li key={customer.id}>
            {customer.name} ({customer.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
