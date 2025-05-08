import { TextInput } from '@inkjs/ui'
import { Command } from 'components/commandBar.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import { Text } from 'ink'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import { useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

const GoToScreen: React.FC = () => {
    const navigate = useNavigation()
    const [value, setValue] = useState('')
    const icons = useIcons()

    const handleSubmit = () => {
        navigate.navigate('/filePicker', {
            dir: value,
        })
    }

    const enterCommand: Command = {
        input: (key) => key.return,
        label: icons.enterKey,
        description: 'Enter directory',
        action: () => {},
    }

    return (
        <DefaultLayout commands={[enterCommand]}>
            <Text>Enter a directory to navigate to:</Text>
            <TextInput onSubmit={handleSubmit} onChange={setValue} />
        </DefaultLayout>
    )
}

export default defineScreen('/filePicker/goTo', GoToScreen)
