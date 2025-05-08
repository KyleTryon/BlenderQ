import { TextInput } from '@inkjs/ui'
import { Command } from 'components/commandBar.js'
import { useIcons } from 'contexts/iconsContext.js'
import { useNavigation } from 'contexts/navContext.js'
import { useQueueContext } from 'contexts/queueContext.js'
import { Box, Text } from 'ink'
import { DefaultLayout } from 'layouts/defaultLayout.js'
import { FC, useState } from 'react'
import { defineScreen } from 'router/defineScreen.js'

type Params = { taskIndex: number }

// Define the available variables with their types and descriptions.  This is KEY.
interface PathVariables {
    HOME: string
    NAME: string
    FRAME_COUNT: number
    DATE: string
    DATE_EX: string
    EPOCH: string
    TASK_INDEX: number
    EXT: string
    [key: string]: string | number // Add this index signature
}

const variableDefinitions: {
    [key in keyof PathVariables]: { description: string }
} = {
    HOME: { description: "The user's home directory." },
    NAME: { description: 'The name of the task.' },
    FRAME_COUNT: { description: 'The number of frames in the task.' },
    DATE: { description: 'The current date (local format).' },
    DATE_EX: { description: 'The current date (ISO format).' },
    EPOCH: { description: 'The current Unix timestamp.' },
    TASK_INDEX: { description: 'The index of the task in the queue.' },
    EXT: { description: 'The file extension of the output file.' },
}

const EditTaskOutputScreen: FC<Params> = ({ taskIndex }) => {
    const { navigate } = useNavigation()
    const icons = useIcons()
    const { setTaskOutput, tasks } = useQueueContext()
    // If a single task is being edited, pre‑fill the existing output path.
    // When editing all tasks (taskIndex === -1) or if the index is invalid, start with a blank value.
    const outputFile =
        taskIndex !== -1 && tasks[taskIndex]
            ? `${tasks[taskIndex].renderPath ?? ''}${tasks[taskIndex].renderFilename ?? ''}${tasks[taskIndex].renderExtension ?? ''}`
            : ''

    const [value, setValue] = useState(outputFile ?? '')

    function resolveTemplate(
        template: string,
        vars: Record<string, string | number>
    ): string {
        return template.replace(/\$\{([A-Z_]+)\}/g, (_, key) =>
            String(vars[key] ?? `{${key}}`)
        )
    }

    const handleSubmit = () => {
        // Helper to build vars per task
        const buildVars = (
            task: (typeof tasks)[0],
            idx: number
        ): PathVariables => ({
            HOME: process.env.HOME ?? '',
            NAME: task.name ?? '',
            FRAME_COUNT: task.frames ?? 0,
            DATE: new Date().toLocaleDateString(),
            DATE_EX: new Date().toISOString(),
            EPOCH: Math.floor(Date.now() / 1000).toString(),
            TASK_INDEX: idx,
            EXT: task.renderExtension ?? '',
        })

        if (taskIndex === -1) {
            // Apply to all tasks
            tasks.forEach((task, i) => {
                const vars = buildVars(task, i)
                const resolved = resolveTemplate(value, vars)
                setTaskOutput(i, resolved)
            })
        } else {
            // Apply to single task
            const task = tasks[taskIndex]
            if (task) {
                const vars = buildVars(task, taskIndex)
                const resolved = resolveTemplate(value, vars)
                setTaskOutput(taskIndex, resolved)
            }
        }
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
            <Text>Change output path:</Text>
            <TextInput
                onChange={setValue}
                onSubmit={handleSubmit}
                defaultValue={value ?? undefined}
                placeholder="/output/path/"
            />
            <Box
                flexDirection="column"
                borderColor={'yellow'}
                borderStyle={'round'}
            >
                <Text>Available Variables:</Text>
                {Object.entries(variableDefinitions).map(
                    ([key, { description }]) => (
                        <Text key={key}>
                            <Text color="green">${`{${key}}`}</Text> -{' '}
                            {description}
                        </Text>
                    )
                )}
                <Text>
                    Example:{' '}
                    <Text color="cyan">
                        /output/${`{NAME}`}_${`{TASK_INDEX}`}/
                    </Text>
                </Text>
            </Box>
        </DefaultLayout>
    )
}

export default defineScreen('/queue/editTaskOutput', EditTaskOutputScreen)
