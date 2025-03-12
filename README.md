# Contentstack Entry Reference Fetcher

This project provides functionality for fetching upward (parent) and downward (child) references of an entry within Contentstack CMS. It utilizes asynchronous JavaScript functions to recursively retrieve related content entries, providing comprehensive visibility into the relationships among CMS content items.

## 🚀 Features

- **Fetch upward references**: Retrieve entries that reference the target entry.
- **Fetch downward references**: Retrieve entries referenced within the current entry, recursively exploring embedded references.
- **Recursive Traversal**: Supports deeply nested content structures.
- **Locale Customization**: Easily configurable locale settings.
- **Duplicate Filtering**: Automatic elimination of duplicate entries based on depth.

## 📂 Project Structure

```
.
├── .env                # Environment variables (API Keys, tokens, UIDs)
├── .env.example        # Example configuration (tracked in git)
├── .gitignore          # Git ignored files configuration
├── package.json        # Project dependencies and scripts
└── index.js            # Main functionality to fetch entry references
```

## 🚧 Setup and Installation

**Step 1:** Clone the repository:

```bash
git clone https://github.com/your-repo-url.git
cd your-repo-folder
```

**Step 2:** Install Dependencies

```bash
npm install
```

**Step 3:** Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your Contentstack credentials inside the newly created `.env` file:

```
API_KEY=your_actual_api_key
AUTHORIZATION_TOKEN=your_management_token
ENTRY_UID=entry_uid
CONTENT_TYPE_UID=your_content_type_uid
LOCALE_CODE=en-us
```

## 🚀 Usage

Run the script to fetch and display references:

```bash
npm run fetch-references
```

You can modify the logic in `index.js` to integrate into your application or workflow.

## 🔧 Environment Variables

| Variable               | Description                                   |
|------------------------|-----------------------------------------------|
| `API_KEY`              | Contentstack API Key                           |
| `AUTHORIZATION_TOKEN`  | Contentstack Management Token                  |
| `ENTRY_UID`            | UID of the content entry                       |
| `CONTENT_TYPE_UID`     | UID of the entry’s content type                |
| `LOCALE_CODE`          | Locale code (`en-us`, etc.)                    |

## 📝 Notes

- Ensure your Contentstack API key has the necessary permissions.
- The script defaults to locale `en-us`. Update accordingly if your content uses a different locale.
- Always keep your `.env` file out of source control. Utilize `.env.example` to document required configurations.

## 🚀 Contributing

Feel free to contribute improvements or report issues by opening a GitHub issue or submitting a Pull Request.

## 📚 License

MIT License - see [LICENSE.md](LICENSE) for details.