<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

function handleRouteView(name) {
  router.push({name})
}
</script>

<template>
  <v-app>
    <v-container class="fill-height">
      <RouterView v-slot="{Component}">
        <keep-alive>
          <component :is="Component" :key="$route.path" v-if="$route.meta.keepAlive"/>
        </keep-alive>
      </RouterView>

      <v-bottom-navigation grow v-model="$route.name" @update:modelValue="handleRouteView">
        <v-tooltip text="STEP 1: Write or import Markdown" location="top">
          <template v-slot:activator="{ props }">
            <v-btn value="home" v-bind="props">
              <v-icon>mdi-file-document-edit</v-icon>

              <span>START</span>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="STEP 2: Translate each line" location="top">
          <template v-slot:activator="{ props }">
            <v-btn value="translate" v-bind="props">
              <v-icon>mdi-translate</v-icon>

              <span>TRANSLATE</span>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="STEP 3: Combine into a new Markdown" location="top">
          <template v-slot:activator="{ props }">
            <v-btn value="compile" v-bind="props">
              <v-icon>mdi-flask</v-icon>

              <span>COMPILE</span>
            </v-btn>
          </template>
        </v-tooltip>
      </v-bottom-navigation>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
