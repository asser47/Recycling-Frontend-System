# Bootstrap HTML Component Examples

## 1. LANDING PAGE - Hero Section (Bootstrap-Based)

```html
<!-- Hero Section with Grid Layout -->
<section class="py-5 py-lg-8 px-4 px-lg-5">
  <div class="container">
    <div class="row align-items-center">
      <!-- Left Content -->
      <div class="col-12 col-lg-6 mb-4 mb-lg-0">
        <div class="hero-content">
          <h1 class="display-3 fw-bold mb-3">
            {{ t('heroTitle') }}
          </h1>
          <p class="fs-5 text-secondary mb-4">
            {{ t('heroSubtitle') }}
          </p>
          
          <!-- Button Group -->
          <div class="d-flex flex-column flex-sm-row gap-3">
            <a routerLink="/register" class="btn btn-primary btn-lg">
              <span>{{ t('getStarted') }}</span>
            </a>
            <a routerLink="#features" class="btn btn-outline btn-lg">
              <span>{{ t('learnMore') }}</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Right Visual -->
      <div class="col-12 col-lg-6">
        <div class="d-flex align-items-center justify-content-center">
          <div class="rounded-4 shadow-lg bg-primary-light p-5">
            <div class="fs-1 text-primary text-center opacity-50">♻</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## 2. FEATURES SECTION (Bootstrap Grid)

```html
<!-- Features Section -->
<section id="features" class="py-5 py-lg-8 px-4 px-lg-5 bg-light">
  <div class="container">
    <!-- Section Header -->
    <div class="text-center mb-5">
      <h2 class="display-4 fw-bold mb-2">Why Choose EcoCollect?</h2>
      <p class="fs-5 text-secondary">Join our community of environmental enthusiasts</p>
    </div>
    
    <!-- Feature Cards Grid -->
    <div class="row g-4">
      @for (feature of features; track $index) {
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body p-4">
              <!-- Icon Container -->
              <div class="bg-primary-light rounded-3 p-3 mb-3 d-inline-block">
                <span class="fs-3 text-primary">{{ getIconEmoji(feature.icon) }}</span>
              </div>
              
              <!-- Content -->
              <h3 class="h5 fw-bold mb-2">{{ feature.title }}</h3>
              <p class="text-secondary small">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
</section>
```

## 3. STATS CARDS DASHBOARD (Bootstrap Grid)

```html
<!-- Stats Cards Section -->
<div class="row g-4 mb-5">
  @for (stat of stats; track stat.id) {
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="card border-0 shadow-sm overflow-hidden">
        <!-- Color Bar Top -->
        <div class="border-top-primary"></div>
        
        <div class="card-body p-4">
          <!-- Icon & Label -->
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="card-title mb-0 text-muted">{{ stat.label }}</h5>
            <span class="fs-4 text-primary">{{ stat.icon }}</span>
          </div>
          
          <!-- Value -->
          <h2 class="fw-bold mb-2">{{ stat.value }}</h2>
          
          <!-- Trend -->
          <small class="text-success" *ngIf="stat.trend > 0">
            📈 +{{ stat.trend }}% from last month
          </small>
        </div>
      </div>
    </div>
  }
</div>
```

## 4. FORM LAYOUT (Bootstrap Forms)

```html
<!-- Responsive Form -->
<div class="container">
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-5">
          <h2 class="h4 fw-bold mb-4">{{ t('createRequest') }}</h2>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Form Group 1 -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Material Type</label>
              <select class="form-select form-control" formControlName="material">
                <option value="">Select material...</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
              </select>
            </div>
            
            <!-- Form Group 2 -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Quantity</label>
              <input type="number" class="form-control" formControlName="quantity" 
                     placeholder="Enter quantity">
            </div>
            
            <!-- Form Group 3 -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Description</label>
              <textarea class="form-control" formControlName="description" 
                        rows="4" placeholder="Describe the materials..."></textarea>
            </div>
            
            <!-- Button Group -->
            <div class="d-flex gap-3">
              <button type="submit" class="btn btn-primary flex-grow-1">
                Submit Request
              </button>
              <button type="button" class="btn btn-secondary" (click)="onCancel()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 5. DATA TABLE (Bootstrap Table)

```html
<!-- Responsive Table -->
<div class="table-responsive">
  <table class="table table-hover mb-0">
    <thead class="table-light">
      <tr>
        <th scope="col" class="fw-semibold text-primary">Request ID</th>
        <th scope="col" class="fw-semibold text-primary">Material</th>
        <th scope="col" class="fw-semibold text-primary">Quantity</th>
        <th scope="col" class="fw-semibold text-primary">Status</th>
        <th scope="col" class="fw-semibold text-primary">Date</th>
        <th scope="col" class="fw-semibold text-primary">Actions</th>
      </tr>
    </thead>
    <tbody>
      @for (request of requests; track request.id) {
        <tr>
          <td class="fw-semibold">{{ request.id }}</td>
          <td>{{ request.material }}</td>
          <td>{{ request.quantity }} kg</td>
          <td>
            <span [class]="'badge badge-' + getStatusClass(request.status)">
              {{ request.status }}
            </span>
          </td>
          <td>{{ request.date | date: 'short' }}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline" (click)="onEdit(request)">
                Edit
              </button>
              <button class="btn btn-sm btn-danger" (click)="onDelete(request)">
                Delete
              </button>
            </div>
          </td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

## 6. NAVBAR (Bootstrap Navbar)

```html
<!-- Navbar with Hamburger Menu -->
<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
  <div class="container-fluid px-3 px-lg-5">
    <!-- Logo -->
    <a [routerLink]="['/']" class="navbar-brand fw-bold text-primary">
      <span class="fs-4">🌿 EcoCollect</span>
    </a>
    
    <!-- Hamburger Toggle -->
    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" aria-controls="navbarNav" 
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <!-- Navigation Links -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <div class="navbar-nav ms-auto gap-2">
        @if (isLoggedIn() && !isAuthRoute()) {
          <a [routerLink]="[getDashboardRoute()]" routerLinkActive="active" 
             class="nav-link fw-semibold">
            📊 Dashboard
          </a>
          <a [routerLink]="['/my-requests']" routerLinkActive="active" 
             class="nav-link fw-semibold">
            📋 My Requests
          </a>
          <a [routerLink]="['/rewards']" routerLinkActive="active" 
             class="nav-link fw-semibold">
            🎁 Rewards
            @if (userPoints()) {
              <span class="badge bg-success ms-2">{{ userPoints() }}</span>
            }
          </a>
        }
      </div>
      
      <!-- User Menu -->
      <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-3 border-top border-lg-0 pt-3 pt-lg-0">
        @if (isLoggedIn()) {
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" 
                    data-bs-toggle="dropdown" aria-expanded="false">
              👤 Profile
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" [routerLink]="['/profile']">My Profile</a></li>
              <li><a class="dropdown-item" [routerLink]="['/settings']">Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" (click)="onLogout()">Logout</a></li>
            </ul>
          </div>
        } @else {
          <a [routerLink]="['/login']" class="btn btn-outline btn-sm">Login</a>
          <a [routerLink]="['/register']" class="btn btn-primary btn-sm">Sign Up</a>
        }
      </div>
    </div>
  </div>
</nav>
```

## 7. MODAL/DIALOG (Bootstrap Modal)

```html
<!-- Modal -->
<div class="modal fade" id="collectionModal" tabindex="-1" [class.show]="isModalOpen" 
     [style.display]="isModalOpen ? 'block' : 'none'" role="dialog">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <!-- Header -->
      <div class="modal-header bg-light border-bottom">
        <h5 class="modal-title fw-bold">Create Collection Request</h5>
        <button type="button" class="btn-close" (click)="onCloseModal()"></button>
      </div>
      
      <!-- Body -->
      <div class="modal-body p-4">
        <form [formGroup]="form">
          <div class="mb-3">
            <label class="form-label fw-semibold">Material Type</label>
            <select class="form-select" formControlName="material">
              <option value="">Select material...</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="form-label fw-semibold">Quantity (kg)</label>
            <input type="number" class="form-control" formControlName="quantity">
          </div>
          
          <div class="mb-3">
            <label class="form-label fw-semibold">Location</label>
            <input type="text" class="form-control" formControlName="location">
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer border-top bg-light">
        <button type="button" class="btn btn-secondary" (click)="onCloseModal()">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" (click)="onSubmit()">
          Create Request
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Backdrop -->
@if (isModalOpen) {
  <div class="modal-backdrop fade show"></div>
}
```

## 8. RESPONSIVE ALERT MESSAGE

```html
<!-- Alert Messages -->
<div class="alert-container">
  @for (alert of alerts; track alert.id) {
    <div [class]="'alert alert-' + alert.type + ' alert-dismissible fade show mb-3'"
         role="alert">
      <strong>{{ alert.title }}:</strong> {{ alert.message }}
      <button type="button" class="btn-close" (click)="closeAlert(alert.id)"></button>
    </div>
  }
</div>

<!-- Alert Types Available -->
<!-- Success Alert -->
<div class="alert alert-success border-start border-success border-3" role="alert">
  ✓ <strong>Success!</strong> Your request has been created successfully.
</div>

<!-- Error Alert -->
<div class="alert alert-danger border-start border-danger border-3" role="alert">
  ✗ <strong>Error!</strong> Something went wrong. Please try again.
</div>

<!-- Warning Alert -->
<div class="alert alert-warning border-start border-warning border-3" role="alert">
  ⚠ <strong>Warning!</strong> Please review your information before submitting.
</div>

<!-- Info Alert -->
<div class="alert alert-info border-start border-info border-3" role="alert">
  ℹ <strong>Info:</strong> Your profile has been updated.
</div>
```

## 9. PAGINATION (Bootstrap Pagination)

```html
<!-- Pagination -->
<nav aria-label="Page navigation">
  <ul class="pagination justify-content-center">
    <li class="page-item" [class.disabled]="currentPage === 1">
      <a class="page-link" (click)="goToPage(currentPage - 1)">Previous</a>
    </li>
    
    @for (page of pages; track page) {
      <li class="page-item" [class.active]="currentPage === page">
        <a class="page-link cursor-pointer" (click)="goToPage(page)">{{ page }}</a>
      </li>
    }
    
    <li class="page-item" [class.disabled]="currentPage === totalPages">
      <a class="page-link cursor-pointer" (click)="goToPage(currentPage + 1)">Next</a>
    </li>
  </ul>
</nav>
```

## 10. RESPONSIVE CARD GRID

```html
<!-- Responsive Card Grid -->
<div class="row g-4">
  @for (item of items; track item.id) {
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card h-100 border-0 shadow-sm hover-lift">
        <!-- Image -->
        <img [src]="item.image" class="card-img-top" alt="{{ item.title }}">
        
        <div class="card-body p-4">
          <!-- Title -->
          <h5 class="card-title fw-bold mb-2">{{ item.title }}</h5>
          
          <!-- Description -->
          <p class="card-text text-secondary small mb-3">{{ item.description }}</p>
          
          <!-- Footer with Badge -->
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary">{{ item.category }}</span>
            <small class="text-muted">{{ item.date | date: 'short' }}</small>
          </div>
        </div>
        
        <!-- Card Footer -->
        <div class="card-footer bg-light border-top-0 p-3">
          <a [routerLink]="['/details', item.id]" class="btn btn-sm btn-primary w-100">
            View Details
          </a>
        </div>
      </div>
    </div>
  }
</div>
```

---

## Key Bootstrap Classes Reference

### Grid & Layout
- `.container` - Fixed-width container
- `.container-fluid` - Full-width container
- `.row` - Creates a row (flex container)
- `.col-*` - Column sizing (col-12, col-md-6, col-lg-4)
- `.g-4` - Gap between columns

### Spacing
- `.p-3` - Padding on all sides
- `.px-4` - Padding left & right
- `.py-3` - Padding top & bottom
- `.m-2` - Margin on all sides
- `.mb-4` - Margin bottom
- `.mt-3` - Margin top

### Flex
- `.d-flex` - Display flex
- `.flex-column` - Flex direction column
- `.align-items-center` - Vertical center
- `.justify-content-center` - Horizontal center
- `.justify-content-between` - Space between
- `.gap-3` - Gap between flex items

### Typography
- `.display-3` - Large heading
- `.h4` - Medium heading
- `.fw-bold` - Font weight bold
- `.text-secondary` - Secondary text color
- `.text-center` - Center text
- `.fs-5` - Font size 5

### Components
- `.card` - Card component
- `.btn` `.btn-primary` - Button
- `.badge` - Badge
- `.alert` - Alert message
- `.table` - Table
- `.navbar` - Navigation bar
- `.modal` - Modal dialog

### Responsive
- `.d-none` - Hide element
- `.d-md-block` - Block on medium screens and up
- `.col-lg-4` - 4 columns on large screens
- `.mx-auto` - Center horizontally

