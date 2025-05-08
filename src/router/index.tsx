/// <reference types="vite/client" />
import { IconsProvider } from 'contexts/iconsContext.js'
import { NavProvider, useNavigation } from 'contexts/navContext.js'
import { QueueProvider } from 'contexts/queueContext.js'
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

const RoutedLayers: FC = () => {
    const { route, params } = useNavigation()

    // Only initialise queue when we’re on the queue route
    const blendFiles =
        route === '/queue' && Array.isArray((params as any).blendFiles)
            ? (params as any).blendFiles
            : undefined

    return (
        <QueueProvider blendFiles={blendFiles}>
            <CurrentScreen />
        </QueueProvider>
    )
}

/** Top‑level router that seeds the NavProvider with the initial route
 *  and provides the global ThemeProvider.
 */
export const AppRouter: FC<AppRouterProps> = ({
    initialRoute,
    initialParams,
    config,
}) => (
    <ThemeProvider>
        <IconsProvider style={config.nerdFont ? 'utf' : 'emoji'}>
            <NavProvider
                initialRoute={initialRoute}
                initialParams={initialParams}
            >
                <RoutedLayers />
            </NavProvider>
        </IconsProvider>
    </ThemeProvider>
)
