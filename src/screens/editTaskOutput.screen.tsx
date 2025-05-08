import { TextInput } from '@inkjs/ui'
import { Command } from 'components/commandBar.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import { useQueueContext } from 'contexts/queueContext.js'
import { Text } from 'ink'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import { FC, useState } from 'react'

import { defineScreen } from 'router/defineScreen.js'

type Params = { taskIndex: number }

const EditTaskOutputScreen: FC<Params> = ({ taskIndex }) => {
    const { navigate } = useNavigation()
    const icons = useIcons()
    const { setTaskOutput, tasks } = useQueueContext()

    const [value, setValue] = useState(
        tasks[taskIndex]?.outputFile ?? ''
    )

    const handleSubmit = () => {
        setTaskOutput(taskIndex, value)
        navigate('/queue', {})
    }

    const enterCommand: Command = {
        input: (key) => key.return,
        label: icons.enterKey,
        description: 'Confirm',
        action: handleSubmit,
    }

    return (
        <DefaultLayout commands={[enterCommand]}>
            <Text>Change output file:</Text>
            <TextInput onChange={setValue} onSubmit={handleSubmit} defaultValue={value} />
        </DefaultLayout>
    )
}

export default defineScreen('/queue/editTaskOutput', EditTaskOutputScreen)