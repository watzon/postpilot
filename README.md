<div align="center">
  <img src="frontend/src/assets/images/logo.svg" alt="PostPilot Logo" width="200" height="200" />
  <h1>PostPilot</h1>
  <p><em>A sleek local SMTP testing environment for developers</em></p>
</div>

[![Go Report Card](https://goreportcard.com/badge/github.com/watzon/postpilot)](https://goreportcard.com/report/github.com/watzon/postpilot)
[![Packaging status](https://repology.org/badge/tiny-repos/postpilot.svg)](https://repology.org/project/postpilot/versions)

## ⚠️ Alpha Status

PostPilot is currently in alpha. While the core functionality is working, you may encounter bugs or missing features. Use in development environments only.

<div align="center">
  <img src=".github/screenshot.png" alt="PostPilot Screenshot" width="90%" />
</div>

## About

PostPilot is a developer tool inspired by Laravel Herd's mail panel, designed to simplify email testing during development. It provides a local SMTP server that captures outgoing emails and displays them in a modern, user-friendly interface.

## Features

### Current
- 📬 Local SMTP server for email testing
- 🎨 Modern, responsive UI built with React and Tailwind CSS
- 🌓 Light/Dark mode support
- 📱 Preview emails in different formats (HTML, Text, Raw)
- 🔍 Basic search capabilities

### Installation

If you're on Linux or Windows you can go check out the [releases page](https://github.com/watzon/postpilot/releases) and download the binary for your platform. As I don't yet have a Windows signing certificate, Windows users will have to skip past the scary "This software may harm your computer" warning, or build from source using the below instructions.

Arch users can install PostPilot from the AUR:

```bash
yay -S postpilot-bin
```

Distro packaging is sparse right now, but you can help with that!

[![Packaging status](https://repology.org/badge/vertical-allrepos/postpilot.svg)](https://repology.org/project/postpilot/versions)

## Building from source


1. Clone the repository
   ```bash
   git clone https://github.com/watzon/postpilot.git
   ```

2. Install dependencies
   ```bash
   make dep
   ```

3. Build the project
   ```bash
   make build
   ```

The binary will be located in the `build/bin` directory.

## Development

Development requires the Wails CLI, which you can install with:

```bash
go install github.com/wailsapp/wails/v3/cmd/wails@latest
```

Then run the following command to start the development server:

```bash
wails dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Laravel Herd's mail panel
- Built with [Wails](https://wails.io/)
- Uses [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
