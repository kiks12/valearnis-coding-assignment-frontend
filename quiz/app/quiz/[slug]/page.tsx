"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

import { QUIZ_BASE_API, SUBMIT_ANSWERS_API } from "@/endpoints";
import { Answer, Answers, Question, QuestionType, Quiz } from "@/types";

import NavBar, { ActivePage } from "@/components/navbar";
import MultiAnswerQuestion from "@/components/multiAnswerQuestion";
import SingleAnswerQuestion from "@/components/singleAnswerQuestion";

interface params {
	params: {
		slug: Number;
	};
}

interface Modal {
	show: boolean;
	content: string;
}

export default function QuizPage({ params }: params) {
	const router = useRouter();
	const [modal, setModal] = useState<Modal>({ show: false, content: "" });
	const [quiz, setQuiz] = useState<Quiz>();
	const [answers, setAnswers] = useState<Answers>({
		id: params.slug,
		userAnswers: [],
	});

	useEffect(() => {
		axios
			.get(QUIZ_BASE_API + params.slug)
			.then((result) => setQuiz(result.data))
			.catch((e) => console.error(e));
	}, [params.slug]);

	const answer = (answer: Answer) => {
		if (answers.userAnswers.some((userAnswer: Answer) => userAnswer.question == answer.question)) {
			setAnswers((prev: Answers) => {
				return {
					...prev,
					userAnswers: prev.userAnswers.map((userAnswer: Answer) => {
						if (userAnswer.question == answer.question) return answer;
						return userAnswer;
					}),
				};
			});
		} else {
			setAnswers((prev: Answers) => {
				return {
					...prev,
					userAnswers: [...prev.userAnswers, answer],
				};
			});
		}
	};

	const answersComplete = (): boolean => {
		const countedAnswered = answers.userAnswers.map((answer) => answer.answer.length !== 0);
		const counted = countedAnswered.filter((answer) => answer != false);
		return counted.length === quiz?.questions.length;
	};

	const submitAnswers = async () => {
		if (!answersComplete()) {
			setModal({
				show: true,
				content: "Please make sure to answer every question.",
			});
			return;
		}

		const res = await axios.post(SUBMIT_ANSWERS_API, answers);
		if (res.status === 200) {
			router.push(`/quiz/${params.slug}/score`);
		}
	};

	return (
		<>
			<NavBar active={ActivePage.NONE} />
			{modal.show && (
				<section
					style={{ backgroundColor: "rgba(100,100,100,0.5)" }}
					className="fixed z-50 w-screen h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col justify-center align-center"
				>
					<div className="w-full max-w-2xl max-h-full flex mx-auto flex-col justify-center align-center">
						<div className="rounded-lg border shadow bg-white">
							<div className="p-6 space-y-6">
								<p className="text-base leading-relaxed text-slate-900">{modal.content}</p>
							</div>
							<div className="w-full flex justify-end items-center p-6 space-x-2 rounded-b">
								<button
									onClick={() =>
										setModal((prev) => {
											return {
												...prev,
												show: false,
											};
										})
									}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</section>
			)}
			<main className="px-5">
				<div className="lg:mx-auto lg:w-1/2 w-full">
					<div className="mt-5">
						<h1 className="text-3xl font-bold">{quiz?.title}</h1>
						<p>{quiz?.description}</p>
					</div>
					<div>
						{quiz?.questions &&
							quiz.questions.map((question: Question, idx) => {
								if (question.question_type == QuestionType.SA) {
									return <SingleAnswerQuestion answers={[]} score={false} number={idx + 1} question={question} key={idx} onAnswer={answer} />;
								}
								return <MultiAnswerQuestion answers={[]} score={false} number={idx + 1} question={question} key={idx} onAnswer={answer} />;
							})}
					</div>
					<div className="flex flex-row-reverse my-10">
						<button className="py-2 px-10 bg-slate-800 text-white hover:bg-slate-900 rounded-lg" onClick={submitAnswers}>
							Submit
						</button>
					</div>
				</div>
			</main>
		</>
	);
}
