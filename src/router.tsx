import { createContext, FC, useContext, useState } from 'react'

import { Screens } from './screens/index.js'
import { ThemeProvider } from './theme/theme.js'
import { IconsProvider } from './utils/icons.js'

export type RouteKey = '/splash' | '/filePicker' | '/filePicker/goTo' | '/queue'

export type RouteParams = {
    '/splash': {}
    '/filePicker': { dir?: string }
    '/filePicker/goTo': {}
    '/queue': { blendFiles: string[] }
}

type NavigationContextType = {
    route: RouteKey
    params: RouteParams[RouteKey]
    navigate: <K extends RouteKey>(route: K, params: RouteParams[K]) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)
export const useNavigation = () => useContext(NavigationContext)!

const routes: {
    [K in RouteKey]: FC<
        RouteParams[K] & { navigate: NavigationContextType['navigate'] }
    >
} = {
    '/splash': Screens.splash,
    '/filePicker': Screens.filePicker,
    '/filePicker/goTo': Screens.goTo,
    '/queue': Screens.queue,
}

export const AppRouter: FC<{
    route: RouteKey
    params?: RouteParams[RouteKey]
}> = ({ route, params }) => {
    const [state, setState] = useState<{
        route: RouteKey
        params: RouteParams[RouteKey]
    }>({
        route,
        params: (params ?? {}) as RouteParams[typeof route],
    })

    const navigate = <K extends RouteKey>(route: K, params: RouteParams[K]) => {
        setState({ route, params })
    }

    const Screen = routes[state.route] as FC<
        RouteParams[typeof state.route] & { navigate: typeof navigate }
    >

    return (
        <NavigationContext.Provider value={{ ...state, navigate }}>
            <IconsProvider style="utf">
                <ThemeProvider variant="normal">
                    <Screen {...state.params} navigate={navigate} />
                </ThemeProvider>
            </IconsProvider>
        </NavigationContext.Provider>
    )
}
