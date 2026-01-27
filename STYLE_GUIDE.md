# Sports CMS - Style Guide

**Version:** 1.0
**Last Updated:** January 2026

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Components](#components)
4. [Forms](#forms)
5. [Navigation](#navigation)
6. [Tables](#tables)
7. [Spacing & Layout](#spacing--layout)
8. [Animations](#animations)

---

## Color System

### Base Colors (Dark Mode)

```css
/* Background Colors */
--background: 0 0% 3%;           /* Deep black background */
--foreground: 0 0% 98%;          /* Near-white text */

/* Card System */
--card: 0 0% 5%;                 /* Subtle card background */
--card-foreground: 0 0% 98%;     /* Card text color */

/* Popover System */
--popover: 0 0% 5%;              /* Popover background */
--popover-foreground: 0 0% 98%;  /* Popover text */
```

### Brand Colors

```css
/* Primary - Custom Blue */
--primary: 221 74% 31%;          /* Main brand color */
--primary-foreground: 0 0% 100%; /* Text on primary */
--primary-hover: 221 74% 25%;    /* Hover state */
--primary-glow: 221 74% 60%;     /* Glow/accent effects */

/* Secondary - Custom Green */
--secondary: 149 75% 22%;        /* Secondary brand color */
--secondary-foreground: 0 0% 100%;
--secondary-hover: 149 75% 18%;
```

### Semantic Colors

```css
/* Warning - Vibrant Orange */
--warning: 25 95% 53%;
--warning-foreground: 0 0% 100%;

/* Error/Destructive - Strong Red */
--destructive: 348 83% 47%;
--destructive-foreground: 0 0% 100%;
```

### Neutral Colors

```css
/* Muted Elements */
--muted: 0 0% 8%;                /* Subtle backgrounds */
--muted-foreground: 0 0% 60%;    /* Muted text */

/* Accent */
--accent: 0 0% 8%;               /* Accent backgrounds */
--accent-foreground: 0 0% 98%;   /* Accent text */

/* Borders & Inputs */
--border: 0 0% 12%;              /* Border color */
--input: 0 0% 12%;               /* Input border */
--ring: 221 74% 31%;             /* Focus ring */
```

### Sidebar Colors

```css
--sidebar-background: 0 0% 3%;
--sidebar-foreground: 0 0% 98%;
--sidebar-primary: 221 74% 31%;
--sidebar-primary-foreground: 0 0% 100%;
--sidebar-accent: 0 0% 8%;
--sidebar-accent-foreground: 0 0% 98%;
--sidebar-border: 0 0% 12%;
--sidebar-ring: 221 74% 31%;
```

### Gradients

```css
--gradient-primary: linear-gradient(135deg, hsl(221 74% 31%), hsl(221 74% 45%));
--gradient-secondary: linear-gradient(135deg, hsl(149 75% 22%), hsl(149 75% 35%));
--gradient-hero: linear-gradient(135deg, hsl(221 74% 31%) 0%, hsl(221 74% 45%) 100%);
--gradient-card: linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(0 0% 8%) 100%);
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 hsl(221 74% 31% / 0.3);
--shadow-md: 0 4px 6px -1px hsl(221 74% 31% / 0.4), 0 2px 4px -1px hsl(221 74% 31% / 0.2);
--shadow-lg: 0 10px 15px -3px hsl(221 74% 31% / 0.4), 0 4px 6px -2px hsl(221 74% 31% / 0.2);
--shadow-glow: 0 0 20px hsl(221 74% 60% / 0.6);
```

---

## Typography

### Font Stack

```css
body {
  font-family: 'Helvetica', system-ui, -apple-system, sans-serif;
}
```

### Font Sizes

- **12px (text-xs)**: Tab labels, small UI text
- **14px (text-sm)**: Body text, form labels, table content
- **16px (text-base)**: Default body text
- **24px (text-2xl)**: Section headings
- **30px (text-3xl)**: Page titles

### Font Weights

- **400 (font-normal)**: Body text
- **500 (font-medium)**: Labels, buttons, tabs
- **700 (font-bold)**: Headings, emphasis

### Text Styles

```tsx
// Page Title
<h1 className="text-3xl font-bold">Title</h1>

// Section Subtitle
<p className="text-muted-foreground">Description text</p>

// Form Label
<Label className="text-sm font-medium">Field Label</Label>
```

---

## Components

### Buttons

#### Primary Button
```tsx
<Button type="submit">
  Save Changes
</Button>
```

**Styling:**
- Background: `bg-primary`
- Text: `text-primary-foreground`
- Hover: Darker primary color
- Padding: `px-4 py-2`

#### Secondary/Outline Button
```tsx
<Button variant="outline">
  Cancel
</Button>
```

**Styling:**
- Background: Transparent
- Border: `border border-border`
- Text: `text-foreground`
- Hover: `bg-muted`

#### Icon Button
```tsx
<Button variant="ghost" size="icon">
  <ArrowLeft className="h-4 w-4" />
</Button>
```

**Styling:**
- Size: `h-10 w-10`
- Icon size: `h-4 w-4`
- No text, icon only
- Used for: Back buttons, close buttons

#### Ghost Button
```tsx
<Button variant="ghost">
  Action
</Button>
```

**Styling:**
- Background: Transparent
- No border
- Hover: `bg-muted/60`

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Content */}
  </CardContent>
</Card>
```

**Styling:**
- Background: `bg-card`
- Border: `border border-border`
- Border Radius: `0.75rem`
- Padding (Header): `p-6`
- Padding (Content): `p-6`

### Tabs

#### Tab Container
```tsx
<Tabs defaultValue="information" className="w-full">
  <TabsList className="mb-6">
    <TabsTrigger value="information">Information</TabsTrigger>
    <TabsTrigger value="media">Media</TabsTrigger>
  </TabsList>

  <TabsContent value="information">
    {/* Content */}
  </TabsContent>
</Tabs>
```

#### Styling Rules

**TabsList:**
- Display: `inline-flex`
- Background: Transparent
- Border-bottom: `border-b border-border`
- Full width: `w-full`

**TabsTrigger:**
- Font size: **12px** (`text-xs`)
- Font weight: `font-medium`
- Text transform: **UPPERCASE**
- Letter spacing: **0.5px** (`tracking-[0.5px]`)
- Padding: `px-6 py-3`
- Default color: `text-muted-foreground`
- Active color: `text-foreground`
- Active indicator: `border-b-2 border-primary`
- Negative margin: `-mb-[1px]` (for border overlap)

**Tab Naming Standards:**
- ✅ **Information** (not "Content Information")
- ✅ **Media** (not "Images")
- ✅ **Publishing**
- ✅ **Classification**
- ✅ **Agents**

### Status Chips

```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-[9px] text-xs font-medium bg-muted text-muted-foreground border border-border">
  Status Text
</span>
```

**Styling:**
- Display: `inline-flex items-center`
- Padding: `px-2.5 py-0.5`
- Border-radius: **9px** (`rounded-[9px]`)
- Font size: `text-xs`
- Font weight: `font-medium`
- Background: `bg-muted`
- Text: `text-muted-foreground`
- Border: `border border-border`

---

## Forms

### Form Layout

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Tabs */}
    <Tabs defaultValue="information" className="w-full">
      {/* Tab content */}
    </Tabs>

    {/* Form Actions */}
    <div className="flex gap-4 justify-end">
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Form>
```

### Back Button (Standard Pattern)

```tsx
<div className="flex items-center gap-4">
  <Button
    variant="ghost"
    size="icon"
    onClick={() => navigate(-1)}
    className="text-muted-foreground hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4" />
  </Button>
  {/* Optional: Page title next to back button */}
</div>
```

**Rules:**
- ✅ Icon only (no text)
- ✅ Size: `icon`
- ✅ Variant: `ghost`
- ✅ Icon size: `h-4 w-4`
- ❌ No "Back to..." text

### Form Fields

#### Text Input
```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label *</FormLabel>
      <FormControl>
        <Input placeholder="Placeholder text..." {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Textarea
```tsx
<FormControl>
  <Textarea
    placeholder="Description..."
    className="min-h-32"
    {...field}
  />
</FormControl>
```

**Styling:**
- Min height: `min-h-32`
- Resize: Vertical only

#### Select Dropdown
```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Switch/Toggle
```tsx
<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  <div className="space-y-0.5">
    <FormLabel className="text-base">Enabled</FormLabel>
    <FormDescription>
      Description of what this toggle does
    </FormDescription>
  </div>
  <FormControl>
    <Switch
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  </FormControl>
</FormItem>
```

### Form Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Form fields */}
</div>
```

**Spacing:**
- Gap between fields: `gap-6`
- Responsive: 1 column mobile, 2 columns desktop

---

## Navigation

### Sidebar

**Structure:**
```tsx
<Sidebar className="w-64">
  <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
    {/* Logo */}
    {/* Navigation items */}
    {/* User profile */}
  </SidebarContent>
</Sidebar>
```

**Styling:**
- Width: `w-64` (256px)
- Background: Gradient from card to muted
- Border-right: `border-r border-sidebar-border`

**Navigation Items:**

Active State:
```tsx
className="bg-primary text-white font-medium"
```

Inactive State:
```tsx
className="hover:bg-muted/60 transition-colors font-medium"
```

**Menu Labels:**
- ✅ **Content** (not "Content Management")
- Short, concise labels to prevent text wrapping

---

## Tables

### Table Structure

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table Styling

**Header:**
- Font weight: `font-medium`
- Color: `text-muted-foreground`
- Border: `border-b`

**Rows:**
- Hover: `hover:bg-muted/50`
- Border: `border-b border-border`

**Cells:**
- Padding: `p-4`
- Font size: `text-sm`

### Label Display (Agents Table)

```tsx
<TableCell>
  <span className="capitalize">{agent.label}</span>
</TableCell>
```

**Rules:**
- ❌ No Badge component
- ✅ Plain text with `capitalize` class

---

## Spacing & Layout

### Container Spacing

```tsx
<div className="space-y-6">
  {/* Sections with 24px gap between them */}
</div>
```

**Standard Gaps:**
- `space-y-6`: 24px vertical gap (most common)
- `space-y-4`: 16px vertical gap
- `space-y-2`: 8px vertical gap
- `gap-4`: 16px flex/grid gap
- `gap-6`: 24px flex/grid gap

### Padding

- **Cards:** `p-6` (24px)
- **Buttons:** `px-4 py-2` (16px horizontal, 8px vertical)
- **Form sections:** `p-4` (16px)

### Border Radius

```css
--radius: 0.75rem; /* 12px */
```

**Usage:**
- Cards: `rounded-lg` (0.5rem / 8px)
- Buttons: `rounded-md` (0.375rem / 6px)
- Status chips: `rounded-[9px]` (9px)
- Inputs: `rounded-md`

---

## Animations

### Transitions

```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

**Usage:**
- Hover states: `transition-colors`
- Tab switching: `transition-all`
- Smooth animations: Use `--transition-smooth`
- Bouncy effects: Use `--transition-spring`

### Loading States

```tsx
{isSubmitting ? (
  <>
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    Loading...
  </>
) : (
  <>
    <Icon className="h-4 w-4" />
    Button Text
  </>
)}
```

---

## Best Practices

### ✅ DO

1. **Use icon-only back buttons** (no text)
2. **Use standardized tab names** (Information, Media, Publishing)
3. **Use consistent spacing** (`space-y-6` for sections)
4. **Use status chips** instead of badges in tables
5. **Use uppercase tabs** with 12px font and 0.5px letter spacing
6. **Keep sidebar labels short** to prevent wrapping
7. **Use dark colors** for containers (5% lightness for cards)

### ❌ DON'T

1. **Don't add text to back buttons** (icon only)
2. **Don't use "Images" tab name** (use "Media")
3. **Don't use Badge for table labels** (use plain text with capitalize)
4. **Don't use 14px for tabs** (use 12px)
5. **Don't use light container colors** (darkened for better contrast)
6. **Don't create custom naming** (follow established conventions)

---

## Component Checklist

When creating a new form:

- [ ] Back button is icon-only
- [ ] Tabs use standardized names (Information, Media, Publishing)
- [ ] Tab styling: 12px, uppercase, 0.5px tracking
- [ ] Form uses `space-y-6` for section spacing
- [ ] Cards have proper titles
- [ ] Status indicators use chip styling (not badges)
- [ ] Form actions are right-aligned with `justify-end`
- [ ] All required fields marked with `*`

---

## File Structure Reference

**Core Files:**
- `src/index.css` - Global CSS variables and theme
- `src/components/ui/tabs.tsx` - Tab component styling
- `src/components/ui/button.tsx` - Button variants
- `src/components/app-sidebar.tsx` - Sidebar navigation

**Form Examples:**
- `src/components/forms/EventForm.tsx` - 3 tabs (Information, Media, Publishing)
- `src/components/forms/AgentForm.tsx` - 2 tabs (Information, Media)
- `src/components/forms/VideoForm.tsx` - 3 tabs standard layout

---

**End of Style Guide**

For questions or updates, refer to the latest commit in the `claude-code` branch.
