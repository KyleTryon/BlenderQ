import { ComponentTheme } from '@inkjs/ui'
import { BoxProps, TextProps } from 'ink'

type Color =
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'gray'
    | 'grey'
    | 'blackBright'
    | 'redBright'
    | 'greenBright'
    | 'yellowBright'
    | 'blueBright'
    | 'magentaBright'
    | 'cyanBright'
    | 'whiteBright'

export const variants = {
    normal: {
        primary: 'blue' as Color,
        secondary: 'magenta' as Color,
        accent: 'cyan' as Color,
        primaryBorder: 'blue' as Color,
        footerBorder: 'magenta' as Color,
    },
} as const

export type Variant = keyof typeof variants

export const themeFactory = (variant: Variant = 'normal') =>
    ({
        styles: {
            container: (): BoxProps => ({
                gap: 1,
                flexGrow: 1,
                borderStyle: 'round',
                borderColor: variants[variant].primaryBorder,
                padding: 1,
            }),
            frame: (): BoxProps => ({
                borderStyle: 'round',
                borderColor: variants[variant].primaryBorder,
                padding: 1,
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                flexGrow: 1,
            }),
            footer: (): BoxProps => ({
                borderStyle: 'round',
                borderColor: variants[variant].footerBorder,
                paddingX: 1,
                width: '100%',
                flexDirection: 'row',
                gap: 3,
            }),
            primaryText: (): TextProps => ({
                color: variants[variant].primary,
            }),
            secondaryText: (): TextProps => ({
                color: variants[variant].secondary,
            }),
        },
    }) satisfies ComponentTheme
