# DeFi Sentinel - Design Guidelines

## Design Approach

**System-Based Design with DeFi Industry Standards**

This utility-focused financial application prioritizes data clarity, trustworthiness, and efficient information delivery. Drawing from Material Design's data visualization principles and established DeFi platform patterns (DeFiLlama, Aave, Compound), the design emphasizes professional credibility and analytical power.

## Core Design Principles

1. **Data First**: Information hierarchy optimized for financial decision-making
2. **Trust Through Clarity**: Clean, professional aesthetic that builds confidence
3. **Scan-Friendly**: Quick visual parsing of critical metrics (APY, TVL, Risk)
4. **Dark Mode Native**: Industry-standard dark interface reducing eye strain during extended analysis sessions

## Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 12% 12% (elevated panels)
- Surface Elevated: 220 10% 16% (cards, modals)
- Border: 220 8% 24% (subtle separators)

**Accent Colors**
- Primary: 200 95% 55% (cyan-blue for CTAs, links)
- Success: 142 76% 45% (green for positive yields)
- Warning: 38 92% 50% (amber for medium risk)
- Danger: 0 84% 60% (red for high risk)

**Text Colors**
- Primary: 220 5% 95% (white-ish for headings)
- Secondary: 220 5% 70% (muted for labels)
- Tertiary: 220 5% 50% (subtle for metadata)

**Data Visualization**
- Chart Line: 200 95% 55% (primary cyan)
- Chart Area Fill: 200 95% 55% at 20% opacity
- Grid Lines: 220 8% 20% (subtle)

## Typography

**Font Stack**
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts)
- Mono: 'JetBrains Mono', 'Fira Code', monospace (for numbers, addresses)

**Type Scale**
- Display: 36px/40px, semibold (dashboard titles)
- H1: 28px/32px, semibold (section headers)
- H2: 20px/24px, medium (card titles)
- H3: 16px/20px, medium (subsections)
- Body: 14px/20px, regular (primary content)
- Small: 12px/16px, regular (metadata, labels)
- Mono Numbers: 14px/20px, medium (APY, TVL values)

## Layout System

**Spacing Primitives**: Use Tailwind units 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6
- Section spacing: gap-8, py-12
- Card spacing: p-6, gap-4
- Dense data tables: p-4, gap-2

**Container Widths**
- Max content: max-w-7xl mx-auto
- Dashboard grid: 12-column CSS Grid
- Responsive breakpoints: sm(640), md(768), lg(1024), xl(1280)

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo, search, user profile
- **Sidebar**: Collapsible navigation (Dashboard, Pools, Alerts, Settings)
- Height: h-14 for top bar, full-height sidebar with w-64

### Data Display

**Pool Cards**
```
- Background: Surface color with border
- Padding: p-6
- Grid layout: Protocol icon + name | Chain badge | TVL | APY (large) | Risk score
- Hover state: Subtle border glow (primary color at 40%)
```

**Data Tables**
```
- Sticky header: bg-surface-elevated
- Alternating rows: No zebra striping (causes visual noise)
- Cell padding: px-4 py-3
- Sortable columns: Arrow indicators
- Number alignment: Right-aligned for numeric data
```

**Metric Cards**
```
- Large number display: 32px mono font
- Label above: 12px secondary color
- Trend indicator: Small arrow + percentage change
- Color-coded borders: Left border 3px for risk/performance
```

### Forms & Inputs

**Search Bar**
- Background: Surface elevated
- Height: h-12
- Icon: Left-aligned magnifying glass
- Placeholder: "Find stablecoin yields with low risk..."
- Border: 1px with focus state (primary glow)

**Filter Chips**
- Pill shape: rounded-full
- Padding: px-4 py-2
- Active state: bg-primary with white text
- Inactive: bg-surface-elevated with secondary text

### Interactive Elements

**Primary Button**
- Background: Primary color gradient (subtle)
- Height: h-10 or h-12
- Padding: px-6
- Rounded: rounded-lg
- Hover: Brightness increase 110%

**Secondary Button**  
- Border: 1px primary color
- Background: Transparent
- Same sizing as primary

### Data Visualization

**Charts (using Chart.js or Recharts)**
- Line charts: 2px stroke, gradient fill below
- Bar charts: Rounded tops (rounded-t-sm)
- Tooltips: Dark background with primary accent border
- Grid: Horizontal only, subtle

**Risk Score Gauge**
- Circular progress indicator
- Color gradient: Red (0-40) → Yellow (41-70) → Green (71-100)
- Center: Large score number + "Risk Score" label

### Streaming Status Indicators

**Research Progress**
```
- Pulsing dot animation (primary color)
- Status text: "Analyzing requirements..." 
- Progress bar: Indeterminate shimmer effect
- Stage indicators: 4 dots showing current step
```

### Modals & Overlays

**Pool Detail Modal**
- Full-screen on mobile, centered max-w-4xl on desktop
- Background: Surface color
- Close button: Top right, rounded-full bg-surface-elevated
- Sections: Overview, Historical Data, Risk Analysis, Gas Calculator

## Animations

**Use Sparingly - Only for feedback**
- Loading states: Subtle pulse on skeleton screens
- Number changes: Brief highlight flash (primary color fade)
- Card hover: Translate Y by -2px with transition
- Status updates: Fade in/out for streaming messages

**Avoid**: Page transitions, decorative animations, scroll effects

## Accessibility

- Maintain 4.5:1 contrast ratios minimum
- Focus visible states: 2px outline primary color
- ARIA labels for all interactive elements
- Keyboard navigation for all actions
- Screen reader announcements for streaming updates

## Images

**No Hero Images** - This is a data dashboard, not a marketing site.

**Icons Only**:
- Protocol logos: 32px circular icons via CDN (CoinGecko API or local assets)
- Chain icons: 20px inline badges
- Status icons: Heroicons via CDN
- Use: `<img src="https://cdn.example.com/protocol-logos/{name}.png" alt="Protocol" class="w-8 h-8 rounded-full" />`

## Dashboard Layout Structure

1. **Top Bar**: Logo, Search, Notifications, Profile
2. **Sidebar**: Navigation links with icons
3. **Main Content**:
   - Header: Page title + Quick filters
   - Metrics Row: 4-column grid of metric cards (Total TVL, Avg APY, Pools Tracked, etc.)
   - Filters Bar: Chain selector, Protocol filter, Risk range, Sort dropdown
   - Results Grid: 3-column grid of pool cards (responsive to 1 column mobile)
   - Pagination: Bottom center

4. **Streaming Panel** (when active): Fixed bottom-right, rounded-lg shadow, shows research progress

This design creates a professional, trustworthy DeFi analytics platform that prioritizes data clarity and user efficiency while maintaining the visual standards expected in the crypto industry.