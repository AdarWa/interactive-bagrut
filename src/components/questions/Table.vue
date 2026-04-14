<template>
  <DataTable :value="rows">
    <Column v-for="(header, index) in headers" :key="index" :header="header._text">
      <template #body="slotProps">
        <component
          :is="getComponentName(slotProps.data.cell[index])"
          :question="{ answer: slotProps.data.cell[index] }"
          v-model="answers[slotProps.index][index]"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Textbox from './Textbox.vue';
import Dropdown from './Dropdown.vue';
import { Question, Answer } from '../../services/bagrutParser';

export default defineComponent({
  name: 'Table',
  components: {
    DataTable,
    Column,
    Textbox,
    Dropdown,
  },
  props: {
    modelValue: Array as PropType<any[][]>,
    question: {
      type: Object as PropType<Question>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const answers = ref<any[][]>([]);

    const headers = computed(() => {
      const h = props.question.answer.table?.header.cell;
      return Array.isArray(h) ? h : [h];
    });

    const rows = computed(() => {
      const r = props.question.answer.table?.row;
      return Array.isArray(r) ? r : [r];
    });

    const initializeAnswers = () => {
      answers.value = rows.value.map((row: any) =>
        (Array.isArray(row.cell) ? row.cell : [row.cell]).map(() => '')
      );
    };

    const getComponentName = (cell: Answer) => {
      if (cell.textbox) return 'Textbox';
      if (cell.dropdown) return 'Dropdown';
      return null;
    };

    watch(
      answers,
      (newValue) => {
        emit('update:modelValue', newValue);
      },
      { deep: true }
    );

    initializeAnswers();

    return {
      headers,
      rows,
      answers,
      getComponentName,
    };
  },
});
</script>
