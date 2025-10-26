# Featured Profiles - Ultra Premium Card Effects

## Overview

The "Featured" profile feature allows administrators to designate certain profiles to display with **Ultra Premium (Option C)** card effects. These cards stand out dramatically from regular profiles with advanced visual effects including holographic shimmer, animated borders, sparkles, and more.

## Implementation Date

October 26, 2025

## Feature Components

### 1. Database Schema

**Table**: `lookbook_profiles`
**New Column**: `featured` (BOOLEAN, DEFAULT FALSE)

```sql
ALTER TABLE lookbook_profiles
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
```

### 2. Backend (Profile Queries)

**Files Modified**:
- `/backend/queries/profileQueries.js`

**Changes**:
- Added `featured` field to `getAllProfiles` SELECT query
- Added `featured` field to `createProfile` INSERT query
- Added `featured` to `allowedFields` in `updateProfile`

### 3. Admin Interface

**File**: `/frontend/src/pages/AdminPersonEditPage.jsx`

**Features**:
- ✅ "Featured" toggle checkbox in both Form Mode and WYSIWYG Mode
- ✅ Visual indicator with ⭐ emoji
- ✅ Helper text: "(Ultra Premium card effect)"
- ✅ Located alongside "Open to Work" toggle for easy access

**Usage**:
1. Navigate to Admin → People
2. Select a profile to edit
3. Check the "Featured ⭐" checkbox
4. Save the profile

### 4. Frontend Card Effects

**CSS File**: `/frontend/src/index.css`
**Component**: `/frontend/src/pages/PersonDetailPage.jsx` (ProfileCard)

## Card Effect Levels

### Regular Cards (Option A - Subtle & Professional)
- Light holographic shimmer (30% opacity)
- 5-degree 3D tilt on hover
- 4px lift on hover
- Simple shadow enhancement

### Featured Cards (Option C - Ultra Premium) ⭐
- **Stronger holographic effect** (60% opacity with enhanced colors)
- **More dramatic 3D tilt** (10 degrees instead of 5)
- **Higher lift** (8px instead of 4px)
- **Animated rainbow border** (rotates through colors)
- **Edge glow effect** (multicolor shadow halo)
- **Foil texture overlay** (crosshatch pattern for depth)
- **Sparkle particles** (5 animated sparkles at various positions)
- **Reflection sweep** (light sweep that follows cursor)
- **Enhanced blend modes** (screen mode for more vibrant colors)

## Visual Effects Breakdown

### 1. Animated Rainbow Border
```css
.person-card-wrapper.featured::before
```
- Rotates through: Pink → Orange → Turquoise → Purple → Hot Pink
- 4-second infinite loop animation
- Only visible on hover

### 2. Edge Glow
```css
.person-card-wrapper.featured::after
```
- Triple-layered colored shadow:
  - 20px pink glow
  - 40px turquoise glow
  - 60px purple glow

### 3. Foil Texture
- Diagonal crosshatch pattern at 45° and -45°
- Overlay blend mode for subtle texture
- Creates "rare trading card" effect

### 4. Sparkle Particles
- 5 sparkles with staggered animation timings
- 1.5-second pulse animation (scale 0 → 1 → 0)
- White with soft glow effect
- Positioned at: 20%, 60%, 40%, 80%, 30% coordinates

### 5. Reflection Sweep
- Gradient sweep that follows cursor horizontally
- 120° angle for realistic light reflection
- Smooth 0.6s transition

### 6. Enhanced Holographic Gradient
- More intense color spectrum
- Brighter filter (1.2 brightness, 1.2 contrast)
- Screen blend mode instead of color-dodge
- Colors: Hot Pink → Orange → Turquoise → Yellow → Purple → Deep Pink

## Technical Specifications

### JavaScript Logic
```javascript
const isFeatured = prof.featured === true;

// More dramatic rotation for featured cards
const maxRotation = isFeatured ? 10 : 5;
const liftAmount = isFeatured ? -8 : -4;
```

### CSS Class Application
```jsx
<div className={`person-card-wrapper ${isFeatured ? 'featured' : ''}`}>
```

### Conditional Premium Effects
```jsx
{isFeatured && (
  <>
    <div className="foil-texture"></div>
    {/* 5 sparkle divs */}
    <div className="reflection-effect"></div>
  </>
)}
```

## Performance Considerations

- **GPU Acceleration**: Uses `will-change: transform` for smooth animations
- **Pointer Events**: Effects use `pointer-events: none` to avoid blocking clicks
- **Conditional Rendering**: Premium effects only render for featured cards
- **CSS Animations**: Hardware-accelerated keyframe animations
- **Z-Index Management**: Proper layering to avoid conflicts

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] Backend returns `featured` field in API responses
- [ ] Admin toggle saves `featured` status correctly
- [ ] Featured cards display rainbow border on hover
- [ ] Sparkles animate at correct intervals
- [ ] Edge glow visible on hover
- [ ] Foil texture visible on hover
- [ ] Reflection follows cursor movement
- [ ] Regular cards still work with Option A effects
- [ ] Mobile experience (touch support - TBD)

## Future Enhancements

1. **Mobile Touch Support**: Add touch event handlers for featured cards
2. **Featured Badge**: Add visual indicator in card corner (e.g., ⭐ badge)
3. **Analytics**: Track engagement with featured vs. regular cards
4. **Admin Filters**: Filter admin people list by featured status
5. **Bulk Toggle**: Ability to feature/unfeature multiple profiles at once
6. **Featured Sort**: Option to show featured profiles first in grid view

## Migration Script

Run this to add the feature to your database:

```bash
psql "$DATABASE_URL" -f database/migrations/add_featured_profiles.sql
```

## Related Files

- `/database/migrations/add_featured_profiles.sql`
- `/backend/queries/profileQueries.js`
- `/frontend/src/pages/AdminPersonEditPage.jsx`
- `/frontend/src/pages/PersonDetailPage.jsx`
- `/frontend/src/index.css`

## Design Philosophy

The featured card effect is designed to:
- **Stand out** without being distracting
- **Maintain professionalism** while adding excitement
- **Enhance brand perception** for highlighted profiles
- **Create aspiration** for other users to be featured
- **Provide visual hierarchy** in the people grid

## Comparison

| Feature | Regular Card | Featured Card |
|---------|-------------|---------------|
| Holographic Opacity | 30% | 60% |
| Tilt Rotation | 5° | 10° |
| Hover Lift | 4px | 8px |
| Border Animation | ❌ | ✅ Rainbow |
| Edge Glow | ❌ | ✅ Triple Shadow |
| Foil Texture | ❌ | ✅ Crosshatch |
| Sparkles | ❌ | ✅ 5 Particles |
| Reflection Sweep | ❌ | ✅ Cursor-Following |
| Blend Mode | color-dodge | screen |

---

**Status**: ✅ Complete and Deployed
**Next Steps**: Test in production, gather feedback, consider mobile enhancements

