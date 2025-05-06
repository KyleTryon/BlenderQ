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
            '[getTaskProbeData] taskProbe.py not found at',
            scripts.taskProbe
        )
        throw new Error('[getTaskProbeData] taskProbe.py not found')
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

    /**
     * Blender writes a lot of startup logs to stdout before our Python
     * script prints its JSON summary.  Scan lines from the end until one
     * parses as JSON.
     */
    let info: any | undefined
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
        outputFile: info.outputFile,
        frames: info.frames,
    }
}
