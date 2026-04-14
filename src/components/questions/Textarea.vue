<template>
  <PrimeTextarea v-model="model" rows="5" cols="30" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import PrimeTextarea from 'primevue/textarea';

export default defineComponent({
  name: 'Textarea',
  components: {
    PrimeTextarea,
  },
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = ref(props.modelValue);
    watch(model, (newValue) => {
      emit('update:modelValue', newValue);
    });
    return { model };
  },
});
</script>
