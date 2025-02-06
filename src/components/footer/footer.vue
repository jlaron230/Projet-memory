<template>
  <footer class="w-full bg-gray-800 text-white py-4 mt-auto">
    <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
      <!-- Texte principal -->
      <div class="text-center sm:text-left text-sm">
        © 2025 MemoryAPP. Tous droits réservés.
      </div>

      <!-- Liens -->
      <div class="flex space-x-4 mt-2 sm:mt-0">
        <a href="#" class="hover:underline">Politique de confidentialité</a>
        <a href="#" class="hover:underline">Conditions d'utilisation</a>
        <a href="#" class="hover:underline">Contact</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #2d3748; /* Couleur de fond gris foncé */
  color: #ffffff; /* Texte blanc */
}
footer a {
  color: #63b3ed; /* Couleur des liens */
}
footer a:hover {
  text-decoration: underline; /* Effet au survol */
}
</style>
