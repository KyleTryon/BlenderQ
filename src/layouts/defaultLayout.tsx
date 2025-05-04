import { Box } from 'ink'

import { Command, CommandBar, quitCommand } from '../components/commandBar.js'
import { useTheme } from '../theme/theme.js'

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
            <CommandBar commands={[quitCommand, ...(commands ?? [])]} />
        </>
    )
}
