
import { runTaskRender } from './render.js'
import { getTaskProbeData } from './taskProbe.js'
import { BlenderTask } from './types.js'
import { QueueTask } from 'contexts/queueContext.js'
import { GetBlenderPath } from './utils.js'

export async function GetTaskProbeData(file: string): Promise<BlenderTask> {
    const blenderExec = await GetBlenderPath()
    return getTaskProbeData(blenderExec, file)
}


export async function RunTaskRender(blendFile: string, task: QueueTask, onProgress: (pct: number) => void): Promise<'DONE'> {
    const blenderExec = await GetBlenderPath()
    return runTaskRender(blenderExec, blendFile, task, onProgress)
}
