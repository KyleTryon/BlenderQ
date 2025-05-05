import { Command as Commander } from 'commander'
import { render } from 'ink'

import pJSON from '../package.json' with { type: 'json' }
import { AppRouter, RouteKey } from './router.js'

const program = new Commander()
program
    .version(pJSON.version)
    .option('-z, --skip-splash', 'Skip splash screen')
    .option('-d, --dir <dir>', 'Set the directory to start in')

program.parse(process.argv, { from: 'node' })
const options = program.opts()

let route: RouteKey = '/splash'
let props: any = {}

if (options.help) {
    program.outputHelp()
    process.exit(0)
} else if (options.dir) {
    route = '/filePicker'
    props = { dir: options.dir }
} else if (options.skipSplash) {
    route = '/filePicker'
}

render(<AppRouter route={route} params={props} />)
