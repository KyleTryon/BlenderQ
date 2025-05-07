/// <reference types="vite/client" />
import { createContext, FC, useCallback, useContext, useState } from 'react'
import { Icons, IconsProvider } from 'utils/icons.js'

/**
 * 1.  Eager-import all *.screen.tsx files at startup
 * (Vite rewrites these to proper ESM paths in build)
 */
const modules = import.meta.glob('./../screens/**/*.screen.tsx', {
    eager: true,
}) as Record<string, { default: { route: string; component: FC<any> } }>
// DEBUG ────────────────────────────────────────────────────────────
const modulePaths = Object.keys(modules)
console.log(
    'import.meta.glob matched',
    modulePaths.length,
    'screen modules:',
    modulePaths
)
if (modulePaths.length === 0) {
    console.error(
        '⚠️  import.meta.glob matched zero .screen.tsx files ‑ check the glob pattern and Vite root.'
    )
}
// ──────────────────────────────────────────────────────────────────

/**
 * 2.  Build a route → component map
 */
const routeEntries = Object.values(modules).map(
    (m) => [m.default.route, m.default.component] as const
)
export const routes = Object.fromEntries(routeEntries) as {
    [K in (typeof routeEntries)[number] as K[0]]: K[1]
}

/**
 * 3.  Derive helper types
 */
export type RouteKey = keyof typeof routes

export type RouteParams<K extends RouteKey> =
    Parameters<(typeof routes)[K]>[0] extends Record<string, unknown>
        ? Parameters<(typeof routes)[K]>[0]
        : never

/**
 * 4.  Navigation context
 */
type NavigateFn = <K extends RouteKey>(route: K, params: RouteParams<K>) => void

type Ctx = {
    route: RouteKey
    params: RouteParams<RouteKey>
    navigate: NavigateFn
}
const Nav = createContext<Ctx | null>(null)
export const useNavigation = () => useContext(Nav)!

/**
 * 5.  Router component
 */
export const AppRouter: FC<{ initialRoute: RouteKey; initialParams: any }> = ({
    initialRoute: initial,
    initialParams,
}) => {
    const [state, set] = useState<{ route: RouteKey; params: any }>({
        route: initial,
        params: initialParams,
    })

    const navigate: NavigateFn = useCallback((route, params) => {
        console.log('🧭 navigate()', { route, params })
        set({ route, params })
    }, [])

    const Screen = routes[state.route] as
        | FC<RouteParams<typeof state.route>>
        | undefined
    if (!Screen) {
        throw new Error(`No screen found for route: ${state.route}`)
    }
    return (
        <Nav.Provider value={{ ...state, navigate }}>
            <IconsProvider style="utf">
                <Screen {...state.params} />
            </IconsProvider>
        </Nav.Provider>
    )
}
