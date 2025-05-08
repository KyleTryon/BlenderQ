import {
    createContext,
    type FC,
    type PropsWithChildren,
    useCallback,
    useContext,
    useState,
} from 'react'
import { NavigateFn, RouteKey, RouteParams } from 'router/types.js'

type NavState<K extends RouteKey = RouteKey> = {
    route: K
    params: RouteParams<K>
}

type Ctx = NavState & {
    navigate: NavigateFn
}

const Nav = createContext<Ctx | null>(null)

export const NavProvider: FC<
    PropsWithChildren<{ initialRoute: RouteKey; initialParams: any }>
> = ({ initialRoute, initialParams, children }) => {
    const [state, setState] = useState<NavState>({
        route: initialRoute,
        params: initialParams,
    })

    const navigate: NavigateFn = useCallback((route, params) => {
        setState({ route, params })
    }, [])

    return (
        <Nav.Provider value={{ ...state, navigate }}>{children}</Nav.Provider>
    )
}

export const useNavigation = () => {
    const ctx = useContext(Nav)
    if (!ctx) {
        throw new Error('useNavigation must be used within NavProvider')
    }
    return ctx
}
