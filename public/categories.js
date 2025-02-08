
export const CACHE_CATEGORIES = 'categories-v1';
export const createCategory = async (name, options) => {
  const categoryData = JSON.stringify({ name, options });
  const request = new Request(`/categories/${name}`);
  const response = new Response(categoryData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CATEGORIES);
  await cache.put(request, response);
  console.log(`Catégorie ${name} mise en cache`);
};

export const updateCategory = async (originalName, newName, options) => {
  const categoryData = JSON.stringify({ name: newName, options });
  const oldRequest = new Request(`/categories/${originalName}`);
  const newRequest = new Request(`/categories/${newName}`);
  const response = new Response(categoryData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CATEGORIES);
  await cache.delete(oldRequest);
  await cache.put(newRequest, response);
  console.log(`Catégorie ${newName} mise à jour dans le cache`);
};

export const deleteCategory = async (categoryName) => {
  const request = new Request(`/categories/${categoryName}`);
  const cache = await caches.open('categories-v1');
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Catégorie ${categoryName} supprimée du cache`);
  } else {
    console.warn(`Aucune catégorie trouvée pour ${categoryName} dans le cache`);
  }
};
