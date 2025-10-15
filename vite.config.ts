import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'MobileCore',
			formats: ['es'],
			fileName: 'index'
		},
		rollupOptions: {
			// Externalize dependencies - they won't be bundled
			external: ['ol', 'ol-ext', 'proj4'],
			output: {
				// Preserve module structure for tree-shaking
				preserveModules: false,
				exports: 'named'
			}
		},
		sourcemap: true,
		// Generate TypeScript declarations via tsc, not Vite
		emptyOutDir: false
	}
});
