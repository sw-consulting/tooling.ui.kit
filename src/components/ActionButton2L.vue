<script setup lang="ts">
// Copyright (C) 2025 Maxim [maxirmx] Samsonov (www.sw.consulting)
// All rights reserved.
// This file is a part of tooling.ui.kit library

import { computed, nextTick, ref, watch, type ComponentPublicInstance } from 'vue'
import ActionButton from './ActionButton.vue'
import { actionButtonProps } from './uiKitShared'

defineOptions({ inheritAttrs: false })

interface MenuOption {
  label: string
  // eslint-disable-next-line no-unused-vars
  action: (item: unknown) => void | Promise<void>
  disabled?: boolean
}

// Type declarations for DOM elements (to avoid no-undef ESLint errors)
/* global HTMLButtonElement, HTMLDivElement, Element, KeyboardEvent */

// Generate unique ID for menu - using timestamp + random for better uniqueness
const menuId = `action-button-2l-menu-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const props = defineProps({
  ...actionButtonProps,
  options: {
    type: Array as () => MenuOption[],
    required: false,
    default: () => [],
    validator(options: MenuOption[]) {
      // Accept missing/empty arrays. If provided, ensure it's an array and items have expected shape.
      if (options == null) return true
      if (!Array.isArray(options)) return false
      if (options.length === 0) return true
      return options.every(option => option && typeof option.label === 'string' && typeof option.action === 'function')
    }
  }
})

const emit = defineEmits<{
  open: []
  close: []
  select: [{ option: MenuOption; index: number }]
}>()

const isMenuOpen = ref(false)
const isExecuting = ref(false)
const focusedIndex = ref(-1)
const optionRefs = ref<(HTMLButtonElement | null)[]>([])
const rootRef = ref<HTMLDivElement | null>(null)

const effectiveDisabled = computed(() => props.disabled || isExecuting.value)

function resetFocus() {
  focusedIndex.value = -1
  optionRefs.value = []
}

async function focusOption(index: number) {
  await nextTick()
  const target = optionRefs.value[index]
  if (target) {
    target.focus()
    focusedIndex.value = index
  }
}

function setOptionRef(el: Element | ComponentPublicInstance | null, index: number) {
  optionRefs.value[index] = (el as HTMLButtonElement) || null
}

function firstEnabledIndex() {
  return props.options.findIndex(option => !option.disabled)
}

async function openMenu() {
  if (isMenuOpen.value || effectiveDisabled.value) {
    return
  }

  isMenuOpen.value = true
  emit('open')
  const indexToFocus = firstEnabledIndex()
  if (indexToFocus !== -1) {
    await focusOption(indexToFocus)
  }
}

function closeMenu() {
  if (!isMenuOpen.value) {
    return
  }

  isMenuOpen.value = false
  emit('close')
  resetFocus()
  nextTick(() => {
    const buttonEl = rootRef.value?.querySelector('button')
    buttonEl?.focus()
  })
}

function toggleMenu() {
  if (isMenuOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function focusNext() {
  const total = props.options.length
  if (total === 0) {
    return
  }

  let index = focusedIndex.value
  for (let i = 0; i < total; i += 1) {
    index = (index + 1) % total
    if (!props.options[index].disabled) {
      focusOption(index)
      break
    }
  }
}

function focusPrevious() {
  const total = props.options.length
  if (total === 0) {
    return
  }

  let index = focusedIndex.value
  for (let i = 0; i < total; i += 1) {
    index = (index - 1 + total) % total
    if (!props.options[index].disabled) {
      focusOption(index)
      break
    }
  }
}

async function activateOption(index: number) {
  const option = props.options[index]
  if (!option || option.disabled || isExecuting.value) {
    return
  }

  isExecuting.value = true
  try {
    emit('select', { option, index })
    await option.action(props.item)
  } finally {
    isExecuting.value = false
    closeMenu()
  }
}

function handleButtonClick() {
  if (effectiveDisabled.value) {
    return
  }

  toggleMenu()
}

function handleOptionClick(index: number) {
  activateOption(index)
}

function handleKeydown(event: KeyboardEvent) {
  if (effectiveDisabled.value) {
    return
  }

  if (!isMenuOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      focusPrevious()
      break
    case 'Enter':
      event.preventDefault()
      if (focusedIndex.value !== -1) {
        activateOption(focusedIndex.value)
      }
      break
    case 'Escape':
      event.preventDefault()
      closeMenu()
      break
    default:
      break
  }
}

watch(() => props.disabled, value => {
  if (value) {
    closeMenu()
  }
})

defineExpose({
  isMenuOpen,
  isExecuting,
  focusedIndex
})
</script>

<template>
  <div
    ref="rootRef"
    class="action-button-2l"
    @keydown.capture="handleKeydown"
  >
    <ActionButton
      :item="props.item"
      :icon="props.icon"
      :tooltip-text="props.tooltipText"
      :icon-size="props.iconSize"
      :variant="props.variant"
      :disabled="effectiveDisabled"
      v-bind="$attrs"
      aria-haspopup="menu"
      :aria-expanded="isMenuOpen"
      :aria-controls="menuId"
      @click="handleButtonClick"
    />
    <transition name="action-button-2l__fade">
      <ul
        v-if="isMenuOpen"
        :id="menuId"
        class="action-button-2l__menu"
        role="menu"
      >
        <li
          v-for="(option, index) in props.options"
          :key="option.label"
          role="none"
        >
          <button
            :ref="el => setOptionRef(el, index)"
            type="button"
            role="menuitem"
            class="action-button-2l__menu-item"
            :disabled="option.disabled || isExecuting"
            :aria-disabled="option.disabled || isExecuting"
            :tabindex="focusedIndex === index ? 0 : -1"
            :data-index="index"
            @click="handleOptionClick(index)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.action-button-2l {
  position: relative;
  display: inline-block;
}

.action-button-2l__menu {
  position: absolute;
  right: 0;
  margin-top: 20px;
  padding: 4px 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  min-width: 160px;
}

.action-button-2l__menu-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.action-button-2l__menu-item:not([disabled]):not([aria-disabled="true"]):hover,
.action-button-2l__menu-item:not([disabled]):not([aria-disabled="true"]):focus {
  background-color: rgba(var(--primary-color-rgb, 25, 118, 210), 0.1);
  outline: none;
}

.action-button-2l__menu-item[disabled],
.action-button-2l__menu-item[aria-disabled="true"] {
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

.action-button-2l__fade-enter-active,
.action-button-2l__fade-leave-active {
  transition: opacity 0.1s ease;
}

.action-button-2l__fade-enter-from,
.action-button-2l__fade-leave-to {
  opacity: 0;
}
</style>
