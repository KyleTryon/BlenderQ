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
    } catch (e) {
        return undefined
    }
}

export const SetConfig = async (config: Config): Promise<void> => {
    try {
        // Await the completion of the file write operation.
        await fsWriteFile(CONFIG_LOCATION, JSON.stringify(config, null, 4))
    } catch (e) {
        console.error(`Failed to write config file: ${e}`)
        throw e // Re-throw the error to propagate it.
    }
}

export const DefaultConfig: Config = {
    nerdFont: false,
}
