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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ToolingUIKit',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'tooling-ui-kit.es.js'
        if (format === 'umd') return 'tooling-ui-kit.umd.js'
        return `tooling-ui-kit.${format}.js`
      }
    },
    rollupOptions: {
      // Externalize Vue, Vuetify and FontAwesome to avoid bundling them
      external: ['vue', 'vuetify', 'vuetify/components', 'vuetify/directives', '@fortawesome/vue-fontawesome', '@fortawesome/fontawesome-svg-core'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          '@fortawesome/vue-fontawesome': 'FontAwesomeVue',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeSvgCore'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    server: {
      deps: {
        inline: ['vuetify']
      }
    }
  }
})
