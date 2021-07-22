<template>
  <div id="selection">
    <div>
      <h5>Birthday:</h5>
      {{ birthday || '–' }}
    </div>
    <div>
      <h5>Animal:</h5>
      {{ animal || '–' }}
    </div>
    <div>
      <h5>Fruit:</h5>
      {{ fruit || '–' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    birthday: {
      required: true,
      type: String,
    },
    animal: {
      required: true,
      type: String,
    },
    fruit: {
      required: true,
      type: String,
    },
  },
};
</script>

<style lang="stylus"></style>
