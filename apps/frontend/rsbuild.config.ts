import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { tanstackRouter } from '@tanstack/router-plugin/rspack'

import { Boolean, flow, Record, String } from 'effect'

export default defineConfig({
	source: {
		entry: { index: './src/main.tsx' },
		define: {
			'process.env': Record.mapKeys(
				loadEnv({ prefixes: ['PUBLIC_'] }).publicVars,
				flow(String.replace('import.meta.env.', ''), String.replace('process.env.', ''))
			)
		}
	},
	plugins: [
		pluginReact(),
		pluginBabel({
			include: /\.(?:jsx|tsx)$/,
			babelLoaderOptions: opts => void opts.plugins?.unshift('babel-plugin-react-compiler')
		})
	],
	tools: {
		rspack: {
			plugins: [
				tanstackRouter({
					target: 'react',
					disableLogging: true,
					enableRouteTreeFormatting: false
				})
			]
		},
		postcss: (_, { addPlugins }) => void addPlugins(tailwindcss)
	},
	html: {
		title: 'kotlin-react-template',
		favicon: './static/logo.png',
		tags: Boolean.match(process.env['NODE_ENV'] === 'development', {
			onTrue: () => [{ tag: 'script', attrs: { src: 'https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js' } }],
			onFalse: () => []
		})
	}
})
