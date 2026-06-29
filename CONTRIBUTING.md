# Contributing to TVDex

Thank you for your interest in contributing to TVDex! 🎉

## 🚀 Adding a New Platform

The most impactful contribution you can make is adding channel data for a new DTH/cable platform. Here's how:

### 1. Prepare the JSON File

Create a JSON file in the `assets/` directory following this naming convention:

```
assets/<platform_id>_channels.json
```

Examples:
- `assets/airtel_dth_channels.json`
- `assets/tataplay_channels.json`
- `assets/dishtv_channels.json`

### 2. JSON Schema

Each channel object must have the following fields:

```json
{
  "id": "unique-uuid-v4",
  "channel_number": 123,
  "channel_name": "Channel Name",
  "genre": "Entertainment",
  "language": "Hindi"
}
```

**Rules:**
- `id` — Use UUID v4 format. You can generate them using Python: `import uuid; str(uuid.uuid4())`
- `channel_number` — Integer. The LCN (Logical Channel Number) as assigned by the platform.
- `channel_name` — String. The official channel name.
- `genre` — String. Use one of the existing genres if applicable:
  - `Entertainment`, `Movies`, `Comedy`, `News`, `Business News`, `Kids`, `Infotainment`, `Educational`, `Devotional`, `Sports`, `Music`, `Lifestyle`
- `language` — String. The primary broadcast language.

### 3. Sort the File

The JSON array should be sorted by `channel_number` in ascending order.

### 4. Copy to Public

Also copy the file to `public/data/` so it can be served statically:

```bash
cp assets/<platform_id>_channels.json public/data/<platform_id>_channels.json
```

### 5. Update the Data Layer

Update `src/lib/channels.ts` to support loading data for the new platform.

### 6. Submit a Pull Request

- Fork the repository
- Create a branch: `git checkout -b add-<platform-name>`
- Commit your changes: `git commit -m "feat: add <platform-name> channel data"`
- Push: `git push origin add-<platform-name>`
- Open a Pull Request

## 🐛 Bug Reports

Found a missing channel or incorrect data? Open an issue with:
- The platform name
- The channel name and number
- The correct information (if known)
- Source/reference for the correct data

## 🎨 UI/UX Improvements

We're always looking to improve the user experience. Feel free to:
- Suggest new features via GitHub Issues
- Submit PRs for UI improvements
- Fix responsive design issues
- Improve accessibility

## 📝 Code Style

- TypeScript with strict mode
- Tailwind CSS for styling
- Next.js App Router conventions
- Meaningful commit messages (use conventional commits)

## 🧪 Before Submitting

```bash
# Make sure the build passes
npm run build

# Run the linter
npm run lint
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the GNU GPL v3.0 License.
