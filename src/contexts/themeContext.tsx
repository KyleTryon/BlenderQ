import React, { createContext, ReactNode, useContext } from 'react'
import { themeFactory, Variant } from 'theme/theme.js'

type ThemeContextValue = {
    variant: Variant
    setVariant: (v: Variant) => void
    theme: ReturnType<typeof themeFactory>
}

const ThemeContext = createContext<ThemeContextValue>({
    variant: 'normal',
    setVariant: () => {},
    theme: themeFactory('normal'),
})

export const ThemeProvider = ({
    children,
    variant = 'normal',
}: {
    variant?: Variant
    children: ReactNode
}) => {
    const [currentVariant, setVariant] = React.useState<Variant>(variant)
    const theme = React.useMemo(
        () => themeFactory(currentVariant),
        [currentVariant]
    )

    return (
        <ThemeContext.Provider
            value={{ variant: currentVariant, setVariant, theme }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
export default themeFactory
