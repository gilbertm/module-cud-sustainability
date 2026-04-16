# CUD Sustainability — Template Build Guide

## Golden Rule
Use `block-common-content` for normal prose sections. Only use bordered cards/boxes for **special content** (contact cards, image grids, CTA blocks). Never wrap regular text in rounded border cards.

---

## 1. Section Structure

Each content section is a separate `<div class="block-common-content">` with optional `aria-labelledby`:

```twig
<div class="block-common-content" aria-labelledby="heading-section-id">
  <h2 id="heading-section-id" class="...">{{ 'Section Title'|t }}</h2>
  <p class="...">{{ 'Body text here.'|t }}</p>
</div>
```

- One `block-common-content` div per major section (not one giant wrapper)
- No outer card/box styling on these divs — they render as plain content
- All user-facing strings use the `|t` Twig translation filter

---

## 2. Heading Classes

| Level | Class | Use |
|-------|-------|-----|
| h2 | `text-md md:text-xl font-semibold cud-color-blue mb-1` | Main section headings (use `mb-3` if no subtitle follows) |
| h3 | `text-base font-semibold text-slate-800 mt-4 mb-2` | Sub-section headings within a section |

---

## 3. Body Text Classes

| Element | Class |
|---------|-------|
| Paragraphs | `text-slate-700 text-sm leading-relaxed` + spacing (`mb-2`, `mb-3`, `mb-4`) |
| Secondary text | `text-slate-600 text-sm` |
| Small labels | `text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400` |
| Section labels (above link lists) | `text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3` |

---

## 4. Bullet Lists — Icon Style (NOT list-disc)

```twig
<ul class="space-y-2 mb-4">
  <li class="flex gap-2.5 text-sm text-slate-700">
    <i class="fa-solid fa-circle-check mt-0.5 w-4 shrink-0 text-[#b13634]" aria-hidden="true"></i>
    <span><strong>{{ 'Bold Label:'|t }}</strong> {{ 'Description text.'|t }}</span>
  </li>
</ul>
```

- Use `fa-circle-check` for feature/benefit lists
- Use sport-specific icons (`fa-futbol`, `fa-basketball`, etc.) for activity lists
- Icon color: `text-[#b13634]` (CUD red)
- Never use `list-disc pl-5` — always use the icon + flex pattern

---

## 5. Image Placeholders

Full-width banner style (inline in content):
```html
<div class="mb-4 w-full rounded-xl bg-slate-100 aspect-[2.5/1] flex items-center justify-center text-slate-400 text-xs">
  [{{ 'Placeholder Text'|t }}]
</div>
```

---

## 6. "More Links" / "Related Links" Pattern

Used for URL references — styled as interactive list items with hover states:

```twig
<div class="mt-2">
  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">{{ 'Related Links'|t }}</p>
  <ul class="flex flex-col gap-2">
    <li>
      <a href="//example.com/path"
         class="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#b13634]/30 hover:bg-[#b13634]/5 hover:text-[#b13634]">
        <span class="flex items-center gap-2.5">
          <i class="fa-solid fa-heart-pulse w-4 text-center text-slate-400 group-hover:text-[#b13634] transition-colors" aria-hidden="true"></i>
          {{ 'Link Display Text'|t }}
        </span>
        <i class="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-[#b13634] transition-all group-hover:translate-x-0.5" aria-hidden="true"></i>
      </a>
    </li>
  </ul>
</div>
```

- Each link gets a contextual left icon (fa-ribbon for cancer, fa-brain for mental health, etc.)
- Right arrow icon animates on hover (`group-hover:translate-x-0.5`)
- Hover: border turns red-tinted, bg gets subtle red wash, text turns CUD red

---

## 7. Contact Card Pattern

Only special content that gets a bordered card — used for contact info (officer, program contact):

