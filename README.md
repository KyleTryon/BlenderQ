# BlenderQ

BlenderQ is a terminal UI (TUI) tool for managing a queue of local Blender renders. Add a collection of `.blend` files to a queue and monitor their progress from the terminal.

**⚠️ _Still in Beta!_**: This project is in its early stages and may have bugs or incomplete features. Please report any issues you encounter.

![Demo](https://raw.githubusercontent.com/KyleTryon/BlenderQ/main/.github/img/demo.gif)

## Features

- Interactive terminal interface using Ink
- Theme support
- Queue and render multiple `.blend` files
- Simple navigation and status tracking

## Prerequisites

- Node.js (v20+)
- Blender (v3.5+)
- [Nerd Fonts](https://www.nerdfonts.com/) (for the icons)

## Installation

Install the BlenderQ CLI globally using npm or pnpm:

```bash
npm install -g blenderq
# or
pnpm add -g blenderq
```

## Usage

```
Usage: blenderq [options]

Options:
  -V, --version           output the version number
  -z, --skip-splash       Skip splash screen
  -d, --dir <dir>         Set the directory to start in
  -b, --blend <blend...>  Set the blend files to open
  -h, --help              display help for command
```

## Why Node.js instead of Python or Go?

I chose Node.js (TypeScript) primarily because it’s where my strengths lie, and I needed to quickly deliver a functional, maintainable TUI. Python and Go were attractive options, but they lacked pre-built components that matched my requirements, which would have significantly increased development time. Additionally, React-inspired design patterns in Ink made Node.js especially appealing for building clean, responsive terminal UIs. While I may explore Python in the future to integrate more directly with Blender, Node.js allowed me to efficiently ship something that works right now.

## Example

### Add a collection of .blend files to the queue

```bash
blenderq --blend /path/to/file1.blend /path/to/file2.blend
```

### Manually search for .blend files from directory

```bash
blenderq --dir /path/to/directory
```
