/**
 * Generate a URL-friendly slug from a string
 * @param text - The input string to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 * @param baseSlug - The base slug to make unique
 * @param checkExists - Function that checks if slug exists
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Update existing slug when title changes
 * @param newTitle - The new title
 * @param currentSlug - The current slug
 * @param checkExists - Function that checks if slug exists
 * @returns Updated slug if title changed significantly, otherwise current slug
 */
export async function updateSlugIfNeeded(
  newTitle: string,
  currentSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const newBaseSlug = generateSlug(newTitle);
  
  // If the new slug would be the same as current, keep current
  if (newBaseSlug === currentSlug) {
    return currentSlug;
  }
  
  // If title changed significantly, generate new unique slug
  return await generateUniqueSlug(newBaseSlug, checkExists);
}