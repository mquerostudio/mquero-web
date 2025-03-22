import json
import os
import re
from datetime import datetime
from urllib.request import urlretrieve

def ensure_directory(directory):
    """Ensure the directory exists, creating it if necessary."""
    if not os.path.exists(directory):
        os.makedirs(directory)

def sanitize_filename(filename):
    """Convert a string to a valid filename."""
    # Replace spaces with hyphens and remove invalid characters
    return re.sub(r'[^\w\-]', '', filename.replace(' ', '-').lower())

def download_image(url, output_folder, image_name):
    """Download an image from a URL and save it to the output folder."""
    ensure_directory(output_folder)
    extension = os.path.splitext(url)[1] or '.jpg'  # Default to .jpg if no extension
    local_path = os.path.join(output_folder, f"{image_name}{extension}")
    
    try:
        urlretrieve(url, local_path)
        return local_path
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
        return None

def process_text_blocks(blocks, output_images_folder):
    """Process text blocks into markdown, handling various block types."""
    markdown = ""
    image_counter = 1
    
    for block in blocks:
        block_type = block.get('type')
        
        if block_type == 'heading':
            level = block.get('level', 1)
            text = ''.join(child.get('text', '') for child in block.get('children', []))
            markdown += f"{'#' * level} {text}\n\n"
        
        elif block_type == 'paragraph':
            paragraph = ""
            for child in block.get('children', []):
                text = child.get('text', '')
                
                # Apply formatting
                if child.get('bold'):
                    text = f"**{text}**"
                if child.get('italic'):
                    text = f"*{text}*"
                if child.get('underline'):
                    text = f"<u>{text}</u>"
                if child.get('code'):
                    text = f"`{text}`"
                
                # Handle links
                if child.get('type') == 'link':
                    url = child.get('url', '')
                    link_text = ''.join(link_child.get('text', '') for link_child in child.get('children', []))
                    if child.get('openInNewTab'):
                        text = f"[{link_text}]({url})"
                    else:
                        text = f"[{link_text}]({url})"
                
                paragraph += text
            
            markdown += f"{paragraph}\n\n"
        
        elif block_type == 'image' and 'image' in block:
            image_data = block.get('image', {})
            image_url = image_data.get('url')
            image_caption = image_data.get('alternativeText') or image_data.get('caption') or f"Image {image_counter}"
            
            if image_url:
                image_name = f"image-{image_counter}"
                local_image_path = download_image(image_url, output_images_folder, image_name)
                
                if local_image_path:
                    # Use relative path for markdown
                    rel_path = os.path.relpath(local_image_path, os.path.dirname(output_images_folder))
                    markdown += f"![{image_caption}]({rel_path})\n\n"
                    image_counter += 1
        
        elif block_type == 'code':
            code = block.get('code', '')
            language = block.get('language', '')
            markdown += f"```{language}\n{code}\n```\n\n"
        
        elif block_type == 'quote':
            quote_text = ''.join(child.get('text', '') for child in block.get('children', []))
            markdown += f"> {quote_text}\n\n"
        
        elif block_type == 'list':
            is_ordered = block.get('format') == 'ordered'
            
            for i, item in enumerate(block.get('children', []), 1):
                item_text = ''.join(child.get('text', '') for child in item.get('children', []))
                if is_ordered:
                    markdown += f"{i}. {item_text}\n"
                else:
                    markdown += f"- {item_text}\n"
            
            markdown += "\n"
    
    return markdown

