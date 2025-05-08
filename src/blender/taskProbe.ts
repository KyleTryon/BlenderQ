import * as fs from 'fs'

import { scripts } from './python.js'
import { BlenderTask } from './types.js'
import { execFileAsync } from './utils.js'

export const getTaskProbeData = async (
    blenderExec: string,
    file: string
): Promise<BlenderTask> => {
    if (!fs.existsSync(scripts.taskProbe)) {
        console.error(
            '[getTaskProbeData] task_probe.py not found at',
            scripts.taskProbe
        )
        throw new Error('[getTaskProbeData] task_probe.py not found')
    }

    let stdout: string
    let stderr: string
    try {
        const result = await execFileAsync(
            blenderExec,
            ['-b', file, '--factory-startup', '--python', scripts.taskProbe],
            { maxBuffer: 1 << 20 }
        )
        stdout = result.stdout
        stderr = result.stderr
    } catch (err: any) {
        // execFileAsync throws on non‑zero exit codes; capture stderr if present
        stdout = err?.stdout ?? ''
        stderr = err?.stderr ?? ''
        console.error(
            '[getTaskProbeData] execFileAsync failed – exit code',
            err?.code,
            '\nStderr tail:\n',
            stderr.trim().split('\n').slice(-20).join('\n')
        )
        throw err
    }

    let info: BlenderTask | undefined
    for (const line of stdout.trim().split('\n').reverse()) {
        try {
            info = JSON.parse(line)
            break
        } catch {
            /* keep scanning */
        }
    }

    if (!info) {
        throw new Error(
            `GetTaskProbeData: unable to locate JSON in Blender output:\n${stdout}`
        )
    }

    return {
        frames: info.frames ?? 0,
        renderFilename: info.renderFilename,
        renderExtension: info.renderExtension,
        renderPath: info.renderPath,
    }
}
