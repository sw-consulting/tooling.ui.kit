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

## License

ISC
