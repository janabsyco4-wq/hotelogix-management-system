# Luxury Minimalist Design System - Hotelogix

## 🎨 Design Philosophy
"A luxury hotel lobby turned into software — quiet, elegant, expensive, ultra-minimal."

## Color Palette

### Primary Colors
- **Matte Black**: `#0D0D0D` - Background & primary elements
- **Pure White**: `#FFFFFF` - Content areas & text
- **Light Gray**: `#F5F5F5` - Secondary backgrounds
- **Deep Charcoal**: `#1A1A1A` - Section backgrounds

### Accent Colors
- **Champagne Gold**: `#C9A86A` - Primary accent (luxury touch)
- **Platinum Silver**: `#B0B8C4` - Secondary accent
- **Soft Sand**: `#D6CFC3` - Tertiary accent

### Text Colors
- **Primary Text**: `#0D0D0D` (on light) / `#FFFFFF` (on dark)
- **Secondary Text**: `#666666`
- **Light Text**: `#999999`

### Borders & Dividers
- **Border**: `#E5E5E5`
- **Divider**: `rgba(0, 0, 0, 0.1)`

## Typography

### Font Families
- **Headings**: Playfair Display (serif) - Weights: 300, 400, 500
- **Body**: Inter (sans-serif) - Weights: 300, 400, 500, 600

### Font Sizes & Weights
```css
h1: 56px, weight 300
h2: 42px, weight 400
h3: 32px, weight 400
h4: 24px, weight 400
h5: 20px, weight 500
h6: 16px, weight 500
body: 14-16px, weight 400
```

### Typography Rules
- Use thin (300), regular (400), and medium (500) weights
- Avoid bold unless absolutely necessary
- Letter spacing: -0.02em for headings, 0.3px for body
- Line height: 1.3 for headings, 1.7-1.8 for body

## Layout System

### Grid System
- Based on 8px grid
- Generous white space
- Clean grids with minimal borders

### Spacing Scale
```css
8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 120px
```

### Container
- Max width: 1200px
- Padding: 40px (desktop), 24px (mobile)

## Components

### Buttons
- **Border radius**: 6px
- **Padding**: 14px 32px
- **Font size**: 12-13px
- **Font weight**: 500
- **Text transform**: uppercase
- **Letter spacing**: 0.5-1.2px
- **Transition**: 0.15s ease-in-out
- **Hover**: translateY(-1px)

#### Button Variants
1. **Primary**: Black background, gold text
2. **Secondary**: Transparent, thin border
3. **Gold**: Gold background, white text

### Cards
- **Border radius**: 8px
- **Shadow**: `0 4px 20px rgba(0, 0, 0, 0.06)`
- **Hover shadow**: `0 8px 30px rgba(0, 0, 0, 0.12)`
- **Padding**: 32-48px
- **No borders**: Use shadow only
- **Hover**: translateY(-1px) with 0.15s transition

### Forms
- **Input border**: 1px solid #E5E5E5
- **Border radius**: 6px
- **Padding**: 14px
- **Font size**: 14px
- **Focus**: Border color changes to primary

### Dividers
- **Thickness**: 1px
- **Color**: rgba(0, 0, 0, 0.1) or #E5E5E5
- **Use sparingly**: Only when necessary

## Icons

### Icon Library
Use thin-line icons (2px stroke):
- Feather Icons
- Phosphor Thin
- Heroicons Stroke
- Lucide

### Icon Colors
- Default: `#1A1A1A`
- Accent: `#C9A86A` (gold)
- Size: 40-48px for features, 16-24px for UI

## Micro-Interactions

### Timing
- **Fade in**: 150-200ms
- **Hover lift**: 1-2px max
- **Transitions**: ease-in-out

### Hover Effects
- Subtle translateY(-1px or -2px)
- Shadow enhancement
- Color transitions
- Underline animations (1px gold line)

## Shadows

### Soft Shadow (Default)
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
```

### Hover Shadow
```css
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
```

## Page Sections

### Hero Section
- Clean white background
- Minimal decorative elements
- Large, thin typography
- Generous padding: 160px top, 120px bottom
- Subtle gold accent line

### Features Section
- Light gray background (#F5F5F5)
- 3-column grid (responsive)
- Gold icons (48px)
- Vertical gold line on hover (40px)
- 64px padding per card

### Stats Section
- Black background (#0D0D0D)
- Gold numbers (56px, Playfair Display)
- White labels (11px, uppercase, 2px letter-spacing)
- Gold underline accent (24px wide, 1px)

### Testimonials
- White background
- Italic text for quotes
- Gold quotation mark (64px, 15% opacity)
- Divider line above author info
- Black circular avatar with gold text

### CTA Section
- Black background
- White text
- Subtle gold radial gradient overlay
- Thin, elegant typography

## Imagery Guidelines

### Photo Style
- Architectural hotel photography
- Warm, natural lighting
- Black and white or desaturated
- Gold tones when color is used
- High contrast, professional quality

### Image Treatment
- Avoid overly colorful images
- Use filters to desaturate if needed
- Maintain premium, calm aesthetic

## Responsive Breakpoints

```css
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: < 768px
Small Mobile: < 480px
```

### Mobile Adjustments
- Reduce font sizes proportionally
- Maintain generous spacing
- Stack layouts vertically
- Keep luxury feel with proper spacing

## Dark Theme

### Colors
- Background: `#0D0D0D`
- Secondary: `#1A1A1A`
- Text: `#FFFFFF`
- Secondary text: `#B0B8C4`
- Accent: `#C9A86A` (gold remains)
- Borders: `rgba(255, 255, 255, 0.1)`

## Implementation Status

### ✅ Completed
- [x] Color palette system
- [x] Typography system
- [x] Button components
- [x] Card components
- [x] Home page hero section
- [x] Features section
- [x] Stats section
- [x] Testimonials section
- [x] CTA section
- [x] Header navigation
- [x] Responsive design
- [x] Dark theme support

### 🔄 Next Steps
- [ ] Room/Hotel cards
- [ ] Booking forms
- [ ] Admin dashboard
- [ ] Profile pages
- [ ] Dining pages
- [ ] Packages pages
- [ ] Footer component

## Usage Examples

### Button Usage
```jsx
<button className="btn btn-primary">Book Now</button>
<button className="btn btn-secondary">Learn More</button>
<button className="btn btn-gold">VIP Access</button>
```

### Card Usage
```jsx
<div className="card">
  <div className="card-content">
    <div className="card-subtitle">Premium Suite</div>
    <h3 className="card-title">Luxury Accommodation</h3>
    <p className="card-description">Experience unparalleled comfort...</p>
  </div>
</div>
```

### Section Title
```jsx
<h2 className="section-title">Our Features</h2>
<p className="section-subtitle">Discover what makes us unique</p>
```

## Design Principles

1. **Less is More**: Remove unnecessary elements
2. **White Space**: Use generously for breathing room
3. **Subtle Interactions**: Keep animations minimal and elegant
4. **Consistent Spacing**: Follow 8px grid system
5. **Typography Hierarchy**: Clear distinction between levels
6. **Gold Accents**: Use sparingly for luxury touch
7. **Thin Lines**: 1px borders and dividers
8. **Soft Shadows**: Subtle depth, not dramatic
9. **Professional Photography**: High-quality, desaturated images
10. **Calm & Quiet**: Avoid visual noise

---

**Remember**: Every element should feel intentional, expensive, and minimal. If in doubt, remove it.
