import { execFileSync } from 'child_process'
import { promises as fsPromises } from 'fs'
import { constants } from 'fs'
import { platform } from 'os'

export async function GetBlenderPath(): Promise<string> {
    // 1. Explicit env var
    const envPath = process.env.BLENDER_BIN ?? process.env.BLENDER_PATH
    if (envPath && (await isExecutable(envPath))) return envPath

    // 2. In PATH
    try {
        const cmd = platform() === 'win32' ? 'where' : 'which'
        const found = execFileSync(cmd, ['blender'], { encoding: 'utf8' })
            .split(/\r?\n/)[0]
            .trim()
        if (await isExecutable(found)) return found
    } catch {
        /* ignore */
    }
    throw new Error(
        'Blender executable not found.\n' +
            'Install Blender or set BLENDER_BIN environment variable.'
    )
}

async function isExecutable(p: string) {
    try {
        await fsPromises.access(p, constants.X_OK)
        return true
    } catch {
        return false
    }
}
