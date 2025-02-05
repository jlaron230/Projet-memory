<!-- component -->
<script setup lang="ts">
</script>

<style>
.w-70 {
  width: 20rem;
}
</style>

<template>
<section class="blog text-gray-700 body-font">
<div class="container px-5 py-24 mx-auto">
  <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">

    <div class="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col justify-center items-center max-w-sm mx-auto">
      <div class="bg-gray-300 h-56 w-full rounded-lg shadow-md bg-cover bg-center" style="background-image: url(https://images.unsplash.com/photo-1590608897129-79da98d15969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80)"></div>

      <div class=" w-70 bg-white -mt-10 shadow-lg rounded-lg overflow-hidden p-5">

        <div class="header-content inline-flex ">
          <div class="category-badge flex-1  h-4 w-4 m rounded-full m-1 bg-green-100">
            <div class="h-2 w-2 rounded-full m-1 bg-green-500 " ></div>
          </div>
          <div class="category-title flex-1 text-sm"> Vue</div>
        </div>
        <div class="title-post font-medium">Mon titre</div>

        <div class="summary-post text-base text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis veritatis vel suscipit ex dolore possimus iure.
          <button class="bg-blue-100 text-blue-500 px-2 mt-4 block rounded p-2 text-sm"><span class="">Lire plus</span></button>
        </div>

      </div>
    </div>

  </div>
</div>
</section>
</template>

