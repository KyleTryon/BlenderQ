import * as fs from 'fs'
import { promisify } from 'util'

const fsWriteFile = promisify(fs.writeFile)

const CONFIG_LOCATION = `${process.env.HOME}/.blenderq.config.json`

export type Config = {
    nerdFont: boolean
}

export const GetConfig = async (): Promise<Config | undefined> => {
    try {
        // Read the config file contents directly
        const data = await fs.promises.readFile(CONFIG_LOCATION, 'utf-8')
        return JSON.parse(data) as Config
    } catch (e: any) {
        // Only return undefined if file does not exist
        if (e.code === 'ENOENT') {
            return undefined
        }
        // For other errors, rethrow
        throw e
    }
}

export const SetConfig = async (config: Config): Promise<void> => {
    try {
        // Await the completion of the file write operation.
        await fsWriteFile(CONFIG_LOCATION, JSON.stringify(config, null, 4))
    } catch (err) {
        throw err // Re-throw the error to propagate it.
    }
}

export const DefaultConfig: Config = {
    nerdFont: false,
}
