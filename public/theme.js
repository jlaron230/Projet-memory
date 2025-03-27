
export const CACHE_THEMES = 'themes-v1';
//fonction de création de thème
export const createTheme = async (categoryId, name, description) => {
  //converti l'objet en json
  const themeData = JSON.stringify({categoryId, name, description });
  //requête avec le nom de la catégorie et le nouveau nom du thème
  const request = new Request(`/themes/${categoryId}/${name}`);
  //la réponse avec l'objet
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });
//ouverture ou création du cache thème
  const cache = await caches.open(CACHE_THEMES);
  //mise à jour du cache
  await cache.put(request, responseObj);
  console.log(`Thèmes ${name} mis en cache`);
};

//Fonction pour mettre à jour le thème
export const updateTheme = async (categoryId, originalName, newName, newDescription, originalDescription ) => {
  //Converti l'objet en json
  const themeData = JSON.stringify({categoryId, name: newName, description: newDescription });
  //Requête pour l'ancien et le nouveau thème
  const oldRequest = new Request(`/themes/${categoryId}/${originalName}`);
  const newRequest = new Request(`/themes/${categoryId}/${newName}`);
  const responseObj = new Response(themeData, { status: 200, statusText: 'success' });

//On ouvre le chache et on compare l'ancien nom du thème au nouveau, puis on supprime l'ancien nom si le nouveau est différent
  const cache = await caches.open(CACHE_THEMES);
  if (originalName !== newName) {
    await cache.delete(oldRequest);
  }
//mise à jour du cache
  await cache.put(newRequest, responseObj);
  console.log(`Carte ${newName} mise à jour dans le cache avec question : ${newDescription}`);
};

//fonction pour supprimer un thème
export const deleteTheme = async (categoryId, themeName) => {
  //Requete pour récupérer le thème cibler
  const request = new Request(`/themes/${categoryId}/${themeName}`);
  const cache = await caches.open(CACHE_THEMES);
  //On supprime le cache si la requête à récupérer le nom du thème cibler
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Thèmes ${themeName} supprimée du cache`);
  } else {
    console.warn(`Aucun thème trouvée pour ${themeName} dans le cache`);
  }
};

