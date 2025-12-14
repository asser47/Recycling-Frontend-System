# TAILWIND → BOOTSTRAP QUICK REFERENCE

## Responsive Grid System

### Tailwind → Bootstrap
```
Tailwind                    Bootstrap
md:grid-cols-2             col-12 col-md-6
lg:grid-cols-3             col-12 col-lg-4
sm:grid-cols-2 lg:grid-cols-3   col-12 col-sm-6 col-lg-4
md:grid-cols-4             col-12 col-md-6 col-lg-3
```

### Example Usage
```html
<!-- Tailwind -->
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item</div>
</div>

<!-- Bootstrap -->
<div class="row g-4">
  <div class="col-12 col-md-6 col-lg-4">Item</div>
</div>
```

---

## Spacing & Padding

### Tailwind → Bootstrap
```
Tailwind        Bootstrap
p-4            p-3
px-4           px-3
py-6           py-4
mb-8           mb-5
mt-4           mt-3
gap-4          gap-3
space-y-4      mb-3 on children

min-h-screen   min-vh-100
```

### Quick Reference Table
| Tailwind | Bootstrap | Value |
|----------|-----------|-------|
| p-1 | p-1 | 0.5rem (8px) |
| p-2 | p-2 | 1rem (16px) |
| p-3 | p-3 | 1.5rem (24px) |
| p-4 | p-4 | 2rem (32px) |
| p-6 | p-5 | 2.5rem (40px) |
| p-8 | p-5 | 3rem+ (custom) |

---

## Flexbox Utilities

### Tailwind → Bootstrap
```
Tailwind                    Bootstrap
flex                       d-flex
flex-col                   flex-column
flex-row                   flex-row (or d-flex default)
justify-center             justify-content-center
justify-between            justify-content-between
align-center               align-items-center
items-start                align-items-start
items-end                  align-items-end
gap-4                      gap-3
```

### Complete Flex Example
```html
<!-- Tailwind -->
<div class="flex flex-col gap-4 justify-center align-items-center">
  <button>Click me</button>
</div>

<!-- Bootstrap -->
<div class="d-flex flex-column gap-3 justify-content-center align-items-center">
  <button class="btn btn-primary">Click me</button>
</div>
```

---

## Typography

### Tailwind → Bootstrap
```
Tailwind                    Bootstrap
text-lg                    fs-5
text-xl                    fs-4
text-2xl                   fs-3
text-3xl                   fs-2
text-4xl                   fs-1
font-bold                  fw-bold
font-semibold              fw-semibold
font-normal                fw-normal
text-center                text-center
text-gray-500              text-muted
text-primary-600           text-primary
```

### Text Example
```html
<!-- Tailwind -->
<h2 class="text-3xl font-bold text-gray-900">
  Title
</h2>

<!-- Bootstrap -->
<h2 class="fs-2 fw-bold text-dark">
  Title
</h2>
```

---

## Colors

### Tailwind → Bootstrap
```
Tailwind            Bootstrap
bg-blue-500        bg-primary
bg-red-500         bg-danger
bg-green-500       bg-success
bg-yellow-500      bg-warning
bg-gray-100        bg-light
bg-white           bg-white
text-blue-500      text-primary
text-gray-600      text-muted
border-blue-500    border-primary
```

### Color Example
```html
<!-- Tailwind -->
<div class="bg-blue-100 text-blue-900 border-2 border-blue-500 rounded-lg">
  Content
</div>

<!-- Bootstrap -->
<div class="bg-primary-light text-primary-dark border border-2 border-primary rounded-3">
  Content
</div>
```

---

## Border Radius

### Tailwind → Bootstrap
```
Tailwind        Bootstrap
rounded         rounded-2
rounded-lg      rounded-3
rounded-xl      rounded-4
rounded-2xl     rounded-4 (or custom)
rounded-full    rounded-pill
```

---

## Shadows

### Tailwind → Bootstrap
```
Tailwind        Bootstrap
shadow-sm       shadow-sm
shadow          shadow-md
shadow-lg       shadow-lg
shadow-xl       shadow-xl
```

---

## Display & Visibility

### Tailwind → Bootstrap
```
Tailwind            Bootstrap
block               d-block
inline-block        d-inline-block
flex                d-flex
hidden              d-none
invisible           invisible
md:hidden           d-md-none
lg:block            d-lg-block
```

### Responsive Display Example
```html
<!-- Tailwind -->
<nav class="hidden md:flex lg:flex">
  Links
</nav>

<!-- Bootstrap -->
<nav class="d-none d-md-flex d-lg-flex">
  Links
</nav>
```

---

## Buttons

### Tailwind → Bootstrap
```
Tailwind                    Bootstrap
bg-blue-500 text-white     btn btn-primary
bg-gray-200 text-gray-900  btn btn-secondary
border-2 border-blue-500   btn btn-outline
px-4 py-2                  btn (has default padding)
```

### Button Example
```html
<!-- Tailwind -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
  Click me
</button>

<!-- Bootstrap -->
<button class="btn btn-primary">
  Click me
</button>
```

---

## Forms

