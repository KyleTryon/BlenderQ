/// <reference types="vite/client" />
import { IconsProvider } from 'contexts/iconsContext.js'
import { NavProvider, useNavigation } from 'contexts/navContext.js'
import { ThemeProvider } from 'contexts/themeContext.js'
import { FC } from 'react'

import { routes } from './registerRoutes.js'
import { AppRouterProps, RouteParams } from './types.js'

/** Renders whichever screen the navigation context says is current. */
const CurrentScreen: FC = () => {
    const { route, params } = useNavigation()
    const Screen = routes[route] as FC<RouteParams<typeof route>> | undefined

    if (!Screen) {
        throw new Error(`No screen found for route: ${route}`)
    }

    return <Screen {...params} />
}

/** Top‑level router that seeds the NavProvider with the initial route
 *  and provides the global ThemeProvider.
 */
export const AppRouter: FC<AppRouterProps> = ({
    initialRoute,
    initialParams,
}) => (
    <ThemeProvider>
        <NavProvider initialRoute={initialRoute} initialParams={initialParams}>
            <IconsProvider style="utf">
                <CurrentScreen />
            </IconsProvider>
        </NavProvider>
    </ThemeProvider>
)
