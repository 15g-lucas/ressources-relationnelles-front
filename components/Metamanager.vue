<!-- components/MetaManager.vue -->
<template>
  <div>
    <Head>
      <Title>{{ meta.title }}</Title>
      <Meta name="description" :content="meta.description" />
      <Meta name="keywords" :content="meta.keywords" />
      <!-- Ajoutez d'autres balises meta selon vos besoins -->
    </Head>
  </div>
</template>

<script>
export default {
  props: {
    meta: {
      type: Object,
      required: true
    }
  }
}
</script>
