Vue snippets: Tips (glossary) and Rates widget

Glossary (tips)
```vue
<template>
  <div class="kb">
    <div class="kb-article" v-html="processed"></div>
    <aside v-if="active" class="kb-tips">
      <header>
        <strong>{{ active.term }}</strong>
        <button @click="active=null">×</button>
      </header>
      <p>{{ active.description }}</p>
      <ul v-if="active.related?.length">
        <li v-for="slug in active.related" :key="slug"><a :href="`/kb/${slug}`">{{ slug }}</a></li>
      </ul>
    </aside>
  </div>
  
  
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const html = defineProps({ html: String }).html || ''
const terms = ref([])
const index = ref(new Map())
const active = ref(null)

onMounted(async () => {
  const res = await fetch('/kb/kb_glossary.json')
  const data = await res.json()
  terms.value = data.terms || []
  const map = new Map()
  for (const t of terms.value) {
    const keys = [t.term, ...(t.aliases||[])]
    keys.forEach(k => map.set(k.toLowerCase(), t))
  }
  index.value = map
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.term')
    if (!el) return
    const k = el.dataset.term.toLowerCase()
    active.value = index.value.get(k) || null
  })
})

const processed = computed(() => {
  if (!html || index.value.size === 0) return html
  let out = html
  for (const key of index.value.keys()) {
    const rx = new RegExp(`\\\b(${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\\b`, 'gi')
    out = out.replace(rx, '<span class="term" data-term="$1">$1</span>')
  }
  return out
})
</script>
```

Rates widget
```vue
<template>
  <div v-if="countries.length" class="rates">
    <select v-model="code">
      <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
    </select>
    <div class="card">
      <div>{{ sel.tax_name }}</div>
      <div>Standard rate: {{ sel.standard_rate ?? '—' }}<span v-if="sel.standard_rate != null">%</span></div>
      <a :href="sel.verify_url" target="_blank">Verify at authority</a>
      <small>Rates change — verify before use.</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const code = ref('GY')
const countries = ref([])
onMounted(async () => {
  const res = await fetch('/kb/rates/tax_rates.json')
  const data = await res.json()
  countries.value = data.countries || []
})
const sel = computed(() => countries.value.find(c => c.code === code.value) || countries.value[0] || {})
</script>
```

