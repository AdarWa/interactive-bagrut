<template>
  <div class="flex flex-col gap-3">
    <div v-for="option in options" :key="option.attributes.value" class="flex items-center">
      <RadioButton v-model="model" :inputId="option.attributes.value" :name="question.attributes.id" :value="option.attributes.value" />
      <label :for="option.attributes.value" class="ml-2">{{ option._text }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType, ref, watch } from 'vue';
import RadioButton from 'primevue/radiobutton';
import type { Question } from '../../services/bagrutParser';

export default defineComponent({
  name: 'Radio',
  components: {
    RadioButton,
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
      const opts = props.question.answer.radio?.option;
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
