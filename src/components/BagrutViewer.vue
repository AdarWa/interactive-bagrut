<template>
  <div class="mx-auto p-4" style="max-width: 800px;">
    <h1 class="text-3xl font-bold mb-4">{{ bagrut.bagrut.title._text }}</h1>

    <Card
        v-for="question in questions"
        :key="question.attributes.id"
        class="mb-4"
    >
      <template #content>
        <p class="text-lg font-medium mb-3">{{ question.text._text }}</p>

        <component
            :is="getComponentName(question.answer)"
            :question="question"
            v-model="answers[question.attributes.id]"
        />

        <Message
            v-if="results[question.attributes.id]"
            :severity="results[question.attributes.id]?.isCorrect ? 'success' : 'error'"
            :closable="false"
            class="mt-3"
        >
          <template v-if="results[question.attributes.id]?.isCorrect">
            Correct!
          </template>
          <template v-else>
            Incorrect. Correct answer: <strong>{{ results[question.attributes.id]?.correctAnswer }}</strong>
          </template>
        </Message>
      </template>
    </Card>

    <Button
        label="Check Answers"
        icon="pi pi-check"
        size="large"
        @click="checkAnswers"
        class="mt-3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';

import Textbox from './questions/Textbox.vue';
import Textarea from './questions/Textarea.vue';
import Dropdown from './questions/Dropdown.vue';
import Checkbox from './questions/Checkbox.vue';
import Radio from './questions/Radio.vue';

import type { Bagrut, Answer } from '../services/bagrutParser';
import { useBagrutValidator } from '../utils/bagrutValidator';

export default defineComponent({
  name: 'BagrutViewer',
  components: {
    Textbox,
    Textarea,
    Dropdown,
    Checkbox,
    Radio,
    Button,
    Card,
    Message,
  },
  props: {
    bagrut: {
      type: Object as PropType<Bagrut>,
      required: true,
    },
  },
  setup(props) {
    const questions = computed(() => {
      const qs = props.bagrut.bagrut.questions.question;
      return Array.isArray(qs) ? qs : [qs];
    });

    const getComponentName = (answer: Answer) => {
      if (answer.textbox) return 'Textbox';
      if (answer.textarea) return 'Textarea';
      if (answer.dropdown) return 'Dropdown';
      if (answer.checkbox) return 'Checkbox';
      if (answer.radio) return 'Radio';
      return null;
    };

    const { answers, results, checkAnswers } = useBagrutValidator(questions);

    return {
      questions,
      getComponentName,
      answers,
      results,
      checkAnswers,
    };
  },
});
</script>