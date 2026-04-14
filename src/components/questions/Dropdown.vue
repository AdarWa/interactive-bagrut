<template>
  <PrimeDropdown v-model="model" :options="options" optionLabel="_text" optionValue="attributes.value" placeholder="Select an Answer" />
</template>

<script lang="ts">
import { defineComponent, computed, type PropType, ref, watch } from 'vue';
import PrimeDropdown from 'primevue/dropdown';
import type { Question } from '../../services/bagrutParser';

export default defineComponent({
  name: 'Dropdown',
  components: {
    PrimeDropdown,
  },
  props: {
    modelValue: String,
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
      const opts = props.question.answer.dropdown?.option;
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
