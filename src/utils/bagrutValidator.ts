import { ref, type Ref } from 'vue';
import type { Question, Answer } from '../services/bagrutParser';

export interface ValidationResult {
    isCorrect: boolean;
    correctAnswer?: string;
}

export function useBagrutValidator(questions: Ref<Question[]>) {
    const answers = ref<Record<string, any>>({});
    const results = ref<Record<string, ValidationResult>>({});

    const getCorrectAnswer = (answer: Answer, key: keyof Answer) => {
        const answerData = answer[key] as any;
        if (!answerData) return null;

        if (key === 'textbox' || key === 'textarea') {
            return answerData.attributes?.correct;
        }

        if (answerData.option) {
            const options = Array.isArray(answerData.option) ? answerData.option : [answerData.option];

            const correctOptions = options.filter((o: any) =>
                o.attributes?.correct === 'true' || o.attributes?.correct === true
            );

            const correctValues = correctOptions.map((o: any) => String(o.attributes?.value));

            if (key === 'checkbox') {
                return correctValues.join(',');
            } else {
                return correctValues[0] || null;
            }
        }

        return null;
    };

    const getAnswerLabel = (question: Question, correctId: string): string => {
        const key = Object.keys(question.answer)[0] as keyof Answer;
        const answerData = question.answer[key] as any;

        if (key === 'textbox' || key === 'textarea') return correctId;

        if (answerData && answerData.option) {
            const options = Array.isArray(answerData.option) ? answerData.option : [answerData.option];

            if (key === 'checkbox') {
                const ids = String(correctId).split(',').map(id => id.trim());
                const labels = ids.map(id => {
                    const opt = options.find((o: any) => o.attributes?.id === id || String(o.attributes?.value) === id);
                    return opt ? (opt._text || opt.text?._text || id) : id;
                });
                return labels.join(', ');
            }

            const opt = options.find((o: any) => o.attributes?.id === correctId || String(o.attributes?.value) === correctId);
            if (opt) {
                return opt._text || opt.text?._text || correctId;
            }
        }

        return correctId;
    };

    const checkAnswers = () => {
        results.value = {};

        for (const question of questions.value) {
            const userAnswer = answers.value[question.attributes.id];

            if (userAnswer !== undefined && userAnswer !== null && userAnswer.length !== 0) {
                const key = Object.keys(question.answer)[0] as keyof Answer;

                const correctRaw = getCorrectAnswer(question.answer, key);

                if (correctRaw === null || correctRaw === undefined) continue;

                const correctStr = String(correctRaw);
                let isCorrect = false;

                if (key === 'checkbox') {
                    const userArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                    const sortedUserAnswer = userArr.map(val => String(val).trim()).sort();
                    const sortedCorrectAnswer = correctStr ? correctStr.split(',').map(s => s.trim()).sort() : [];

                    isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
                } else {
                    isCorrect = String(userAnswer).trim() === correctStr.trim();
                }

                results.value[question.attributes.id] = {
                    isCorrect,
                    correctAnswer: isCorrect ? undefined : getAnswerLabel(question, correctStr)
                };
            }
        }
    };

    return {
        answers,
        results,
        checkAnswers,
    };
}