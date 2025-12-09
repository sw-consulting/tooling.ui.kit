# tooling.ui.kit

UI Kit - A collection of reusable Vue 3 components

## Installation

```bash
npm install tooling.ui.kit
```

## Peer Dependencies

This library requires the following peer dependencies:

- `vue` ^3.0.0
- `vuetify` ^3.11.3
- `@fortawesome/vue-fontawesome` ^3.1.2
- `@fortawesome/fontawesome-svg-core` ^7.1.0

## Components

### ActionButton

A customizable action button component with Vuetify tooltip and FontAwesome icon support.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `item` | any | Yes | - | The item data to emit on click |
| `icon` | String | Yes | - | FontAwesome icon class (e.g., 'fa-solid fa-pen') |
| `tooltipText` | String | Yes | - | Text to display in the tooltip |
| `iconSize` | String | No | '1x' | FontAwesome icon size |
| `disabled` | Boolean | No | false | Whether the button is disabled |
| `variant` | String | No | 'default' | Color variant: 'default', 'orange', 'green', 'red', or 'blue' |

#### Events

- `click`: Emitted when the button is clicked, passes the `item` prop as payload

#### Usage Example

```vue
<script setup>
import { ActionButton } from 'tooling.ui.kit'

const handleEdit = (item) => {
  console.log('Editing item:', item)
}
</script>

<template>
  <ActionButton
    :item="{ id: 1, name: 'Sample Item' }"
    icon="fa-solid fa-pen"
    tooltip-text="Edit item"
    variant="blue"
    @click="handleEdit"
  />
</template>
```

#### Variants

The ActionButton supports different color variants:
- `default` - Gray with blue hover (#1976d2)
- `orange` - Orange (#ff6b35) with lighter hover (#ff8c42)
- `green` - Green (#4caf50) with lighter hover (#66bb6a)
- `red` - Red (#d3223f) with lighter hover (#e34b5f)
- `blue` - Blue (#1976d2) with lighter hover (#2196f3)

### ActionButton2L

A two-level action button component that wraps ActionButton to provide dropdown menu functionality with full keyboard navigation support. Perfect for context menus, row actions, and any scenario requiring multiple action options.

#### Props

ActionButton2L inherits all props from ActionButton and adds:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `item` | any | Yes | - | The item data to emit on click and pass to option actions |
| `icon` | String | Yes | - | FontAwesome icon class (e.g., 'fa-solid fa-ellipsis-vertical') |
| `tooltipText` | String | Yes | - | Text to display in the tooltip |
| `iconSize` | String | No | '1x' | FontAwesome icon size |
| `disabled` | Boolean | No | false | Whether the button is disabled |
| `variant` | String | No | 'default' | Color variant: 'default', 'orange', 'green', 'red', or 'blue' |
| `options` | Array | No | [] | Array of menu options with shape `{ label: string, action: function, disabled?: boolean }` |

#### Events

- `open`: Emitted when the dropdown menu opens
- `close`: Emitted when the dropdown menu closes
- `select`: Emitted when a menu option is selected, passes `{ option, index }` as payload

#### MenuOption Interface

Each option in the `options` array should have the following structure:

```typescript
interface MenuOption {
  label: string                              // Display text for the menu item
  action: (item: any) => void | Promise<void> // Function to execute when selected
  disabled?: boolean                         // Optional: whether the option is disabled
}
```

#### Usage Example

```vue
<script setup>
import { ActionButton2L } from 'tooling.ui.kit'

const user = { id: 1, name: 'John Doe', status: 'active' }

const handleEdit = (user) => {
  console.log('Editing user:', user)
}

const handleDelete = async (user) => {
  console.log('Deleting user:', user)
  // Async operations are supported
}

const handleToggleStatus = (user) => {
  console.log('Toggling status for:', user)
}

const menuOptions = [
  { label: 'Edit', action: handleEdit },
  { label: 'Delete', action: handleDelete },
  { label: 'Deactivate', action: handleToggleStatus, disabled: user.status !== 'active' }
]

const handleMenuOpen = () => {
  console.log('Menu opened')
}

const handleMenuSelect = ({ option, index }) => {
  console.log('Selected:', option.label, 'at index', index)
}
</script>

<template>
  <ActionButton2L
    :item="user"
    icon="fa-solid fa-ellipsis-vertical"
    tooltip-text="User actions"
    :options="menuOptions"
    variant="default"
    @open="handleMenuOpen"
    @select="handleMenuSelect"
  />
</template>
```

#### Keyboard Navigation

ActionButton2L provides full keyboard accessibility:

- **Arrow Down** / **Arrow Up**: Open menu when closed, navigate between options when open
- **Enter**: Activate the focused menu option
- **Escape**: Close the menu and return focus to the button
- **Tab**: Standard focus management with disabled items automatically skipped

The component automatically:
- Focuses the first enabled option when the menu opens
- Wraps navigation at the top and bottom of the menu
- Skips disabled options during keyboard navigation
- Manages ARIA attributes for screen reader compatibility

#### Accessibility Features

- Full ARIA support with `role="menu"` and `role="menuitem"`
- Proper `aria-haspopup`, `aria-expanded`, and `aria-controls` attributes
- Dynamic `aria-disabled` states for disabled options
- Focus management with appropriate `tabindex` values
- Unique IDs for each menu instance

#### Common Use Cases

**Table Row Actions**
```vue
<template>
  <ActionButton2L
    :item="row"
    icon="fa-solid fa-ellipsis-vertical"
    tooltip-text="Row actions"
    :options="[
      { label: 'Edit', action: onEdit },
      { label: 'Duplicate', action: onDuplicate },
      { label: 'Delete', action: onDelete }
    ]"
  />
</template>
```

**Conditional Options**
```vue
<script setup>
const getOptions = (item) => [
  { label: 'View', action: onView },
  { label: 'Activate', action: onActivate, disabled: item.status === 'active' },
  { label: 'Deactivate', action: onDeactivate, disabled: item.status !== 'active' }
]
</script>

<template>
  <ActionButton2L
    :item="item"
    icon="fa-solid fa-gear"
    tooltip-text="Settings"
    :options="getOptions(item)"
  />
</template>
```

## License

ISC
