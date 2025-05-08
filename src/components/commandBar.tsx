import { useIcons } from 'contexts/iconsContext.js'
import { useTheme } from 'contexts/themeContext.js'
import { Box, Key, Text, useInput } from 'ink'
import React from 'react'

type Command = {
    input: string | ((key: Key) => boolean)
    label: string
    description: string
    action: () => void
}

type Props = {
    commands: Command[]
}

const CommandBar: React.FC<Props> = ({ commands }) => {
    const { theme } = useTheme()
    const icons = useIcons()
    const allCommands = [quitCommand(icons), ...commands]

    useInput((input, key) => {
        const matched = allCommands.find((cmd) => {
            if (typeof cmd.input === 'function') {
                return cmd.input(key)
            } else if (typeof cmd.input === 'string') {
                return cmd.input.toLowerCase() === input.toLowerCase()
            }
            return false
        })
        if (matched) {
            matched.action()
        }
    })

    return (
        <Box {...theme.styles.footer()}>
            {allCommands.map(({ label, description }, idx) => (
                <Text key={idx}>
                    {label} {description}
                </Text>
            ))}
        </Box>
    )
}

const quitCommand = (icons: ReturnType<typeof useIcons>): Command => ({
    input: (key) => key.escape,
    label: icons.quit,
    description: 'Quit',
    action: () => process.exit(),
})

export { CommandBar, quitCommand }
export type { Command }
