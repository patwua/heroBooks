// Marketing copy for heroBooks About page (can be iterated later)
const aboutCopy = {
  hero: {
    title: "About heroBooks",
    subtitle: "Simple, local-first accounting—built in Guyana, ready for the Caribbean.",
  },
  mission: {
    tag: "Our Mission",
    headline: "Make bookkeeping effortless for local businesses",
    body:
      "We’re building modern accounting that understands VAT, PAYE, NIS, and the realities of running a small business in Guyana—with an eye toward the broader Caribbean.",
    bullets: [
      "VAT-ready invoicing and clean, local reports",
      "Double-entry ledger without the drama",
      "APIs and integrations that don’t fight you",
    ],
    ctas: [
      { label: "Get Started", href: "/#pricing", type: "primary" },
      { label: "Talk to Sales", href: "/contact?subject=sales", type: "secondary" },
    ],
  },
  whoWeAre: {
    title: "Who We Are",
    paragraphs: [
      "heroBooks is a small, hands-on team of accountants, engineers, and operators from the region.",
      "We’re obsessed with clarity, compliance, and speed—so you can spend less time on books and more time on the business.",
    ],
  },
  values: {
    title: "Our Values",
    subtitle: "Clarity. Local expertise. Reliability.",
    items: [
      { t: "Clarity", d: "Interfaces that make sense—and reports you can actually use." },
      { t: "Local Expertise", d: "Built for Guyana’s VAT, PAYE, NIS, and statutory filings, and adaptable for the wider Caribbean." },
      { t: "Reliability", d: "Your books shouldn’t break. Neither should our promises." },
    ],
  },
  leadershipHighlights: {
    tag: "Leadership",
    title: "The team guiding our product and customers",
    subtitle: "Experienced operators who care about local businesses.",
    people: [
      {
        name: "A. Founder",
        title: "CEO",
        photo: "/leadership/founder.webp",
        bio: "Sets product direction and keeps us focused on real customer outcomes.",
      },
      {
        name: "B. Engineer",
        title: "CTO",
        photo: "/leadership/cto.webp",
        bio: "Builds our platform for speed, reliability, and security.",
      },
      {
        name: "C. Finance",
        title: "Head of Finance & Ops",
        photo: "/leadership/finance.webp",
        bio: "Brings deep accounting discipline to every feature and report.",
      },
    ],
    cta: "Meet the team",
  },
  standards: {
    title: "How we ship",
    intro: "We iterate quickly but hold the line on accuracy and security.",
    bullets: [
      { label: "Data Security", text: "Least-privilege access, encrypted in transit and at rest." },
      { label: "Accuracy", text: "Double-entry core with rigorous tests." },
      { label: "Support", text: "Humans in the loop—real help when you need it." },
    ],
    factCheck: {
      title: "Change Management",
      steps: [
        "Specs & acceptance criteria scoped with customers",
        "Peer review & automated tests",
        "Staged rollout and monitoring",
        "Docs & in-product guidance",
      ],
    },
    corrections: {
      title: "If we miss, we fix",
      text: "Bugs happen—we’ll acknowledge, fix, and document material issues.",
      linkText: "Report an issue",
    },
  },
  reachUs: {
    title: "Reach the right team",
    desc: "Sales questions, support needs, or partnership ideas? We’ve got you.",
    contacts: [
      { label: "Talk to Sales", token: "sales", desc: "Licensing, pricing, or demos." },
      { label: "Get Support", token: "support", desc: "Product usage or account help." },
      { label: "Partnerships", token: "partnerships", desc: "Banks, POS vendors, integrators." },
      { label: "Press", token: "press", desc: "Media & speaking." },
      { label: "Careers", token: "careers", desc: "Join the team." },
      { label: "General", token: "general", desc: "Anything else." },
    ],
    note: "We respect your privacy and local laws.",
  },
};

export type AboutCopy = typeof aboutCopy;
export default aboutCopy;

