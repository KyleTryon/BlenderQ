import { FC } from 'react'

const modules = import.meta.glob('./../screens/**/*.screen.tsx', {
    eager: true,
}) as Record<string, { default: { route: string; component: FC<any> } }>

const modulePaths = Object.keys(modules)
if (modulePaths.length === 0) {
    console.error(
        '⚠️  import.meta.glob matched zero .screen.tsx files ‑ check the glob pattern and Vite root.'
    )
}

/**
 * 2.  Build a route → component map
 */
const routeEntries = Object.values(modules).map(
    (m) => [m.default.route, m.default.component] as const
)
export const routes = Object.fromEntries(routeEntries) as {
    [K in (typeof routeEntries)[number] as K[0]]: K[1]
}
