import { useNavigation } from 'contexts/navContext.js'
import { Box, Text, useInput } from 'ink'
import { defineScreen } from 'router/defineScreen.js'
import { Config, SetConfig } from 'utils/config.js'
import { Icons } from 'utils/icons.js'

const ConfigScreen: React.FC = () => {
    let config: Config
    const { navigate } = useNavigation()
    useInput((input) => {
        const key = input.toLowerCase()
        if (key === 'y') {
            config = {
                nerdFont: true,
            }
            SetConfig(config)
        } else if (key === 'n') {
            config = {
                nerdFont: false,
            }
            SetConfig(config)
        }
        navigate('/splash', {})
    })
    return (
        <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight={16}
        >
            <Text>Do you see a Blender logo?</Text>
            <Text>
                {'>>>'} {Icons.blenderFile.utf} {'<<<'}
            </Text>
            <Text>
                Press [y] if you see the icon, or [n] if you don&apos;t.
            </Text>
        </Box>
    )
}

export default defineScreen('/config', ConfigScreen)
