#!/usr/bin/env python3
"""Scrape all works from marcoverna.studio and save to works.json."""

import json
import subprocess
import time
import sys
from pathlib import Path


BASE = "https://marcoverna.studio"
OUTFILE = Path(__file__).resolve().parent.parent / "works.json"


def agent_open(url: str) -> None:
    subprocess.run(
        ["agent-browser", "open", url],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def agent_eval_json(js: str) -> object:
    result = subprocess.run(
        ["agent-browser", "eval", "--stdin"],
        input=js,
        capture_output=True,
        text=True,
    )
    return json.loads(json.loads(result.stdout.strip()))


def main():
    print("Opening homepage...")
    agent_open(BASE)
    time.sleep(3)

    print("Scraping homepage for covers, titles, descriptions...")
    works = agent_eval_json(r"""
        var works = [];
        var coverMap = {};
        document.querySelectorAll('a[href^="/"] img[src*="squarespace-cdn"]').forEach(function(img) {
          if (img.alt === 'MARCO VERNA - RETOUCHING STUDIO') return;
          var a = img.closest('a');
          if (!a) return;
          var href = a.getAttribute('href') || '';
          var slug = href.replace(/\/$/, '').replace(/^\//, '');
          if (!slug || slug === 'about' || slug === 'contacts' || slug === 'blog') return;
          coverMap[slug] = (img.getAttribute('data-image') || img.getAttribute('data-src') || img.src).replace(/\?.*$/, '');
        });
        document.querySelectorAll('.project[data-url]').forEach(function(p) {
          var slug = (p.getAttribute('data-url') || '').replace(/\/$/, '').replace(/^\//, '');
          var titleEl = p.querySelector('.project-title');
          var title = titleEl ? titleEl.innerText.trim() : '';
          var descEl = p.querySelector('.project-description');
          var desc = descEl ? descEl.innerText.trim() : '';
          works.push({
            slug: slug,
            title: title || slug,
            description: desc,
            cover: coverMap[slug] || '',
            images: []
          });
        });
        JSON.stringify(works);
    """)

    print(f"Found {len(works)} works on homepage")

    for i, w in enumerate(works):
        slug = w["slug"]
        sys.stdout.write(f"  [{i+1}/{len(works)}] {slug}... ")
        sys.stdout.flush()

        agent_open(f"{BASE}/{slug}/")
        time.sleep(2)

        imgs = agent_eval_json(r"""
            var imgs = [];
            var seen = new Set();
            document.querySelectorAll('img[data-image]').forEach(function(img) {
              var url = (img.getAttribute('data-image') || img.src).replace(/\?.*$/, '');
              if (!seen.has(url)) { seen.add(url); imgs.push(url); }
            });
            JSON.stringify(imgs);
        """)

        w["images"] = imgs
        print(f"{len(imgs)} images")

    OUTFILE.write_text(json.dumps(works, indent=2, ensure_ascii=False))
    total = sum(len(w["images"]) for w in works)
    print(f"\nDone! {len(works)} works, {total} gallery images → {OUTFILE}")


if __name__ == "__main__":
    main()
