
import 'dotenv/config';

const API_KEY = process.env.API_KEY;
const AUTHORIZATION_TOKEN = process.env.AUTHORIZATION_TOKEN;
const ENTRY_UID = process.env.ENTRY_UID;
const CONTENT_TYPE_UID = process.env.CONTENT_TYPE_UID;
const LOCALE_CODE = process.env.LOCALE_CODE || 'en-us';


// Fetch upward references recursively
async function fetchUpwardReferences(entryUid, contentTypeUid, depth = 1, visited = new Set()) {
  if (visited.has(entryUid)) return [];

  visited.add(entryUid);

  const endpoint = `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}/references?locale=${LOCALE_CODE}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api_key': API_KEY,
      'authorization': AUTHORIZATION_TOKEN,
    },
  });

  if (!response.ok) throw new Error(`Failed fetching upward references: ${response.statusText}`);

  const { references = [] } = await response.json();
  references.forEach(ref => ref.depth = depth);

  let allReferences = [...references];

  for (const ref of references) {
    const childReferences = await fetchUpwardReferences(ref.entry_uid, ref.content_type_uid, depth + 1, visited);
    allReferences.push(...childReferences);
  }

  return allReferences;
}

// Fetch downward references recursively
async function fetchDownwardReferences(entryUid, contentTypeUid, depth = -1, visited = new Set()) {
  if (visited.has(entryUid)) return [];

  visited.add(entryUid);

  const endpoint = `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}?locale=${LOCALE_CODE}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api_key': API_KEY,
      'authorization': AUTHORIZATION_TOKEN,
    },
  });

  if (!response.ok) throw new Error(`Failed fetching downward references: ${response.statusText}`);

  const { entry } = await response.json();
  if (!entry) return [];

  const embeddedReferences = extractEmbeddedReferences(entry, depth);
  let allReferences = [...embeddedReferences];

  for (const ref of embeddedReferences) {
    const childReferences = await fetchDownwardReferences(ref.entry_uid, ref.content_type_uid, depth - 1, visited);
    allReferences.push(...childReferences);
  }

  return allReferences;
}

// Extract embedded references from an entry
function extractEmbeddedReferences(obj, depth, collectedRefs = []) {
  if (Array.isArray(obj)) {
    obj.forEach(item => extractEmbeddedReferences(item, depth, collectedRefs));
  } else if (obj && typeof obj === 'object') {
    if ('uid' in obj && '_content_type_uid' in obj) {
      collectedRefs.push({
        entry_uid: obj.uid,
        content_type_uid: obj._content_type_uid,
        depth,
        locale: LOCALE_CODE,
      });
    }

    Object.values(obj).forEach(value => extractEmbeddedReferences(value, depth, collectedRefs));
  }

  return collectedRefs;
}

// Remove duplicate references, preserving the shallowest instance
function removeDuplicateReferences(references) {
  const referenceMap = new Map();

  references.forEach(ref => {
    if (!referenceMap.has(ref.entry_uid) || Math.abs(ref.depth) < Math.abs(referenceMap.get(ref.entry_uid).depth)) {
      referenceMap.set(ref.entry_uid, ref);
    }
  });

  return Array.from(referenceMap.values());
}

(async () => {
  try {
    const upwardRefs = await fetchUpwardReferences(ENTRY_UID, CONTENT_TYPE_UID);
    const downwardRefs = await fetchDownwardReferences(ENTRY_UID, CONTENT_TYPE_UID);

    const combinedRefs = [...upwardRefs, ...downwardRefs];
    const uniqueReferences = removeDuplicateReferences(combinedRefs);

    console.log(uniqueReferences);
  } catch (error) {
    console.error('Error fetching references:', error);
  }
})();
