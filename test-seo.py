"""Run: python3 test-seo.py. Stdlib checks for the three search pages."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).parent
BASE = 'https://getwachat.vercel.app'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

urls = [node.text or '' for node in ET.parse(ROOT / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls) == len(set(urls)) == 3
for url in urls:
    path = urlsplit(url).path
    text = (ROOT / (path.lstrip('/') or 'index.html')).read_text()
    tags = Page(text).tags
    assert sum(t == 'h1' for t, _ in tags) == 1, path
    assert sum(t == 'title' for t, _ in tags) == 1, path
    assert [a['href'] for t, a in tags if t == 'link' and a.get('rel') == 'canonical'] == [url]
    assert any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in tags)
    assert not any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in tags)
    for tag, attrs in tags:
        if tag != 'a':
            continue
        link = urlsplit(attrs.get('href', ''))
        target = link.path
        if not link.netloc and target.startswith('/'):
            assert (ROOT / (target.lstrip('/') or 'index.html')).is_file(), target
assert BASE + '/sitemap.xml' in (ROOT / 'robots.txt').read_text()
assert all(urlsplit(u).path in (ROOT / 'index.html').read_text() for u in urls[1:])
print('PASS: 3 sitemap URLs, canonical/title/H1/description, internal links, robots and homepage discovery')
