// src/router/defineScreen.ts
import { FC } from 'react'
export function defineScreen<const Path extends string, Props>(
    route: Path,
    component: FC<Props>
) {
    return { route, component }
}
