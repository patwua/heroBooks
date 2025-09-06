export const metadata = { title: "Help & FAQ — heroBooks" };

export default function HelpFaqPage() {
  return (
    <section className="container mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>heroBooks Help & FAQ Page (Guyana-Specific)</h1>
      <h2>Overview</h2>
      <p>
        This page serves as a comprehensive help and FAQ resource for <strong>heroBooks</strong>, the Guyana-focused accounting platform. It combines broad help topics for new users with detailed answers to common tax and accounting questions. The page is structured so that general guidance appears first, while frequently asked questions (FAQs) are grouped in a dedicated section near the bottom.
      </p>

      <h2>Help Content</h2>

      <h3>Section 1: Getting Started with heroBooks</h3>
      <ul>
        <li>
          <strong>What is heroBooks?</strong>
          <ul>
            <li>
              heroBooks is an integrated accounting platform designed specifically for individuals and small/medium businesses in Guyana. It provides bookkeeping tools, tax compliance features, and an AI assistant to help manage finances.
            </li>
          </ul>
        </li>
        <li>
          <strong>How do I create an account?</strong>
          <ul>
            <li>
              You’ll need your name, email, and basic business details. Once your account is set up, you can explore features like invoicing, expense tracking, and payroll.
            </li>
          </ul>
        </li>
        <li>
          <strong>Access for multiple users</strong>
          <ul>
            <li>
              Administrators can invite team members and assign permissions. Different roles (e.g., accountant, manager) help control who can view or edit financial information.
            </li>
          </ul>
        </li>
      </ul>

      <h3>Section 2: Navigating the Platform</h3>
      <ul>
        <li>
          <strong>Dashboard Overview</strong>
          <ul>
            <li>
              View key metrics at a glance: profit/loss, cash flow, and upcoming tax obligations. Summaries help you stay on top of finances without digging through reports.
            </li>
          </ul>
        </li>
        <li>
          <strong>Bookkeeping Modules</strong>
          <ul>
            <li>
              <strong>Transactions</strong>: Import bank statements or manually record transactions. The system automatically categorizes common expenses.
            </li>
            <li>
              <strong>Invoicing</strong>: Generate and send invoices directly from heroBooks. The platform tracks payments and overdue invoices.
            </li>
            <li>
              <strong>Payroll</strong>: Calculate salaries, PAYE, and NIS contributions. heroBooks handles statutory deductions automatically.
            </li>
          </ul>
        </li>
        <li>
          <strong>AI Assistant</strong>
          <ul>
            <li>
              Use the AI assistant to generate financial summaries, estimate tax liabilities, and schedule reminders. It can answer questions about Guyana’s tax laws, but always verify complex matters with a tax professional.
            </li>
          </ul>
        </li>
      </ul>

      <h3>Section 3: Tax and Statutory Deductions</h3>
      <ul>
        <li>
          <strong>Personal Income Tax (PAYE)</strong>
          <ul>
            <li>
              For 2025 and onward, the first G$3.12 million of chargeable income is taxed at 25%, while the remainder is taxed at 35%. <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a> The tax-free threshold is G$130,000 per month. <a href="https://dpi.gov.gy/income-tax-threshold-increased-to-130000/">Source</a>
            </li>
            <li>
              There is a standard deduction of G$1.56 million or one-third of chargeable income (whichever is larger). <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a> Eligible parents may claim G$120,000 per child per year, up to G$10,000 per month. <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a>
            </li>
          </ul>
        </li>
        <li>
          <strong>NIS Contributions</strong>
          <ul>
            <li>
              Employees contribute 5.6% of their salary and employers contribute 8.4%, with a monthly cap of G$280,000. <a href="https://www.nis.org.gy/information_on_contributions#:~:text=Both%20the%20Employer%20and%20Employee,week%20for%20National%20Insurance%20purposes">Source</a> Self-employed persons contribute 12.5%. <a href="https://www.nis.org.gy/information_on_contributions#:~:text=Both%20the%20Employer%20and%20Employee,week%20for%20National%20Insurance%20purposes">Source</a>
            </li>
          </ul>
        </li>
        <li>
          <strong>VAT and Other Taxes</strong>
          <ul>
            <li>
              VAT is charged at 14% on most goods and services. <a href="https://www.bizlatinhub.com/understanding-company-accounting-and-taxation-requirements-in-guyana/#:~:text=The%20current%20rates%20of%20corporate,tax%20are%20as%20follows">Source</a> Businesses with annual turnover over G$15 million must register.
            </li>
            <li>
              Property tax is progressive: 0% on the first G$40 million of net property, 0.5% on the next G$20 million, and 0.75% on the remainder. <a href="https://www.gra.gov.gy/tax-services/property-tax/rates-and-calculation/">Source</a>
            </li>
            <li>
              Capital gains tax of 20% applies on gains from the sale of assets, unless exempt under specific conditions. <a href="https://www.gra.gov.gy/capital-gains-tax-2/">Source</a>
            </li>
          </ul>
        </li>
        <li>
          <strong>Corporate Tax</strong>
          <ul>
            <li>
              The corporate tax rate is 25% for non-commercial businesses and 40% for commercial companies. <a href="https://www.bdo.gy/getattachment/1d8dfc48-8c12-4dd2-909e-a49e19392cf4/BDO-Guyana-Budget-Bulletin-2025.pdf#:~:text=Increase%20in%20income%20tax%20threshold,Act%20GUYANA%20BUDGET%20BULLETIN%202025">Source</a> Certain industries like telecommunication have higher rates.
            </li>
            <li>
              Withholding tax is generally 20% for payments to non-residents, with some exceptions. <a href="https://www.bizlatinhub.com/understanding-company-accounting-and-taxation-requirements-in-guyana/#:~:text=The%20current%20rates%20of%20corporate,tax%20are%20as%20follows">Source</a>
            </li>
          </ul>
        </li>
        <li>
          <strong>Chart of Accounts Guidance</strong>
          <ul>
            <li>A chart of accounts (CoA) helps organize your financial data. Four main categories: Assets, Liabilities, Income, and Expenses.</li>
            <li>
              Use consistent account numbering: assets (1000 series), liabilities (2000 series), equity (3000 series), income (4000 series), and expenses (5000–6000 series). <a href="https://www.freshbooks.com/blog/customizing-chart-of-accounts-example#:~:text=,li">Source</a>
            </li>
            <li>
              Create sub-accounts only when necessary; keep the structure simple. <a href="https://www.freshbooks.com/blog/customizing-chart-of-accounts-example">Source</a>
            </li>
          </ul>
        </li>
      </ul>

      <h3>Section 4: Using the AI Assistant</h3>
      <ul>
        <li>
          <strong>Automated Reminders and Chatbots</strong>
          <ul>
            <li>
              The AI can send reminders for document submissions and payment deadlines. Chatbots answer routine questions and free up time for more complex tasks.
            </li>
          </ul>
        </li>
        <li>
          <strong>Document Management</strong>
          <ul>
            <li>
              AI-driven secure portals allow clients to upload documents. OCR and data extraction tools pull relevant details from tax forms and bank statements.
            </li>
          </ul>
        </li>
        <li>
          <strong>Tax Planning and Forecasting</strong>
          <ul>
            <li>
              AI can analyze your financial data and suggest deductions or flag inconsistencies. It may also forecast future tax liabilities and identify potential savings.
            </li>
          </ul>
        </li>
      </ul>

      <h2>Frequently Asked Questions (FAQs)</h2>

      <h3>PAYE and NIS</h3>
      <ol>
        <li>
          <strong>When do I start paying PAYE in 2025?</strong>
          <p>
            From January 1, 2025, the first G$3.12 million of your annual income is taxed at 25%, and any income above that is taxed at 35%. <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a>
          </p>
        </li>
        <li>
          <strong>What deductions can I claim against my income?</strong>
          <p>
            The personal deduction is the greater of G$1.56 million or one-third of your chargeable income. <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a> You may also claim a child allowance of up to G$120,000 per child per year (up to G$10,000 per month). <a href="https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2025-copy/">Source</a>
          </p>
        </li>
        <li>
          <strong>How does heroBooks handle NIS contributions?</strong>
          <p>
            For employees, heroBooks automatically deducts 5.6% of salary and calculates the 8.4% employer portion. Both are capped when monthly income exceeds G$280,000. <a href="https://www.nis.org.gy/information_on_contributions#:~:text=Both%20the%20Employer%20and%20Employee,week%20for%20National%20Insurance%20purposes">Source</a>
          </p>
        </li>
      </ol>

      <h3>VAT, Property Tax, and Other Taxes</h3>
      <ol start={4}>
        <li>
          <strong>Do I need to register for VAT?</strong>
          <p>
            Yes, if your annual turnover exceeds G$15 million. heroBooks can calculate VAT on your sales and purchases and prepare your monthly return. <a href="https://www.bizlatinhub.com/understanding-company-accounting-and-taxation-requirements-in-guyana/#:~:text=The%20current%20rates%20of%20corporate,tax%20are%20as%20follows">Source</a>
          </p>
        </li>
        <li>
          <strong>How does property tax work?</strong>
          <p>
            Property tax is levied on your net property (total assets minus liabilities). No tax is due on the first G$40 million; 0.5% is charged on the next G$20 million; and 0.75% on any excess. <a href="https://www.gra.gov.gy/tax-services/property-tax/rates-and-calculation/">Source</a>
          </p>
        </li>
        <li>
          <strong>Do I owe capital gains tax on selling a house?</strong>
          <p>
            Yes, gains from the sale of capital assets are taxed at 20%, unless you held the property for more than 25 years or the gain is below G$500,000. <a href="https://www.gra.gov.gy/capital-gains-tax-2/">Source</a>
          </p>
        </li>
      </ol>

      <h3>Corporate & Business Questions</h3>
      <ol start={7}>
        <li>
          <strong>What corporate tax rates apply?</strong>
          <p>
            Non-commercial companies are taxed at 25%, while commercial companies pay 40%. <a href="https://www.bdo.gy/getattachment/1d8dfc48-8c12-4dd2-909e-a49e19392cf4/BDO-Guyana-Budget-Bulletin-2025.pdf#:~:text=Increase%20in%20income%20tax%20threshold,Act%20GUYANA%20BUDGET%20BULLETIN%202025">Source</a> Telephone companies pay a higher rate.
          </p>
        </li>
        <li>
          <strong>What is withholding tax on payments to foreign contractors?</strong>
          <p>
            In most cases, it’s 20%. <a href="https://www.bizlatinhub.com/understanding-company-accounting-and-taxation-requirements-in-guyana/#:~:text=The%20current%20rates%20of%20corporate,tax%20are%20as%20follows">Source</a> Some contracts may qualify for a lower rate; consult a professional for specifics.
          </p>
        </li>
      </ol>

      <h3>Using heroBooks Features</h3>
      <ol start={9}>
        <li>
          <strong>Can I customize my chart of accounts?</strong>
          <p>
            Yes. heroBooks starts with a default CoA but allows you to add or rename accounts. Keep your account hierarchy simple and use standard numbering. <a href="https://www.freshbooks.com/blog/customizing-chart-of-accounts-example">Source</a>
          </p>
        </li>
        <li>
          <strong>How does the AI assistant ensure my data stays accurate?</strong>
          <p>
            The AI extracts data from your documents and cross-checks for inconsistencies. However, we recommend reviewing all suggestions, as AI predictions should be validated by a human.
          </p>
        </li>
        <li>
          <strong>Is my data secure?</strong>
          <p>
            heroBooks uses encryption and role-based access controls. Never share sensitive personal information (e.g., bank account numbers) directly with the AI chatbot. <a href="https://futurefirm.co/accounting-ai-chatbot/#:~:text=Most%20chatbots%20are%20powered%20by,input%20to%20train%20future%20responses">Source</a>
          </p>
        </li>
        <li>
          <strong>Can the AI replace my accountant?</strong>
          <p>
            The AI is a helpful tool for routine tasks and preliminary analysis. However, a qualified accountant or tax professional should review complex scenarios and ensure full compliance with laws.
          </p>
        </li>
      </ol>

      <p>
        <em>Last updated: 5 September 2025</em>
      </p>
    </section>
  );
}

