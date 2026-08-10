#!/usr/bin/env python3
"""Parse Squarespace WordPress export XML and extract works with their images.

Outputs a JSON file mapping work titles to lists of image URLs,
ready for DatoCMS import.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
}

IMG_SRC_RE = re.compile(r'src="(https?://[^"]+\.(?:jpg|jpeg|png|gif|webp))"', re.IGNORECASE)


def parse_xml(xml_path: str) -> list[dict]:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find("channel")

    pages: dict[int, dict] = {}
    attachments: dict[int, list[str]] = {}

    for item in channel.findall("item"):
        post_type_el = item.find("wp:post_type", NS)
        post_type = post_type_el.text if post_type_el is not None else None

        if post_type == "page":
            post_id_el = item.find("wp:post_id", NS)
            post_id = int(post_id_el.text) if post_id_el is not None else None

            title_el = item.find("title")
            title = title_el.text.strip() if title_el is not None and title_el.text else "Untitled"

            slug_el = item.find("wp:post_name", NS)
            slug = slug_el.text.strip() if slug_el is not None and slug_el.text else ""

            status_el = item.find("wp:status", NS)
            status = status_el.text.strip() if status_el is not None else ""

            content_el = item.find("content:encoded", NS)
            content = content_el.text if content_el is not None else ""

            inline_urls = IMG_SRC_RE.findall(content or "")
            pages[post_id] = {"title": title, "slug": slug, "status": status, "urls": inline_urls}

        elif post_type == "attachment":
            parent_el = item.find("wp:post_parent", NS)
            parent_id = int(parent_el.text) if parent_el is not None else None

            url_el = item.find("wp:attachment_url", NS)
            url = url_el.text.strip() if url_el is not None and url_el.text else None

            if url:
                attachments.setdefault(parent_id, []).append(url)

    works = []
    for post_id, page in pages.items():
        all_urls: list[str] = list(dict.fromkeys(page["urls"] + attachments.get(post_id, [])))
        if not all_urls:
            continue
        works.append({
            "title": page["title"],
            "slug": page["slug"],
            "status": page["status"],
            "images": all_urls,
        })

    return works


def main():
    if len(sys.argv) < 2:
        xml_path = str(Path.home() / "Downloads/Squarespace-Wordpress-Export-08-09-2026.xml")
    else:
        xml_path = sys.argv[1]

    output_path = Path("works.json")
    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2])

    works = parse_xml(xml_path)
    output_path.write_text(json.dumps(works, indent=2, ensure_ascii=False))
    total_images = sum(len(w["images"]) for w in works)
    print(f"Extracted {len(works)} works with {total_images} total images → {output_path}")


if __name__ == "__main__":
    main()
