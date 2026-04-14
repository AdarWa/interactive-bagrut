<template>
  <div>
    <h1>{{ bagrut.bagrut.title._text }}</h1>
    <div v-for="question in questions" :key="question.attributes.id">
      <p>{{ question.text._text }}</p>
      <component
        :is="getComponentName(question.answer)"
        :question="question"
        v-model="answers[question.attributes.id]"
      />
    </div>
    <Button label="Check Answers" @click="checkAnswers" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import Button from 'primevue/button';
import Textbox from './questions/Textbox.vue';
import Textarea from './questions/Textarea.vue';
import Dropdown from './questions/Dropdown.vue';
import Checkbox from './questions/Checkbox.vue';
import Radio from './questions/Radio.vue';
import Table from './questions/Table.vue';
import { Bagrut, Question, Answer } from '../services/bagrutParser';

export default defineComponent({
  name: 'BagrutViewer',
  components: {
    Textbox,
    Textarea,
    Dropdown,
    Checkbox,
    Radio,
    Table,
    Button,
  },
  props: {
    bagrut: {
      type: Object as PropType<Bagrut>,
      required: true,
    },
  },
  setup(props) {
    const answers = ref<Record<string, any>>({});

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
      if (answer.table) return 'Table';
      return null;
    };

    const checkAnswers = () => {
      for (const question of questions.value) {
        const userAnswer = answers.value[question.attributes.id];
        if (userAnswer && userAnswer.length > 0) {
          const correctAnswer = getCorrectAnswer(question.answer);

          if (correctAnswer === null || correctAnswer === undefined) continue;

          let isCorrect = false;
          if (question.answer.checkbox) {
            if (Array.isArray(userAnswer) && typeof correctAnswer === 'string') {
              const sortedUserAnswer = [...userAnswer].sort();
              const sortedCorrectAnswer = correctAnswer ? correctAnswer.split(',').map(s => s.trim()).sort() : [];
              isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
            }
          } else {
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
          }

          if (isCorrect) {
            alert(`Question ${question.attributes.id}: Correct`);
          } else {
            alert(
              `Question ${question.attributes.id}: Incorrect. Your answer: ${userAnswer}, Correct answer: ${correctAnswer}`
            );
          }
        }
      }
    };

    const getCorrectAnswer = (answer: Answer) => {
      const key = Object.keys(answer)[0] as keyof Answer;
      if (key && answer[key]) {
        return answer[key]!.attributes?.correct;
      }
      return null;
    };

    return {
      answers,
      questions,
      getComponentName,
      checkAnswers,
    };
  },
});
</script>
