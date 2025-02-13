
export const CACHE_THEMES = 'themes-v1';
export const createTheme = async (categoryId, name, description) => {
  const themeData = JSON.stringify({categoryId, name, description });
  const request = new Request(`/themes/${categoryId}/${name}`);
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_THEMES);
  await cache.put(request, responseObj);
  console.log(`Thèmes ${name} mis en cache`);
};

export const updateTheme = async (categoryId, originalName, newName, newDescription, originalDescription ) => {
  const themeData = JSON.stringify({categoryId, name: newName, description: newDescription });
  const oldRequest = new Request(`/themes/${categoryId}/${originalName}`);
  const newRequest = new Request(`/themes/${categoryId}/${newName}`);
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_THEMES);
  if (originalName !== newName) {
    await cache.delete(oldRequest);
  }

  await cache.put(newRequest, responseObj);
  console.log(`Carte ${newName} mise à jour dans le cache avec question : ${newDescription}`);
};

export const deleteTheme = async (categoryId, themeName) => {
  const request = new Request(`/themes/${categoryId}/${themeName}`);
  const cache = await caches.open(CACHE_THEMES);
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Thèmes ${themeName} supprimée du cache`);
  } else {
    console.warn(`Aucun thème trouvée pour ${themeName} dans le cache`);
  }
};
