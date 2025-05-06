# BlenderQ

BlenderQ is a terminal UI (TUI) tool for managing a queue of local Blender renders. Add a collection of `.blend` files to a queue and monitor their progress from the terminal.

**⚠️ _Still in development!_** This is a work in progress and not yet ready for use.

![Demo](.github/img/demo.gif)

## Features

- Interactive terminal interface using Ink
- Theme support
- Queue and render multiple `.blend` files
- Simple navigation and status tracking

## Prerequisites

- Node.js (v20+)
- [Nerd Fonts](https://www.nerdfonts.com/) (for the icons)

## Usage

```
Usage: app [options]

Options:
  -V, --version      output the version number
  -z, --skip-splash  Skip splash screen
  -d, --dir <dir>    Set the directory to start in
  -h, --help         display help for command

```

## Why Node.js instead of Python?

I’m more comfortable working in TypeScript, and it let me build something functional and maintainable faster than if I had done it in Python. I might eventually port it to Python to tie into Blender more directly, and likely use less resources.

## Getting Started

Make sure you have Blender installed and available in your system path.

```bash
pnpm install
pnpm dev
```
