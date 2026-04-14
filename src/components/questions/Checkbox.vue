<template>
  <div class="flex flex-col gap-3">
    <div v-for="option in options" :key="option.attributes.value" class="flex items-center">
      <PrimeCheckbox v-model="model" :inputId="option.attributes.value" name="category" :value="option.attributes.value" />
      <label :for="option.attributes.value" class="ml-2 cursor-pointer">{{ option._text }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType, ref, watch } from 'vue';
import PrimeCheckbox from 'primevue/checkbox';
import type { Question } from '@/services/bagrutParser';

export default defineComponent({
  name: 'Checkbox',
  components: {
    PrimeCheckbox,
  },
  props: {
    modelValue: Array as PropType<string[]>,
    question: {
      type: Object as PropType<Question>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = ref(props.modelValue);
    watch(model, (newValue) => {
      emit('update:modelValue', newValue);
    });

    const options = computed(() => {
      const opts = props.question.answer.checkbox?.option;
      if (opts) {
        return Array.isArray(opts) ? opts : [opts];
      }
      return [];
    });

    return {
      model,
      options,
    };
  },
});
</script>
