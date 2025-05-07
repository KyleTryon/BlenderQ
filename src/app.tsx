import { Command as Commander } from 'commander'
import { render } from 'ink'

import pJSON from '../package.json' with { type: 'json' }
import { AppRouter, RouteKey } from './router/index.js'

const program = new Commander()
program
    .version(pJSON.version)
    .option('-z, --skip-splash', 'Skip splash screen')
    .option('-d, --dir <dir>', 'Set the directory to start in')
    .option('-b, --blend <blend...>', 'Set the blend files to open')

// Parse only the user args (ignore Vite-node flags and script path)
program.parse(process.argv.slice(2), { from: 'user' })
const options = program.opts()

let route: RouteKey = '/splash'
let props: any = {}

if (options.help) {
    program.outputHelp()
    process.exit(0)
} else if (options.blend) {
    route = '/queue'
    props = {
        blendFiles: options.blend,
    }
} else if (options.dir) {
    route = '/filePicker'
    props = { dir: options.dir }
} else if (options.skipSplash) {
    route = '/filePicker'
}

render(<AppRouter initialRoute={route} initialParams={props} />)
