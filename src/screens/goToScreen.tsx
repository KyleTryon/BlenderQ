import { Text } from 'ink'
import { ScreenComponent } from './types.js'
import { TextInput } from '@inkjs/ui'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import { useState } from 'react'

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