### Tailwind → Bootstrap
```
Tailwind                    Bootstrap
border-2 border-gray-300   form-control
px-4 py-2                  form-control (has default padding)
rounded-lg                 form-control (has default radius)
focus:outline-none         form-control (has default focus styling)
focus:border-blue-500      form-control (has default focus styling)
```

### Form Example
```html
<!-- Tailwind -->
<input type="text" class="border-2 border-gray-300 px-3 py-2 rounded-lg 
  focus:outline-none focus:border-blue-500">

<!-- Bootstrap -->
<input type="text" class="form-control">
```

---

## Cards & Containers

### Tailwind → Bootstrap
```
Tailwind                        Bootstrap
border rounded-lg shadow        card
bg-white p-6                    card-body
border-t-4 border-blue-500     border-top-primary
```

### Card Example
```html
<!-- Tailwind -->
<div class="bg-white border border-gray-300 rounded-lg shadow p-6">
  <h3 class="text-lg font-bold mb-2">Title</h3>
  <p class="text-gray-600">Content</p>
</div>

<!-- Bootstrap -->
<div class="card">
  <div class="card-body">
    <h3 class="card-title fw-bold">Title</h3>
    <p class="card-text text-muted">Content</p>
  </div>
</div>
```

---

## Width & Height

### Tailwind → Bootstrap
```
Tailwind        Bootstrap
w-full          w-100
h-full          h-100
w-1/2           col-6 (in grid) or w-50
w-1/3           col-4 (in grid) or custom class
max-w-2xl       max-w-100 + custom class
```

---

## Position & Layout

### Tailwind → Bootstrap
```
Tailwind            Bootstrap
relative            position-relative
absolute            position-absolute
fixed               position-fixed
sticky              position-sticky
top-0 left-0        position positioning classes
z-10                z-10
```

---

## Common Patterns

### Hero Section
```html
<!-- Tailwind -->
<section class="min-h-screen py-20 px-4">
  <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    <div class="space-y-6">
      <h1 class="text-4xl md:text-5xl font-bold">Title</h1>
      <p class="text-lg text-gray-600">Subtitle</p>
    </div>
    <div class="flex items-center justify-center">
      <img src="image.jpg" alt="">
    </div>
  </div>
</section>

<!-- Bootstrap -->
<section class="py-5 py-lg-8 px-4 px-lg-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-12 col-lg-6 mb-4 mb-lg-0">
        <h1 class="display-4 fw-bold mb-3">Title</h1>
        <p class="fs-5 text-secondary mb-4">Subtitle</p>
      </div>
      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center">
        <img src="image.jpg" alt="" class="img-fluid">
      </div>
    </div>
  </div>
</section>
```

### Feature Grid
```html
<!-- Tailwind -->
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  @for (item of items) {
    <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
      <h3 class="text-lg font-bold">{{ item.title }}</h3>
      <p class="text-gray-600">{{ item.desc }}</p>
    </div>
  }
</div>

<!-- Bootstrap -->
<div class="row g-4">
  @for (item of items) {
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm hover-lift">
        <div class="card-body">
          <h3 class="card-title fw-bold">{{ item.title }}</h3>
          <p class="card-text text-muted">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  }
</div>
```

### Navigation/Buttons
```html
<!-- Tailwind -->
<div class="flex gap-4">
  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Primary
  </button>
  <button class="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded">
    Secondary
  </button>
</div>

<!-- Bootstrap -->
<div class="d-flex gap-3">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-outline">Secondary</button>
</div>
```

### Form Layout
```html
<!-- Tailwind -->
<form class="space-y-4">
  <div>
    <label class="block text-sm font-semibold mb-2">Email</label>
    <input type="email" class="w-full border border-gray-300 rounded-lg p-2">
  </div>
  <div>
    <label class="block text-sm font-semibold mb-2">Message</label>
    <textarea class="w-full border border-gray-300 rounded-lg p-2"></textarea>
  </div>
  <button class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
</form>

<!-- Bootstrap -->
<form>
  <div class="mb-3">
    <label class="form-label fw-semibold">Email</label>
    <input type="email" class="form-control">
  </div>
  <div class="mb-3">
    <label class="form-label fw-semibold">Message</label>
    <textarea class="form-control" rows="4"></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

---

## Cheat Sheet

### Most Common Replacements
| Tailwind | Bootstrap | Notes |
|----------|-----------|-------|
| flex | d-flex | Display flex |
| gap-4 | gap-3 | Gap between items |
| p-4 | p-3 | Padding |
| mb-4 | mb-3 | Margin bottom |
| rounded-lg | rounded-3 | Border radius |
| shadow-lg | shadow-lg | Box shadow |
| bg-blue-500 | bg-primary | Background color |
| text-gray-600 | text-muted | Text color |
| md:col-6 | col-md-6 | Responsive column |
| hidden md:block | d-none d-md-block | Responsive display |

---

## Testing Checklist After Migration

- [ ] All layouts display correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Colors consistent
- [ ] Spacing looks uniform
- [ ] Buttons have hover effects
- [ ] Forms have focus states
- [ ] Cards have proper depth
- [ ] No layout shifts
- [ ] Images scale properly
- [ ] Navigation responsive
- [ ] No console errors
- [ ] Performance acceptable

