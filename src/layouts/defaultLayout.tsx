import { Command, CommandBar } from 'components/commandBar.js'
import { useTheme } from 'contexts/themeContext.js'
import { Box } from 'ink'

type DefaultLayoutProps = {
    children: React.ReactNode
    commands?: Command[]
}
export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
    children,
    commands,
}) => {
    const { theme } = useTheme()
    return (
        <>
            <Box {...theme.styles.frame()}>{children}</Box>
            <CommandBar commands={[...(commands ?? [])]} />
        </>
    )
}
