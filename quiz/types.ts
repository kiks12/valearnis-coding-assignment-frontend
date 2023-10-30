
export enum QuestionType {
  SA = "SA",
  MA = "MA",
}

export interface Answer {
  answer: {
    index: number,
    text: string,
  }[],
  question: number
}

export interface Answers {
  id: Number,
  userAnswers: Answer[]
}

export interface Choice {
  id?: number,
  text: string, 
  index: number,
  question?: number,
  is_answer: boolean,
}

export interface Question {
  id?: number,
  text: string,
  description: string,
  question_type: QuestionType,
  date_created?: string,
  choices: Choice[]
}

export interface SubmittedAnswer {
  id: number,
  index: number,
  text: string,
  question: number,
  submission: number
  is_correct: boolean,
}

export interface SubmittedAnswers {
  id: number,
  quiz: number,
  answers: SubmittedAnswer[],
  score: number
}

export interface Quiz {
  id?: number,
  title: string,
  description: string,
  questions: Question[],
  submitted_answers?: SubmittedAnswers[]
}