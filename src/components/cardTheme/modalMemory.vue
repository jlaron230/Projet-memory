<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import ButtonView from '@/components/button/button-view.vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const isView = ref(false)

const props = defineProps<{
  open: boolean
  question: string | null
  nameCard: string | null
  responseC: string | null
  image: string | null
}>()

const emit = defineEmits(['close'])

const isVisible = computed(() => props.open)
const imageSrc = computed(() => props.image ?? undefined)

const closeDialog = () => {
  isView.value = false
  emit('close')
}

const isViewResponse = () => {
  isView.value = !isView.value
}
</script>

<template>
  <TransitionRoot as="template" :show="isVisible">
    <Dialog class="relative z-10" @close="closeDialog">
      <!-- Fond semi-transparent -->
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

      <!-- Conteneur principal -->
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <!-- Contenu de la carte -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
            >
              <div class="bg-white px-6 py-6">
                <div class="flex flex-col items-center space-y-4">
                  <h2 class="text-2xl font-bold text-gray-800">
                    {{ isView ? 'Verso' : 'Recto' }}
                  </h2>

                  <DialogTitle
                    as="h3"
                    class="text-xl font-semibold text-blue-600 text-center"
                  >
                    {{ props.nameCard }}
                  </DialogTitle>

                  <div class="w-full text-center space-y-4">
                    <p class="text-base text-gray-700 whitespace-pre-line">
                      {{ isView ? props.responseC : props.question }}
                    </p>

                    <div
                      v-if="!isView && props.image?.length != 0"
                      class="flex justify-center"
                    >
                      <img
                        :src="imageSrc"
                        alt="Image de la carte"
                        class="max-h-64 rounded-lg shadow-md object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons -->
              <div class="bg-gray-50 px-6 py-4 flex justify-between sm:justify-end gap-4">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-300 hover:bg-gray-100 transition"
                  @click="closeDialog"
                >
                  Retour
                </button>
                <ButtonView @click.prevent="isViewResponse" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
