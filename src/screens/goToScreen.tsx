import { TextInput } from '@inkjs/ui'
import { Text } from 'ink'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import { useState } from 'react'

import { ScreenComponent } from './types.js'

export const GoToScreen: React.FC<ScreenComponent> = ({ navigate }) => {
    const [value, setValue] = useState('')

    const handleSubmit = () => {
        navigate('/filePicker', { dir: value })
    }

    return (
        <DefaultLayout>
            <Text>Enter a directory to navigate to:</Text>
            <TextInput onSubmit={handleSubmit} onChange={setValue} />
        </DefaultLayout>
    )
}
