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
const props: any = {}

switch (true) {
    case !!options.help:
        program.outputHelp()
        process.exit(0)

    case !!options.dir:
        route = '/filePicker'
        props.dir = options.dir
        break

    case !!options.skipSplash:
        route = '/filePicker'
        break

    default:
        route = '/splash'
}

const EntryPoint = () => AppRouter(route, props)
render(<EntryPoint />)
