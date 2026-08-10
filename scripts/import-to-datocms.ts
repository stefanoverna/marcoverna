import type { Client } from "@datocms/cma-client-node";
import * as fs from "node:fs";
import * as path from "node:path";
import PQueue from "p-queue";
import { parse } from "datocms-structured-text-dastdown";

interface WorkData {
  slug: string;
  title: string;
  description: string;
  cover: string;
  images: string[];
}

const CONCURRENCY = 5;

export default async function (client: Client): Promise<void> {
  const worksPath = path.resolve(import.meta.dirname, "../works.json");
  const works: WorkData[] = JSON.parse(fs.readFileSync(worksPath, "utf-8"));

  console.log(`${works.length} works to import`);

  let totalUploaded = 0;
  let totalCreated = 0;

  for (let i = 0; i < works.length; i++) {
    const w = works[i];
    const position = i + 1;

    console.log(
      `\n[${position}/${works.length}] ${w.title} (${w.images.length} images)`,
    );

    // Upload cover
    let coverUploadId: string | null = null;
    const coverBasename = decodeURIComponent(w.cover.split("/").pop() || "");
    process.stdout.write(`  Cover: ${coverBasename}... `);
    try {
      const upload = await client.uploads.createFromUrl({
        url: w.cover,
        skipCreationIfAlreadyExists: true,
      });
      coverUploadId = upload.id;
      totalUploaded++;
      console.log(`✓`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗ ${msg}`);
    }

    if (!coverUploadId) {
      console.log(`  ⚠️  Cover failed, skipping record`);
      continue;
    }

    // Upload gallery in parallel
    const galleryIds: string[] = new Array(w.images.length);
    const queue = new PQueue({ concurrency: CONCURRENCY });
    let uploaded = 0;

    for (let j = 0; j < w.images.length; j++) {
      const idx = j;
      const url = w.images[j];
      const filename = decodeURIComponent(url.split("/").pop() || `image-${j}`);
      queue.add(async () => {
        try {
          const upload = await client.uploads.createFromUrl({
            url,
            skipCreationIfAlreadyExists: true,
          });
          galleryIds[idx] = upload.id;
          totalUploaded++;
          uploaded++;
          process.stdout.write(
            `  Uploading ${uploaded}/${w.images.length}: ${filename} ✓\n`,
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          process.stdout.write(
            `  Uploading ${uploaded + 1}/${w.images.length}: ${filename} ✗ ${msg}\n`,
          );
        }
      });
    }

    await queue.onIdle();
    const validIds = galleryIds.filter(Boolean);

    // Create record
    try {
      await client.items.create({
        item_type: { type: "item_type", id: "WJhw7cpJS1eoFXjLjgqvyw" },
        title: w.title,
        slug: w.slug,
        position,
        cover_image: { upload_id: coverUploadId },
        description: w.description.trim()
          ? parse(w.description.trim().replace(/\n/g, "\n\n"))
          : null,
        images: validIds.map((id) => ({ upload_id: id })),
        seo: {
          title: w.title,
          description: w.description
            ? w.description.replace(/\n/g, " ").trim()
            : w.title,
        },
      });
      console.log(`  ✅ Created record`);
      totalCreated++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed to create record: ${msg}`);
    }
  }

  console.log(
    `\nDone! Uploaded ${totalUploaded} images, created ${totalCreated} records.`,
  );
}
