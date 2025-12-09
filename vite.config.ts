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
      fileName: (format) => `tooling-ui-kit.${format}.js`
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
