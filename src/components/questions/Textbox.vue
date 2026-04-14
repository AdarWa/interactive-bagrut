<template>
  <InputText type="text" v-model="model" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';

export default defineComponent({
  name: 'Textbox',
  components: {
    InputText,
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
