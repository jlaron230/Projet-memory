
export const CACHE_THEMES = 'themes-v1';
export const createTheme = async (name, description) => {
  const themeData = JSON.stringify({ name, description });
  const request = new Request(`/themes/${name}`);
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_THEMES);
  await cache.put(request, responseObj);
  console.log(`Thèmes ${name} mis en cache`);
};

export const updateTheme = async (originalName, newName, newDescription, originalDescription ) => {
  const themeData = JSON.stringify({ name: newName, description: newDescription });
  const oldRequest = new Request(`/themes/${originalName}`);
  const newRequest = new Request(`/themes/${newName}`);
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_THEMES);
  if (originalName !== newName) {
    await cache.delete(oldRequest);
  }

  await cache.put(newRequest, responseObj);
  console.log(`Carte ${newName} mise à jour dans le cache avec question : ${newDescription}`);
};

export const deleteTheme = async (themeName) => {
  const request = new Request(`/themes/${themeName}`);
  const cache = await caches.open(CACHE_THEMES);
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Thèmes ${themeName} supprimée du cache`);
  } else {
    console.warn(`Aucun thème trouvée pour ${themeName} dans le cache`);
  }
};
