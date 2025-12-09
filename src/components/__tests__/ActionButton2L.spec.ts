// Copyright (C) 2025 Maxim [maxirmx] Samsonov (www.sw.consulting)
// All rights reserved.
// This file is a part of UI Kit
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { nextTick } from 'vue'
import ActionButton2L from '../ActionButton2L.vue'

// Mock FontAwesome
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i class="fa-icon" :class="[icon]"></i>',
    props: ['icon', 'size', 'class']
  }
}))

// Global component registration
const globalComponents = {
  'font-awesome-icon': {
    name: 'FontAwesomeIcon',
    template: '<i class="fa-icon" :class="[icon]"></i>',
    props: ['icon', 'size', 'class']
  }
}

const vuetify = createVuetify({
  components,
  directives
})

describe('ActionButton2L', () => {
  const defaultProps = {
    item: { id: 1, name: 'Test Item' },
    icon: 'fa-solid fa-ellipsis-vertical',
    tooltipText: 'More actions',
    options: [
      { label: 'Edit', action: vi.fn() },
      { label: 'Delete', action: vi.fn() },
      { label: 'Archive', action: vi.fn() }
    ]
  }

  function createWrapper(props = {}) {
    return mount(ActionButton2L, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
        components: globalComponents
      }
    })
  }

  describe('rendering', () => {
    it('renders ActionButton component', () => {
      const wrapper = createWrapper()
      const actionButton = wrapper.findComponent({ name: 'ActionButton' })
      expect(actionButton.exists()).toBe(true)
      expect(actionButton.props('icon')).toBe('fa-solid fa-ellipsis-vertical')
      expect(actionButton.props('tooltipText')).toBe('More actions')
    })

    it('does not render menu initially', () => {
      const wrapper = createWrapper()
      const menu = wrapper.find('.action-button-2l__menu')
      expect(menu.exists()).toBe(false)
    })

    it('renders with empty options', () => {
      const wrapper = createWrapper({ options: [] })
      expect(wrapper.exists()).toBe(true)
    })

    it('has proper ARIA attributes on button', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.attributes('aria-haspopup')).toBe('menu')
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBeTruthy()
    })
  })

  describe('menu opening and closing', () => {
    it('opens menu when button is clicked', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      await nextTick()
      
      const menu = wrapper.find('.action-button-2l__menu')
      expect(menu.exists()).toBe(true)
      expect(wrapper.vm.isMenuOpen).toBe(true)
    })

    it('emits open event when menu opens', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      
      expect(wrapper.emitted('open')).toBeTruthy()
      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('closes menu when button is clicked again', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
      
      await button.trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('emits close event when menu closes', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      await nextTick()
      await button.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('renders all menu options when open', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems).toHaveLength(3)
      expect(menuItems[0].text()).toBe('Edit')
      expect(menuItems[1].text()).toBe('Delete')
      expect(menuItems[2].text()).toBe('Archive')
    })

    it('updates aria-expanded when menu opens', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      expect(button.attributes('aria-expanded')).toBe('false')
      
      await button.trigger('click')
      await nextTick()
      
      expect(button.attributes('aria-expanded')).toBe('true')
    })
  })

  describe('option selection', () => {
    it('calls option action when menu item is clicked', async () => {
      const actionSpy = vi.fn()
      const wrapper = createWrapper({
        options: [{ label: 'Test Action', action: actionSpy }]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      
      expect(actionSpy).toHaveBeenCalledWith(defaultProps.item)
      expect(actionSpy).toHaveBeenCalledTimes(1)
    })

    it('emits select event with option and index', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      await menuItems[1].trigger('click')
      
      expect(wrapper.emitted('select')).toBeTruthy()
      const selectEvent = wrapper.emitted('select')![0][0] as { option: { label: string }; index: number }
      expect(selectEvent.option.label).toBe('Delete')
      expect(selectEvent.index).toBe(1)
    })

    it('closes menu after option is selected', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('handles async actions', async () => {
      let resolveAction: (() => void) | undefined
      const asyncAction = vi.fn(() => new Promise<void>(resolve => {
        resolveAction = resolve
      }))
      const wrapper = createWrapper({
        options: [{ label: 'Async Action', action: asyncAction }]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      
      expect(asyncAction).toHaveBeenCalled()
      expect(wrapper.vm.isExecuting).toBe(true)
      
      // Resolve the promise
      resolveAction!()
      await nextTick()
      await nextTick()
      
      expect(wrapper.vm.isExecuting).toBe(false)
    })
  })

  describe('keyboard navigation', () => {
    it('opens menu on ArrowDown', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(true)
    })

    it('opens menu on ArrowUp', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(true)
    })

    it('closes menu on Escape', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
      
      await root.trigger('keydown', { key: 'Escape' })
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('navigates through options with ArrowDown', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(0)
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(1)
    })

    it('navigates through options with ArrowUp', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(1)
      
      await root.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(0)
    })

    it('wraps navigation at the end', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      // Navigate to last option
      await root.trigger('keydown', { key: 'ArrowDown' })
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(2)
      
      // Should wrap to first
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(0)
    })

    it('activates focused option on Enter', async () => {
      const actionSpy = vi.fn()
      const wrapper = createWrapper({
        options: [
          { label: 'First', action: vi.fn() },
          { label: 'Second', action: actionSpy }
        ]
      })
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(1)
      
      await root.trigger('keydown', { key: 'Enter' })
      await nextTick()
      
      expect(actionSpy).toHaveBeenCalledWith(defaultProps.item)
    })

    it('skips disabled options during navigation', async () => {
      const wrapper = createWrapper({
        options: [
          { label: 'Enabled 1', action: vi.fn() },
          { label: 'Disabled', action: vi.fn(), disabled: true },
          { label: 'Enabled 2', action: vi.fn() }
        ]
      })
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(0)
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      expect(wrapper.vm.focusedIndex).toBe(2) // Skipped index 1 (disabled)
    })
  })

  describe('disabled state', () => {
    it('disables button when disabled prop is true', () => {
      const wrapper = createWrapper({ disabled: true })
      const actionButton = wrapper.findComponent({ name: 'ActionButton' })
      expect(actionButton.props('disabled')).toBe(true)
    })

    it('does not open menu when disabled', async () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')
      
      await button.trigger('click')
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('closes menu when disabled becomes true', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
      
      await wrapper.setProps({ disabled: true })
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('disables menu items when option.disabled is true', async () => {
      const wrapper = createWrapper({
        options: [
          { label: 'Enabled', action: vi.fn() },
          { label: 'Disabled', action: vi.fn(), disabled: true }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems[0].attributes('disabled')).toBeUndefined()
      expect(menuItems[1].attributes('disabled')).toBeDefined()
    })

    it('does not execute disabled option action', async () => {
      const actionSpy = vi.fn()
      const wrapper = createWrapper({
        options: [
          { label: 'Disabled', action: actionSpy, disabled: true }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      
      expect(actionSpy).not.toHaveBeenCalled()
    })

    it('disables all menu items during execution', async () => {
      let resolveAction: (() => void) | undefined
      const asyncAction = vi.fn(() => new Promise<void>(resolve => {
        resolveAction = resolve
      }))
      const wrapper = createWrapper({
        options: [
          { label: 'Async', action: asyncAction },
          { label: 'Another', action: vi.fn() }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      await menuItems[0].trigger('click')
      
      expect(wrapper.vm.isExecuting).toBe(true)
      
      // Resolve the promise
      resolveAction!()
      await nextTick()
      await nextTick()
      
      expect(wrapper.vm.isExecuting).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('sets proper role attributes', async () => {
      const wrapper = createWrapper()
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menu = wrapper.find('.action-button-2l__menu')
      expect(menu.attributes('role')).toBe('menu')
      
      const menuItems = wrapper.findAll('[role="menuitem"]')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    it('manages focus with tabindex', async () => {
      const wrapper = createWrapper()
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems[0].attributes('tabindex')).toBe('0') // First enabled item focused
      expect(menuItems[1].attributes('tabindex')).toBe('-1')
      expect(menuItems[2].attributes('tabindex')).toBe('-1')
    })

    it('updates tabindex on navigation', async () => {
      const wrapper = createWrapper()
      const root = wrapper.find('.action-button-2l')
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      await root.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems[0].attributes('tabindex')).toBe('-1')
      expect(menuItems[1].attributes('tabindex')).toBe('0') // Now focused
      expect(menuItems[2].attributes('tabindex')).toBe('-1')
    })

    it('sets aria-disabled on disabled options', async () => {
      const wrapper = createWrapper({
        options: [
          { label: 'Enabled', action: vi.fn() },
          { label: 'Disabled', action: vi.fn(), disabled: true }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems[0].attributes('aria-disabled')).toBe('false')
      expect(menuItems[1].attributes('aria-disabled')).toBe('true')
    })

    it('has unique menu id', () => {
      const wrapper1 = createWrapper()
      const wrapper2 = createWrapper()
      
      const button1 = wrapper1.find('button')
      const button2 = wrapper2.find('button')
      
      expect(button1.attributes('aria-controls')).toBeTruthy()
      expect(button2.attributes('aria-controls')).toBeTruthy()
      expect(button1.attributes('aria-controls')).not.toBe(button2.attributes('aria-controls'))
    })
  })

  describe('edge cases', () => {
    it('handles empty options array', async () => {
      const wrapper = createWrapper({ options: [] })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      expect(wrapper.vm.isMenuOpen).toBe(true)
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems).toHaveLength(0)
    })

    it('handles all disabled options', async () => {
      const wrapper = createWrapper({
        options: [
          { label: 'Disabled 1', action: vi.fn(), disabled: true },
          { label: 'Disabled 2', action: vi.fn(), disabled: true }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      // Should open but not focus any item
      expect(wrapper.vm.isMenuOpen).toBe(true)
      expect(wrapper.vm.focusedIndex).toBe(-1)
    })

    it('cleans up state after action completes', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      await nextTick()
      
      // Menu should close and reset state
      expect(wrapper.vm.isMenuOpen).toBe(false)
      expect(wrapper.vm.isExecuting).toBe(false)
    })

    it('passes different item types correctly', async () => {
      const actionSpy = vi.fn()
      const complexItem = {
        id: 1,
        nested: { data: 'value' },
        array: [1, 2, 3]
      }
      
      const wrapper = createWrapper({
        item: complexItem,
        options: [{ label: 'Test', action: actionSpy }]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItem = wrapper.find('.action-button-2l__menu-item')
      await menuItem.trigger('click')
      
      expect(actionSpy).toHaveBeenCalledWith(complexItem)
    })

    it('forwards attrs to ActionButton', () => {
      const wrapper = createWrapper()
      const actionButton = wrapper.findComponent({ name: 'ActionButton' })
      
      // Should inherit attrs
      expect(actionButton.exists()).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('works as a context menu for table rows', async () => {
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      const onDuplicate = vi.fn()
      
      const wrapper = createWrapper({
        item: { id: 123, name: 'Test Row' },
        icon: 'fa-solid fa-ellipsis-vertical',
        tooltipText: 'Row actions',
        options: [
          { label: 'Edit', action: onEdit },
          { label: 'Delete', action: onDelete },
          { label: 'Duplicate', action: onDuplicate }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      await menuItems[1].trigger('click')
      
      expect(onDelete).toHaveBeenCalledWith({ id: 123, name: 'Test Row' })
      expect(onEdit).not.toHaveBeenCalled()
      expect(onDuplicate).not.toHaveBeenCalled()
    })

    it('works with conditional options based on item state', async () => {
      const item = { id: 1, status: 'active' }
      const onActivate = vi.fn()
      const onDeactivate = vi.fn()
      
      const wrapper = createWrapper({
        item,
        options: [
          { label: 'Activate', action: onActivate, disabled: item.status === 'active' },
          { label: 'Deactivate', action: onDeactivate, disabled: item.status !== 'active' }
        ]
      })
      
      await wrapper.find('button').trigger('click')
      await nextTick()
      
      const menuItems = wrapper.findAll('.action-button-2l__menu-item')
      expect(menuItems[0].attributes('disabled')).toBeDefined() // Activate is disabled
      expect(menuItems[1].attributes('disabled')).toBeUndefined() // Deactivate is enabled
    })

    it('supports multiple instances on same page', async () => {
      const wrapper1 = createWrapper({ item: { id: 1 } })
      const wrapper2 = createWrapper({ item: { id: 2 } })
      
      await wrapper1.find('button').trigger('click')
      await nextTick()
      expect(wrapper1.vm.isMenuOpen).toBe(true)
      expect(wrapper2.vm.isMenuOpen).toBe(false)
      
      await wrapper2.find('button').trigger('click')
      await nextTick()
      expect(wrapper1.vm.isMenuOpen).toBe(true) // Still open
      expect(wrapper2.vm.isMenuOpen).toBe(true) // Now also open
    })
  })

  describe('exposed properties', () => {
    it('exposes isMenuOpen', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('exposes isExecuting', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isExecuting).toBe(false)
    })

    it('exposes focusedIndex', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.focusedIndex).toBe(-1)
    })
  })
})