```twig
<div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 shadow-sm">
  <div class="flex items-start gap-4">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b13634]/10 text-[#b13634]">
      <i class="fa-solid fa-envelope text-lg" aria-hidden="true"></i>
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">{{ 'Label'|t }}</p>
      <p class="text-sm font-semibold text-slate-900 mb-0">{{ 'Person Name'|t }}</p>
      <div class="mt-2 flex flex-col gap-1.5 text-sm">
        <div class="flex items-center gap-2.5 text-slate-700">
          <i class="fa-solid fa-envelope w-4 text-center text-[#b13634]" aria-hidden="true"></i>
          <a href="mailto:email@cud.ac.ae" class="hover:text-[#b13634] transition-colors underline underline-offset-2">email@cud.ac.ae</a>
        </div>
        <div class="flex items-center gap-2.5 text-slate-700">
          <i class="fa-solid fa-link w-4 text-center text-[#b13634]" aria-hidden="true"></i>
          <a href="https://www.cud.ac.ae/path" class="hover:text-[#b13634] transition-colors underline underline-offset-2">www.cud.ac.ae/path</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 8. CTA Block Pattern

For call-to-action sections (like "Get Involved"):

```html
<div class="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
  <div class="flex items-start gap-3.5">
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#b13634]/10 text-[#b13634]">
      <i class="fa-solid fa-icon-name text-xl" aria-hidden="true"></i>
    </div>
    <div>
      <p class="text-sm font-semibold text-slate-900 mb-1">{{ 'CTA Title'|t }}</p>
      <p class="text-xs text-slate-500 leading-relaxed mb-2">{{ 'Description text.'|t }}</p>
      <a href="mailto:email@cud.ac.ae" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b13634] hover:underline">
        {{ 'Action Text'|t }} <i class="fa-solid fa-arrow-right text-[10px]" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</div>
```

---

## 9. Event/Image Grid Pattern

For displaying image cards in a grid (like Past Events):

```html
<div class="grid gap-6 sm:grid-cols-2">
  <div class="flex flex-col gap-3 rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="w-full aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">[Image Placeholder]</div>
    <h3 class="text-sm font-semibold text-slate-800">Title</h3>
    <p class="text-xs text-slate-500 leading-relaxed">Description</p>
  </div>
</div>
```

---

## 10. What NOT To Do

- **Never** wrap every section in `rounded-2xl border` cards — that's "boxing everything out"
- **Never** use `list-disc pl-5` — always use icon + flex pattern
- **Never** render URLs as plain `<div>` text — use the Related Links pattern
- **Never** put contact info in plain `<p>` tags — use the Contact Card pattern
- **Never** forget `|t` on user-facing strings
- **Never** use a single giant `block-common-content` wrapper — use one per section

---

## 11. Color Reference

| Token | Value | Use |
|-------|-------|-----|
| CUD Red | `#b13634` | Icons, hover accents, CTA elements |
| CUD Blue | `cud-color-blue` (CSS class) | h2 headings |
| Body text | `text-slate-700` | Primary paragraph text |
| Secondary | `text-slate-600` | Less prominent text |
| Muted | `text-slate-400` | Labels, icons at rest |
| Borders | `border-slate-200` | Cards, link rows |

---

## 12. Reference Templates

- **EDI template**: `cud-sustainability--social-responsibility--edi.html.twig` — the canonical reference for all patterns
- **Health & Wellness**: `cud-sustainability--campus--health-wellness.html.twig` — implements all patterns correctly

## 13. Content Source

- Content comes from `.md` files in `contents/Website Content/`
- Preserve ALL text verbatim from the .md source
- Image positions in .md (`![](media/image1.png)`, `[PHOTO PLACEHOLDER]`) indicate where to place image placeholder divs
- URLs in .md become Related Links pattern items
- Contact info in .md becomes Contact Card pattern


## 14. Lazy loading of Image
For displaying lazy loading icon and image:

```html
			<div class="lazy-loading relative w-full">
				<span class="image-loader absolute inset-0 flex items-center justify-center bg-white/60 z-10">
					<i class="fa-solid fa-arrow-rotate-right animate-spin text-green-700 text-3xl" aria-hidden="true"></i>
				</span>
				<img src="//www.cud.ac.ae/sites/default/files/general/2016/health-centre-1920x1080.jpg" alt="{{ 'CUD Health Centre'|t }}" class="w-full h-auto object-cover rounded-lg shadow" loading="lazy" onload="this.previousElementSibling.style.display='none'"/>
			</div>
```
