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
