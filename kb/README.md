# heroBooks Knowledge Base

This knowledge base contains accounting guides and best practices tailored to Guyana and the wider Caribbean/CXC context. It powers the heroBooks Assistance sidebar and AI help system.

## Structure

- `taxonomy.json` defines the top-level and sub-level categories for the knowledge base.
- `articles/` contains Markdown files for each article with front-matter metadata and body content.
- `kb_assist_index.json` aggregates question-answer pairs (`kb_snippets`) and intent keys for the assistance system.
- `search_index.json` indexes article metadata and snippet answers to facilitate KB search and suggestion.
- `right_rail.yaml` holds quick links to official resources (NIS, GRA), selected popular snippets, and subtle internal promotions. All external links open in a new tab.
- `brand_options.md` proposes five slogan options for branding the knowledge base with a short rationale for each.

## Maintenance

- **Review cycle**: Articles should be reviewed at least annually, or sooner if tax rates and laws change. When changes occur, update the `last_reviewed` date in the front matter and refresh the relevant sections.
- **Citation policy**: All statements of fact must be backed by a citation from a reputable source. Add citations in the `sources` array with title, URL, publisher, and date accessed.
- **Adding articles**: Follow the existing schema in the front matter. Ensure the `id` is unique and the `category_id` corresponds to an entry in `taxonomy.json`.
- **Updating indices**: When articles change or new ones are added, regenerate `kb_assist_index.json` and `search_index.json` accordingly.

## Sources

Primary sources used in this initial knowledge base include the Guyana Revenue Authority (GRA) for tax and compliance guidance, the National Insurance Scheme (NIS) for contribution rates, the Caribbean Examinations Council (CXC) for Principles of Accounts syllabus context, and the IFRS Foundation for standards applicable to SMEs. These sources are cited within individual articles' metadata.
