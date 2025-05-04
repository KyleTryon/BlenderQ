import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import React, { useEffect, useState } from 'react'

import { useTheme } from '../theme/theme.js'
import { ScreenComponent } from './types.js'

const SplashScreen: React.FC<ScreenComponent> = ({ navigate }) => {
    const { theme } = useTheme()
    const [seconds, setSeconds] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (seconds <= 0) {
            navigate('/filePicker')
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

export { SplashScreen }
