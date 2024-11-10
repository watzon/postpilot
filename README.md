<div align="center">
  <img src="frontend/src/assets/images/logo.svg" alt="PostPilot Logo" width="200" height="200" />
  <h1>PostPilot</h1>
  <p><em>A sleek local SMTP testing environment for developers</em></p>
</div>

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

### Roadmap

For a comprehensive list of features and future plans, see the roadmap on [the project's website](https://postpilot.watzon.tech/roadmap).

## Development

To get started with development:

1. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install Go dependencies
go mod tidy
```

2. Run in development mode:
```bash
wails dev
```

This will start the development server with hot reload support.

## Building

To build a production version:

```bash
wails build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Laravel Herd's mail panel
- Built with [Wails](https://wails.io/)
- Uses [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)