def convert_article_to_markdown(article, output_folder, locale):
    """Convert a Strapi article to a markdown file."""
    title = article.get('title', 'Untitled')
    description = article.get('description', '')
    published_date = article.get('publishedAt')
    try:
        formatted_date = datetime.strptime(published_date, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d') if published_date else 'Draft'
    except ValueError:
        formatted_date = 'Unknown Date'
    
    # Create folder for this article
    article_folder = os.path.join(output_folder, 'articles', locale, sanitize_filename(title))
    ensure_directory(article_folder)
    
    # Create images folder
    images_folder = os.path.join(article_folder, 'images')
    
    # Build markdown content
    markdown_content = f"---\n"
    markdown_content += f"title: \"{title}\"\n"
    markdown_content += f"description: \"{description}\"\n"
    markdown_content += f"date: {formatted_date}\n"
    markdown_content += f"locale: {locale}\n"
    
    # Add tags if available
    tags = article.get('tags', [])
    if tags:
        tag_names = []
        for tag_id in tags:
            # This requires having the tags data accessible
            # We'll need to look this up in the full dataset
            tag_names.append(str(tag_id))  # Placeholder, will be replaced
        
        if tag_names:
            markdown_content += f"tags: [{', '.join(f'\"{tag}\"' for tag in tag_names)}]\n"
    
    markdown_content += f"---\n\n"
    
    # Process main text
    main_text = article.get('mainText', [])
    markdown_content += process_text_blocks(main_text, images_folder)
    
    # Write to file
    output_file = os.path.join(article_folder, 'index.md')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    return output_file

def convert_project_to_markdown(project, output_folder, locale):
    """Convert a Strapi project to a markdown file."""
    title = project.get('title', 'Untitled')
    description = project.get('description', '')
    
    # Create folder for this project
    project_folder = os.path.join(output_folder, 'projects', locale, sanitize_filename(title))
    ensure_directory(project_folder)
    
    # Create images folder
    images_folder = os.path.join(project_folder, 'images')
    
    # Build markdown content
    markdown_content = f"---\n"
    markdown_content += f"title: \"{title}\"\n"
    markdown_content += f"description: \"{description}\"\n"
    markdown_content += f"locale: {locale}\n"
    
    # Add tags if available
    tags = project.get('tags', [])
    if tags:
        tag_names = []
        for tag_id in tags:
            # This requires having the tags data accessible
            tag_names.append(str(tag_id))  # Placeholder, will be replaced
        
        if tag_names:
            markdown_content += f"tags: [{', '.join(f'\"{tag}\"' for tag in tag_names)}]\n"
    
    markdown_content += f"---\n\n"
    
    # Process main text
    main_text = project.get('mainText', [])
    markdown_content += process_text_blocks(main_text, images_folder)
    
    # Write to file
    output_file = os.path.join(project_folder, 'index.md')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    return output_file

def main():
    # Input and output paths
    input_file = 'strapi-db.json'
    output_folder = '../markdown_export'
    
    # Ensure output directory exists
    ensure_directory(output_folder)
    
    # Load Strapi data
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extract articles and projects
    articles_data = data.get('data', {}).get('api::article.article', {})
    projects_data = data.get('data', {}).get('api::project.project', {})
    tags_data = data.get('data', {}).get('api::tag.tag', {})
    
    # Build tag lookup for easier reference
    tag_lookup = {}
    for tag_id, tag_info in tags_data.items():
        tag_lookup[int(tag_id)] = tag_info.get('tag', '')
    
    # Process articles
    print(f"Processing {len(articles_data)} articles...")
    for article_id, article in articles_data.items():
        # Update tag references with actual tag names
        if 'tags' in article:
            article['tags'] = [tag_lookup.get(tag_id, str(tag_id)) for tag_id in article.get('tags', [])]
        
        locale = article.get('locale', 'en')
        output_file = convert_article_to_markdown(article, output_folder, locale)
        print(f"Created article: {output_file}")
    
    # Process projects
    print(f"Processing {len(projects_data)} projects...")
    for project_id, project in projects_data.items():
        # Update tag references with actual tag names
        if 'tags' in project:
            project['tags'] = [tag_lookup.get(tag_id, str(tag_id)) for tag_id in project.get('tags', [])]
        
        locale = project.get('locale', 'en')
        output_file = convert_project_to_markdown(project, output_folder, locale)
        print(f"Created project: {output_file}")
    
    print(f"Conversion complete. Output saved to {output_folder}")

if __name__ == "__main__":
    main() 