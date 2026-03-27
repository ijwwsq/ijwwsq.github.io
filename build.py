import os
import sys
import re
from datetime import datetime

try:
    import markdown
except ImportError:
    print("Please install markdown package: pip install markdown")
    sys.exit(1)

POSTS_DIR = "posts"
TEMPLATES_DIR = "_templates"
OUTPUT_INDEX = "blog.html"

def main():
    if not os.path.exists(POSTS_DIR):
        os.makedirs(POSTS_DIR)
        print(f"Created {POSTS_DIR} directory. Put your .md files there!")
        sys.exit(0)

    with open(os.path.join(TEMPLATES_DIR, "post.html"), "r", encoding="utf-8") as f:
        post_templatestr = f.read()

    with open(os.path.join(TEMPLATES_DIR, "blog.html"), "r", encoding="utf-8") as f:
        blog_templatestr = f.read()

    files = [f for f in os.listdir(POSTS_DIR) if f.endswith('.md')]
    files.sort(reverse=True)

    post_links = []

    for file in files:
        filepath = os.path.join(POSTS_DIR, file)
        
        # Parse date and title from filename
        # Expected format: 2026-03-25-my-post.md
        match = re.match(r'^(\d{4}-\d{2}-\d{2})-(.+)\.md$', file)
        if match:
            date_str = match.group(1)
            title_slug = match.group(2).replace('-', ' ').title()
        else:
            date_str = datetime.now().strftime("%Y-%m-%d")
            title_slug = file.replace('.md', '').title()

        with open(filepath, "r", encoding="utf-8") as f:
            md_content = f.read()
        
        # Try to find an h1 tag for the title
        lines = md_content.split('\n')
        title = title_slug
        for line in lines:
            if line.startswith('# '):
                title = line[2:].strip()
                break
        
        # Convert markdown to HTML
        html_content = markdown.markdown(md_content, extensions=['fenced_code', 'tables'])

        # Generate custom post HTML
        post_slug = f"post-{file.replace('.md', '')}"
        out_filename = f"{post_slug}.html"
        
        post_html = post_templatestr.replace("{{FILENAME}}", file)
        post_html = post_html.replace("{{CONTENT}}", html_content)

        with open(out_filename, "w", encoding="utf-8") as f:
            f.write(post_html)

        # Generate link for index
        # [2026-03-20] INFO: Title
        link_str = f'<p><span class="dim">[{date_str}] INFO:</span> <a href="/{post_slug}">{title}</a></p>'
        post_links.append(link_str)

    current_time = datetime.now().strftime("%a %b %d %H:%M:%S")
    blog_out = blog_templatestr.replace("{{TIME}}", current_time)
    
    if not post_links:
        post_links.append("<p class='dim'>No entries found. Try adding some .md files to the posts directory.</p>")
        
    blog_out = blog_out.replace("{{POST_LIST}}", "\n            ".join(post_links))

    with open(OUTPUT_INDEX, "w", encoding="utf-8") as f:
        f.write(blog_out)

    print(f"Success! Generated {len(files)} blog posts and updated {OUTPUT_INDEX}.")

if __name__ == '__main__':
    main()