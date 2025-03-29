
<template>
  <TransitionRoot as="template" :show="isVisible" @close="closeModal" >
    <Dialog class="relative z-10" @close="emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex max-md:min-h-120 md:min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 gap-6">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-center">
                <div class="">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-wrap gap-6">
                    <Cog6ToothIcon class="w-10 size-6"/>
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900 ">Paramètres de notification</DialogTitle>
                    <div class="mt-8 flex items-center justify-center gap-6">
                      <button @click="enableNotifications">Activer les notifications 🔔</button>
                      <button @click="stopNotifications">Arrêter les notifications 🔔</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                <button type="button" class="max-md:justify-center inline-flex justify-end w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto" @click.prevent="closeModal">Retour</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { requestNotificationPermission, scheduleDailyNotification, stopNotifications } from "../../utils/notifications.ts";
import { computed, defineEmits, defineProps, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Cog6ToothIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import ButtonCreate from '@/components/button/button-create.vue'
const props = defineProps<{ isOpen: boolean}>()
const isVisible = computed(() => props.isOpen)
const emit = defineEmits(['close'])
const isView = ref<boolean>()

const enableNotifications = () => {
  requestNotificationPermission();
  scheduleDailyNotification();
  stopNotifications();
};

const closeModal = () => {
  isView.value = !isView.value;
  emit('close')
}

</script>
