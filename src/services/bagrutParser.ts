import { xml2js, type ElementCompact } from 'xml-js';

export interface Bagrut extends ElementCompact {
  bagrut: {
    title: {
      _text: string;
    };
    questions: {
      question: Question[] | Question;
    };
  };
}

export interface Question extends ElementCompact {
  attributes: {
    id: string;
  };
  text: {
    _text: string;
  };
  answer: Answer;
}

export interface Answer extends ElementCompact {
  textbox?: AnswerType;
  textarea?: AnswerType;
  dropdown?: AnswerType;
  checkbox?: AnswerType;
  radio?: AnswerType;
  table?: any; // Define table structure if needed
}

export interface AnswerType extends ElementCompact {
  attributes: {
    correct: string;
  };
  option?: Option[] | Option;
}

export interface Option extends ElementCompact {
  _text: string;
  attributes: {
    value: string;
  };
}

export function parseBagrut(xml: string): Bagrut {
  const options = {
    compact: true,
    attributesKey: 'attributes',
  };
  return xml2js(xml, options) as Bagrut;
}
