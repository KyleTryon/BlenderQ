import { useNavigation } from 'contexts/navContext.js'
import { useTheme } from 'contexts/themeContext.js'
import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { useEffect, useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

const SplashScreen: React.FC = () => {
    const { theme } = useTheme()
    const [seconds, setSeconds] = useState(1)
    const { navigate } = useNavigation()

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (seconds <= 0) {
            navigate('/filePicker', {})
        }
    }, [seconds])

    return (
        <Box
            {...theme.styles.frame()}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Gradient name="rainbow">
                <BigText text="BlenderQ" />
            </Gradient>
            <Text>Starting in... {seconds}</Text>
        </Box>
    )
}

export default defineScreen('/splash', SplashScreen)
