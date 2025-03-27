// Nom du cache utilisé pour stocker les catégories
export const CACHE_CATEGORIES = 'categories-v1';
export const createCategory = async (name, options) => {
  // Création des données de la catégorie sous forme de JSON
  const categoryData = JSON.stringify({ name, options });
  // Création d'une requête associée à cette catégorie
  const request = new Request(`/categories/${name}`);
  const response = new Response(categoryData, { status: 200, statusText: 'success' });
// Ouverture du cache des catégories
  const cache = await caches.open(CACHE_CATEGORIES);
  // Ajout de la nouvelle catégorie dans le cache
  await cache.put(request, response);
  console.log(`Catégorie ${name} mise en cache`);
};

export const updateCategory = async (originalName, newName, options) => {
  const categoryData = JSON.stringify({ name: newName, options });
  // Création des requêtes pour l'ancienne et la nouvelle catégorie
  const oldRequest = new Request(`/categories/${originalName}`);
  const newRequest = new Request(`/categories/${newName}`);
  const response = new Response(categoryData, { status: 200, statusText: 'success' });
// Ouverture du cache des catégories
  const cache = await caches.open(CACHE_CATEGORIES);
  // Suppression de l'ancienne entrée si elle existe
  await cache.delete(oldRequest);
  // Ajout de la nouvelle catégorie mise à jour dans le cache
  await cache.put(newRequest, response);
  console.log(`Catégorie ${newName} mise à jour dans le cache`);
};

export const deleteCategory = async (categoryName) => {
  // Création de la requête correspondant à la catégorie
  const request = new Request(`/categories/${categoryName}`);
  // Ouverture du cache des catégories
  const cache = await caches.open('categories-v1');
  // Suppression de la catégorie du cache
  const deleted = await cache.delete(request);
  // Vérification si la catégorie a bien été supprimée
  if (deleted) {
    console.log(`Catégorie ${categoryName} supprimée du cache`);
  } else {
    console.warn(`Aucune catégorie trouvée pour ${categoryName} dans le cache`);
  }
};
