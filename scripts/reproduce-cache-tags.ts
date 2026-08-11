import 'dotenv/config';

const DatoToken = process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN;
if (!DatoToken) {
  console.error('Missing DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN in environment');
  process.exit(1);
}

const cdaUrl = 'https://graphql.datocms.com/';
const deployedUrl = 'https://marcoverna.marcoz-verna.workers.dev/about';

const headers = {
  Authorization: `Bearer ${DatoToken}`,
  'Content-Type': 'application/json',
};

const aboutQuery = `
  query {
    about {
      image {
        responsiveImage(imgixParams: { w: 800 }) {
          src
          srcSet
          width
          height
          alt
          title
          base64
          sizes
        }
      }
      bio {
        value
      }
      clients {
        responsiveImage(imgixParams: { w: 200 }) {
          src
          srcSet
          width
          height
          alt
          title
          base64
          sizes
        }
      }
      instagramUrl
    }
  }
`;

const layoutQuery = `
  query Layout {
    _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    contact {
      email
    }
    about {
      instagramUrl
    }
  }
`;

type QueryInfo = {
  name: string;
  query: string;
  cacheTags: string[];
};

async function executeQuery(name: string, query: string): Promise<QueryInfo> {
  const res = await fetch(cdaUrl, {
    method: 'POST',
    headers: { ...headers, 'X-Cache-Tags': 'true' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`${name} query failed: ${res.status} ${res.statusText}`);
  }

  const rawTags = res.headers.get('x-cache-tags');
  const cacheTags = rawTags ? rawTags.split(' ').filter(Boolean) : [];

  console.log(`\n--- ${name} ---`);
  console.log(`x-cache-tags: ${rawTags || '(none)'}`);
  console.log(`cache tags (${cacheTags.length}):`);
  cacheTags.forEach((t) => console.log(`  ${t}`));

  return { name, query, cacheTags };
}

async function main() {
  console.log('=== DatoCMS Queries Cache Tags ===\n');

  const [aboutResult, layoutResult] = await Promise.all([
    executeQuery('About Page Query', aboutQuery),
    executeQuery('Layout Query', layoutQuery),
  ]);

  const allCdaTags = [
    ...new Set([...aboutResult.cacheTags, ...layoutResult.cacheTags]),
  ].sort();

  console.log(`\n=== Aggregated DatoCMS cache tags (${allCdaTags.length}) ===`);
  allCdaTags.forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== Fetching deployed URL: ${deployedUrl} ===`);
  const deployedRes = await fetch(deployedUrl);
  const deployedTagsRaw = deployedRes.headers.get('x-debug-cache-tags');
  const deployedTags = deployedTagsRaw
    ? deployedTagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .sort()
    : [];

  console.log(`x-debug-cache-tags: ${deployedTagsRaw || '(none)'}`);
  console.log(`deployed cache tags (${deployedTags.length}):`);
  deployedTags.forEach((t) => console.log(`  ${t}`));

  const missingInDeployed = allCdaTags.filter((t) => !deployedTags.includes(t));
  const extraInDeployed = deployedTags.filter((t) => !allCdaTags.includes(t));

  console.log(`\n=== DIFF ===`);
  if (missingInDeployed.length > 0) {
    console.log(
      `\nMissing from deployed (expected from DatoCMS, not in x-debug-cache-tags) (${missingInDeployed.length}):`,
    );
    missingInDeployed.forEach((t) => console.log(`  ❌ ${t}`));
  } else {
    console.log(
      '\nNo missing tags: all DatoCMS tags are present in deployed response.',
    );
  }

  if (extraInDeployed.length > 0) {
    console.log(
      `\nExtra in deployed (in x-debug-cache-tags but not from these queries) (${extraInDeployed.length}):`,
    );
    extraInDeployed.forEach((t) => console.log(`  ➕ ${t}`));
  }

  if (missingInDeployed.length === 0 && extraInDeployed.length === 0) {
    console.log('\n✅ All cache tags match!');
  } else {
    console.log('\n❌ Cache tag mismatch detected!');
  }
}

main().catch(console.error);
