import { GetTaskProbeData } from 'blender/index.js'
import { BlenderTask } from 'blender/types.js'
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

export type QueueTask = BlenderTask & {
    enabled: boolean
    name: string
    status: QueueTaskStatus
    progress: number
    time: string
    blendFile: string
}

export type QueueContextType = {
    tasks: QueueTask[]
    toggleTaskEnabled: (index: number) => void
    setTaskOutput: (index: number, outputPath: string) => void
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
        const initial = blendFiles.map((blendFile) => ({
            enabled: true,
            name: path.basename(blendFile).split('.')[0],
            status: 'INITIALIZING',
            progress: 0,
            time: '00:00',
            blendFile,
            renderPath: '',
            renderFilename: '',
            renderExtension: '',
            frames: 0,
        })) satisfies QueueTask[]
        setTasks(initial)

        // 2.  Probe sequentially so the UI updates one at a time
        const probeSequentially = async () => {
            for (const blendFile of blendFiles) {
                try {
                    const {
                        frames,
                        renderPath,
                        renderFilename,
                        renderExtension,
                    } = await GetTaskProbeData(blendFile)

                    // mark as QUEUED
                    setTasks((prev): QueueTask[] =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? {
                                      ...t,
                                      status: 'QUEUED',
                                      renderPath,
                                      renderFilename,
                                      renderExtension,
                                      frames,
                                  }
                                : t
                        )
                    )
                } catch {
                    setTasks((prev): QueueTask[] =>
                        prev.map((t) =>
                            t.blendFile === blendFile
                                ? {
                                      ...t,
                                      status: 'FAILED',
                                      renderPath: '',
                                      renderFilename: '',
                                      renderExtension: '',
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

    const setTaskOutput = useCallback((index: number, outputPath: string) => {
        setTasks((prev) =>
            prev.map((task, i) => {
                if (index !== -1 && i !== index) return task

                // If the user ended the path with a trailing separator,
                // treat it as “directory only” — no filename.
                if (outputPath.trim().endsWith(path.sep)) {
                    const cleanDir = outputPath.endsWith(path.sep)
                        ? outputPath
                        : outputPath + path.sep
                    return {
                        ...task,
                        renderPath: cleanDir,
                        renderFilename: '',
                        renderExtension: '',
                    }
                }

                // Otherwise parse path into dir / filename / ext
                const parsed = path.parse(outputPath)

                // Ensure renderPath ends with exactly one separator
                const dirWithSep =
                    parsed.dir && !parsed.dir.endsWith(path.sep)
                        ? parsed.dir + path.sep
                        : parsed.dir

                return {
                    ...task,
                    renderPath: dirWithSep,
                    renderFilename: parsed.name,
                    renderExtension: parsed.ext || '',
                }
            })
        )
    }, [])

    return (
        <QueueContext.Provider
            value={{ tasks, toggleTaskEnabled, setTaskOutput }}
        >
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
