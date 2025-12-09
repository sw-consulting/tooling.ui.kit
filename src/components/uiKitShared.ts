// Copyright (C) 2025 Maxim [maxirmx] Samsonov (www.sw.consulting)
// All rights reserved.
// This file is a part of tooling.ui.kit library

export const actionButtonProps = {
  item: { required: true },
  icon: { type: String, required: true },
  tooltipText: { type: String, required: true },
  iconSize: { type: String, default: '1x' },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'default' }
}

export function buildActionButtonClasses(props: { disabled?: boolean; variant?: string }, attrs: Record<string, unknown> = {}) {
  return [
    'anti-btn',
    {
      'disabled-btn': props.disabled,
      'anti-btn-orange': props.variant === 'orange',
      'anti-btn-green': props.variant === 'green',
      'anti-btn-red': props.variant === 'red',
      'anti-btn-blue': props.variant === 'blue'
    },
    attrs.class
  ]
}
