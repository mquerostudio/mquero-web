# Strapi to Markdown Converter

This script converts a Strapi database export (JSON format) into Markdown files. It handles both articles and projects, preserving their structure, formatting, and images.

## Features

- Converts Strapi articles and projects to Markdown files
- Maintains text formatting (bold, italic, etc.)
- Downloads and includes images locally
- Preserves links
- Supports both English and Spanish content
- Organizes content by type (articles/projects) and language
- Creates a clean folder structure for each article/project

## Requirements

- Python 3.6+
- Internet connection for downloading images

## Usage

1. Make sure your Strapi database export file is located at `backend/strapi-db.json`
2. Run the script:

```bash
python strapi_to_markdown.py
```

3. The converted Markdown files will be saved in the `markdown_export` folder

## Output Structure

```
markdown_export/
├── articles/
│   ├── en/
│   │   └── article-name/
│   │       ├── images/
│   │       │   └── image-1.jpg
│   │       └── index.md
│   └── es/
│       └── article-name/
│           ├── images/
│           │   └── image-1.jpg
│           └── index.md
└── projects/
    ├── en/
    │   └── project-name/
    │       ├── images/
    │       │   └── image-1.jpg
    │       └── index.md
    └── es/
        └── project-name/
            ├── images/
            │   └── image-1.jpg
            └── index.md
```

## Markdown Format

Each Markdown file includes:

- YAML frontmatter with metadata (title, description, date, locale, tags)
- Main content with proper Markdown formatting
- Images with captions
- Links with proper Markdown syntax

## Limitations

- Remote images must be accessible via the URLs stored in the Strapi export
- Some specific Strapi content types might not be fully supported
- The script assumes a specific Strapi data structure format 