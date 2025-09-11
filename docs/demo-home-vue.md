Demo: Knowledge Base Home (Vue)

This demo component reads `kb/home_layout.json` and `kb/rates/tax_rates.json` to render hero, search, quick chips, featured, templates, and a simple rates widget. In production, you can swap in richer widgets (e.g., `RatesWidget`) and preload tips for glossary tooltips.

Component
```vue
<template>
  <div v-if="layout" class="mx-auto max-w-5xl px-4 py-6 space-y-8">
    <!-- Hero -->
    <section class="rounded-2xl border bg-card p-6 text-card-foreground">
      <h1 class="text-2xl sm:text-3xl font-bold">{{ layout.hero?.title }}</h1>
      <p class="mt-1 text-muted-foreground">{{ layout.hero?.subtitle }}</p>
      <div class="mt-4">
        <input
          v-model="query"
          :placeholder="layout.hero?.search_placeholder || 'Search'"
          class="w-full rounded-xl border bg-background px-4 py-3"
          aria-label="Search the knowledge base"
        />
        <!-- Bind to your search using kb/search_index.json if desired -->
      </div>
    </section>

    <!-- Quick chips -->
    <section v-if="layout.quick_chips?.length" class="rounded-2xl border bg-card p-6">
      <div class="mb-2 font-semibold">Quick chips</div>
      <div class="flex flex-wrap gap-2">
        <a v-for="c in layout.quick_chips" :key="c.slug" :href="`/kb/${c.slug}`" class="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-muted/50">{{ c.label }}</a>
      </div>
    </section>

    <!-- Featured articles -->
    <section v-if="layout.featured_articles?.length" class="rounded-2xl border bg-card p-6">
      <div class="mb-2 font-semibold">Featured articles</div>
      <div class="grid gap-3 sm:grid-cols-2">
        <a v-for="slug in layout.featured_articles" :key="slug" :href="`/kb/${slug}`" class="rounded-xl border p-4 hover:bg-muted/40">
          <div class="font-medium">{{ slug }}</div>
          <div class="text-sm text-muted-foreground">Open article</div>
        </a>
      </div>
    </section>

    <!-- Templates -->
    <section v-if="layout.featured_templates?.length" class="rounded-2xl border bg-card p-6">
      <div class="mb-2 font-semibold">Templates</div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a v-for="t in layout.featured_templates" :key="t.path" :href="t.path" class="rounded-xl border p-4 hover:bg-muted/40">
          <div class="font-medium">{{ t.label }}</div>
          <div class="text-sm text-muted-foreground">Download</div>
        </a>
      </div>
    </section>

    <!-- Rates (basic demo). In prod, swap for richer RatesWidget -->
    <section v-if="layout?.widgets?.show_rates && countries.length && sel" class="rounded-2xl border bg-card p-6">
      <div class="mb-2 font-semibold">VAT/GCT/GST standard rates</div>
      <div class="flex items-center gap-3">
        <label for="demo-rates" class="text-sm text-muted-foreground">Country</label>
        <select id="demo-rates" v-model="code" class="rounded-md border bg-background px-2 py-1 text-sm">
          <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
        </select>
      </div>
      <div class="mt-3 rounded-xl border p-4">
        <div class="text-sm text-muted-foreground">{{ sel.tax_name }}</div>
        <div class="mt-1 text-lg font-semibold">Standard rate: {{ sel.standard_rate == null ? '—' : `${sel.standard_rate}%` }}</div>
        <a v-if="sel.verify_url" :href="sel.verify_url" target="_blank" rel="noreferrer" class="mt-2 inline-flex text-primary hover:underline">Verify at authority</a>
        <div class="mt-1 text-xs text-muted-foreground">Rates change — verify before use.</div>
      </div>
    </section>
  </div>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const layout = ref(null)
const countries = ref([])
const code = ref('GY')
const query = ref('')

onMounted(async () => {
  try {
    const res1 = await fetch('/kb/home_layout.json')
    layout.value = await res1.json()
  } catch {}
  try {
    const res2 = await fetch('/kb/rates/tax_rates.json')
    const d = await res2.json()
    countries.value = d.countries || []
  } catch {}
})

const sel = computed(() => countries.value.find(c => c.code === code.value) || countries.value[0])
</script>
```

Notes
- Rate map: already wired for a widget; expand `kb/rates/tax_rates.json` by adding more `code`, `name`, `tax_name`, `standard_rate`, and `verify_url` entries.
- Landing/home: `kb/home_layout.json` controls hero, chips, featured, templates, and the show/hide flags for rates/tips sections.
- Production swap: plug in your production `RatesWidget` and optionally preload `tips_source` to enable glossary tooltips on article pages.

