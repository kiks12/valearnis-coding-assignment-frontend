"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

import axios from "axios";

import { Choice, Question, QuestionType, Quiz } from "@/types";
import { CREATE_QUIZ_API } from "@/endpoints";

import QuestionInput from "@/components/questionInput";
import NavBar, { ActivePage } from "@/components/navbar";

export default function Create() {
	const router = useRouter();
	const [activeQuestion, setActiveQuestion] = useState(0);
	const [quiz, setQuiz] = useState<Quiz>({
		title: "",
		description: "",
		questions: [],
	});
	const singleAnswerQuestionsCount = useMemo(() => {
		return quiz.questions.filter((question) => question.question_type == QuestionType.SA).length;
	}, [quiz.questions]);
	const multiAnswerQuestionsCount = useMemo(() => {
		return quiz.questions.filter((question) => question.question_type == QuestionType.MA).length;
	}, [quiz.questions]);

	const clearQuestions = () => {
		const confirmResponse = confirm("Are you sure you want to clear the questions?");
		if (confirmResponse) {
			setQuiz((prev) => {
				return {
					...prev,
					questions: [],
				};
			});
		}
	};

	const addQuestion = () => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: [...prev.questions, { text: "", question_type: QuestionType.SA, choices: [], description: "" }],
			};
		});
	};

	const deleteQuestion = (index: number) => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: prev.questions.filter((_question, idx) => idx !== index),
			};
		});
	};

	const onTypeChange = (type: QuestionType, index: number) => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: prev.questions.map((question, idx) => {
					if (idx === index)
						return {
							...question,
							question_type: type,
						};

					return question;
				}),
			};
		});
	};

	const onQuestionChoicesChange = (choices: Choice[], index: number) => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: prev.questions.map((question, idx) => {
					if (idx === index) {
						return {
							...question,
							choices: choices,
						};
					}

					return question;
				}),
			};
		});
	};

	const onQuestionTextChange = (event: ChangeEvent<HTMLTextAreaElement>, index: number) => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: prev.questions.map((question, idx) => {
					if (idx === index)
						return {
							...question,
							text: event.target.value,
						};

					return question;
				}),
			};
		});
	};

	const onQuestionDescriptionChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
		setQuiz((prev) => {
			return {
				...prev,
				questions: prev.questions.map((question, idx) => {
					if (idx === index)
						return {
							...question,
							description: event.target.value,
						};

					return question;
				}),
			};
		});
	};

	const createQuiz = async () => {
		if (quiz.questions.length === 0) {
			alert("Please create questions first");
			return;
		}

		const res = await axios.post(CREATE_QUIZ_API, quiz);
		if (res.status === 200) {
			alert("Successfully created new quiz");
			router.push("/");
		}
	};

	return (
		<>
			<NavBar active={ActivePage.CREATE} />
			<main className="lg:grid md:grid lg:grid-cols-4 md:grid-cols-5 w-full">
				<div className="p-7 sticky top-[4.5em] border-r md:border-r-1 md:h-[91vh] lg:col-span-1 md:col-span-2 self-start">
					<div>
						<h1 className="text-3xl font-bold">Create new Quiz</h1>
						<p className="mt-1">Complete the quiz information below</p>
					</div>
					<div className="mt-12">
						<label htmlFor="title">Quiz Title (Click to Change)</label>
						<input
							id="title"
							type="text"
							value={quiz.title}
							placeholder="Enter quiz title"
							onChange={(e) =>
								setQuiz((prev) => {
									return {
										...prev,
										title: e.target.value,
									};
								})
							}
							className="border rounded w-full p-3"
						/>
					</div>
					<div className="mt-5">
						<label htmlFor="description">Description</label>
						<textarea
							className="rounded w-full border p-3"
							rows={15}
							value={quiz.description}
							onChange={(e) =>
								setQuiz((prev) => {
									return {
										...prev,
										description: e.target.value,
									};
								})
							}
						/>
					</div>
				</div>

				<div className="lg:col-span-2 md:col-span-2 p-3">
					<h2 className="text-2xl font-semibold">Questions</h2>
					{quiz.questions.length !== 0 ? (
						quiz.questions.map((question: Question, idx) => {
							return (
								<QuestionInput
									index={idx}
									key={idx}
									question={question}
									active={activeQuestion === idx}
									setActive={() => setActiveQuestion(idx)}
									onDelete={() => deleteQuestion(idx)}
									onQuestionTypeChange={(type: QuestionType) => onTypeChange(type, idx)}
									onQuestionTextChange={(e: ChangeEvent<HTMLTextAreaElement>) => onQuestionTextChange(e, idx)}
									onQuestionDescriptionChange={(e: ChangeEvent<HTMLInputElement>) => onQuestionDescriptionChange(e, idx)}
									onQuestionChoicesChange={(choices: Choice[]) => onQuestionChoicesChange(choices, idx)}
								/>
							);
						})
					) : (
						<div></div>
					)}
				</div>

				<div className="p-7 sticky top-[4.5em] border-l md:borderl-1 md:h-[91vh] lg:col-span-1 md:col-span-2 self-start">
					<div>
						<h1 className="text-center text-7xl font-bold">{quiz.questions.length}</h1>
						<p className="text-center mt-2">Questions</p>
					</div>
					<div className="flex flex-row justify-between mt-10">
						<p>Single Answer Questions Count:</p>
						<p>{singleAnswerQuestionsCount}</p>
					</div>
					<div className="flex flex-row justify-between mt-3">
						<p>Multi Answer Questions Count:</p>
						<p>{multiAnswerQuestionsCount}</p>
					</div>
					<button
						className="w-full py-2 px-5 mt-10 border border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-white border border-slate-600 rounded-lg"
						onClick={clearQuestions}
					>
						Clear Questions
					</button>
					<button
						className="w-full py-2 px-5 mt-3 bg-slate-500 hover:bg-slate-600 text-white border border-slate-600 rounded-lg"
						onClick={addQuestion}
					>
						+ Add Question
					</button>
					<button
						onClick={createQuiz}
						className="w-full py-2 px-5 border border-slate-900 mt-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg hover:shadow"
					>
						Create Quiz
					</button>
				</div>
			</main>
		</>
	);
}
