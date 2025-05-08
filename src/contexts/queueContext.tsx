import { GetTaskProbeData } from 'blender/index.js'
import path from 'path'
import {
    createContext,
    type FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

export type QueueTaskStatus =
    | 'INITIALIZING'
    | 'QUEUED'
    | 'RUNNING'
    | 'COMPLETED'
    | 'FAILED'

export type QueueTask = {
    enabled: boolean
    name: string
    status: QueueTaskStatus
    progress: number
    time: string
    blendFile: string
    outputFile: string
    frames: number
}

export type QueueContextType = {
    tasks: QueueTask[]
    toggleTaskEnabled: (index: number) => void
}

export const QueueContext = createContext<QueueContextType | undefined>(
    undefined
)

export const QueueProvider: FC<{
    blendFiles?: string[]
    children: React.ReactNode
}> = ({ blendFiles, children }) => {
    const [tasks, setTasks] = useState<QueueTask[]>([])

    useEffect(() => {
        if (
            !Array.isArray(blendFiles) ||
            blendFiles.length === 0 ||
            tasks.length
        )
            return

        // 1.  Initialise every task as "INITIALIZING"
        const initial: QueueTask[] = blendFiles.map((blendFile) => ({
            enabled: true,
            name: path.basename(blendFile).split('.')[0],
            status: 'INITIALIZING',
            progress: 0,
            time: '00:00',
            blendFile,
            outputFile: '',
            frames: 0,
        }))
        setTasks(initial)

        // 2.  Probe sequentially so the UI updates one at a time
        const probeSequentially = async () => {
            for (const blendFile of blendFiles) {
                try {
                    const { outputFile, frames } =
                        await GetTaskProbeData(blendFile)

                    // mark as QUEUED
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? { ...t, status: 'QUEUED', outputFile, frames }
                                : t
                        )
                    )
                } catch {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? {
                                      ...t,
                                      status: 'FAILED',
                                      outputFile: '',
                                      frames: 0,
                                  }
                                : t
                        )
                    )
                }
            }
        }

        probeSequentially()
    }, [blendFiles])

    const toggleTaskEnabled = useCallback((index: number) => {
        setTasks((prev) =>
            prev.map((task, i) =>
                i === index ? { ...task, enabled: !task.enabled } : task
            )
        )
    }, [])

    return (
        <QueueContext.Provider value={{ tasks, toggleTaskEnabled }}>
            {children}
        </QueueContext.Provider>
    )
}

export const useQueueContext = () => {
    const context = useContext(QueueContext)

    if (!context) {
        throw new Error('useQueueContext must be used within a QueueProvider')
    }
    return context
}
