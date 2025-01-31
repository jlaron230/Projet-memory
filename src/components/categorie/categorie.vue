<script setup lang="ts">
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

</script>

<template>
  <section class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
    </div>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Back End Developer</h2>
        </div>
        <div class="mt-5 flex lg:mt-0 lg:ml-4">
      <span class="hidden sm:block">
        <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          <PencilIcon class="mr-1.5 -ml-0.5 size-5 text-gray-400" aria-hidden="true" />
          Edit
        </button>
      </span>

          <span class="ml-3 hidden sm:block">
        <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          <LinkIcon class="mr-1.5 -ml-0.5 size-5 text-gray-400" aria-hidden="true" />
          View
        </button>
      </span>

          <span class="sm:ml-3">
        <button type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <CheckIcon class="mr-1.5 -ml-0.5 size-5" aria-hidden="true" />
          Publish
        </button>
      </span>

        </div>
      </div>
      <!-- Your content -->
    </div>
  </section>

</template>
