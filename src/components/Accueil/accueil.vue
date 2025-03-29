<template>
  <div class="rounded-md flex items-center justify-center bg-gradient-to-br  text-white px-4 sm:px-6 py-10 sm:py-12 sm:px-8">

    <!-- Border dégradé autour de la carte avec animation -->
    <div class="relative p-[2px] w-full max-w-md sm:max-w-xl rounded-3xl bg-gradient-to-tr from-blue-300 via-blue-500 to-cyan-300 shadow-2xl hover:shadow-blue-400/40 transition-all duration-500 animate-fade-up">

      <!-- Carte intérieure avec fond flouté -->
      <div class="rounded-3xl bg-white/5 backdrop-blur-md px-6 py-8 sm:px-10 sm:py-10 text-center text-white">

        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div class="bg-white/20 p-4 rounded-full shadow-md">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2 leading-snug">
          Bienvenue dans le <span class="text-yellow-300">projet Memory</span>
        </h1>

        <!-- Slogan -->
        <p class="text-sm sm:text-base text-white/90 px-2 leading-relaxed">
          Un jeu fun, malin et stimulant pour entraîner ta mémoire !<br />
          Clique sur <span class="font-semibold text-yellow-300">catégorie</span> pour entrer dans l’univers de Nicolas Faissel 🧠
        </p>

      </div>
    </div>
  </div>
</template>

<style scoped>
@layer utilities {
  @keyframes fade-up {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-up {
    animation: fade-up 1s ease-out forwards;
  }
}
</style>
