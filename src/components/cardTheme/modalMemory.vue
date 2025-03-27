<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import ButtonView from '@/components/button/button-view.vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const isView = ref(false)
const isVisible = computed(() => props.open)
//props défini avec leur type
const props = defineProps<{
  open: boolean
  question: string | null
  nameCard: string | null
  responseC: string | null
  image: string | null
}>()
const emit = defineEmits(['close'])
//ajout du props d'image
const imageSrc = computed(() => props.image ?? undefined)
//fermeture de la modal en boolean
const closeDialog = () => {
  isView.value = false
  emit('close')
}
//Fonction pour la visibilité de la carte
const isViewResponse = () => {
  isView.value = !isView.value
}
</script>

<template>
  <TransitionRoot as="template" :show="isVisible" @close="isView = false">
    <!--Boite de la carte avec par défaut la fermeture de la modal en cas de clique à l'extérieur de celle ci-->
    <Dialog class="relative z-10" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          ref="element"
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <!-- La modal avec l'affichage des données depuis le composant cardTheme-->
            <DialogPanel
              ref="element"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start flex justify-center">
                  <div v-if="!isView" class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h2 class="text-center">Recto</h2>
                    <!--Nom de la carte-->
                    <DialogTitle as="h3" class="text-base font-semibold text-center text-gray-900">
                      {{ props.nameCard }}
                    </DialogTitle>
                    <div class="mt-2">
                      <!--Question de la carte-->
                      <p class="text-sm text-gray-500">{{ props.question }}</p>
                      <!--S'il existe une image, on l'affiche-->
                      <div v-if="props.image?.length != 0">
                        <img :src="imageSrc" alt="Une image" />
                      </div>
                      <div v-else></div>
                    </div>
                  </div>
                  <div v-else class="mt-2">
                    <h2 class="text-center">Verso</h2>
                    <!--Réponse de la carte-->
                    <p class="text-sm text-gray-500">{{ props.responseC }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <!--Fermeture de la carte-->
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @close.prevent="isViewResponse"
                  @click="closeDialog"
                >
                  Retour
                </button>
                <!--Bouton pour visualiser la réponse-->
                <ButtonView @click.prevent="isViewResponse" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
