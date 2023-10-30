"use client";

import NavBar, { ActivePage } from "@/components/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { QUIZ_BASE_API } from "@/endpoints";
import { Question, QuestionType, Quiz, SubmittedAnswer } from "@/types";
import SingleAnswerQuestion from "@/components/singleAnswerQuestion";
import MultiAnswerQuestion from "@/components/multiAnswerQuestion";

interface params {
	params: {
		slug: Number;
	};
}

export default function Score({ params }: params) {
	const [quiz, setQuiz] = useState<Quiz>();

	useEffect(() => {
		axios
			.get(QUIZ_BASE_API + params.slug)
			.then((res) => setQuiz(res.data))
			.catch((e) => console.error(e));
	}, [params.slug]);

	return (
		<>
			<NavBar active={ActivePage.NONE} />
			<main className="px-5">
				<div className="lg:mx-auto lg:w-1/2 w-full">
					{quiz?.submitted_answers && quiz?.submitted_answers?.length !== 0 && (
						<>
							<div className="mt-5">
								<h1 className="text-3xl font-bold">{quiz.title}</h1>
								<p>{quiz.description}</p>
							</div>

							<div className="my-5 flex flex-row w-full justify-between align-center border border-sky-200 p-4 bg-sky-100 rounded-lg">
								<p>Your Score: </p>
								<p>
									{quiz?.submitted_answers[0].score}/{quiz?.questions.length}
								</p>
							</div>

							<div>
								{quiz?.submitted_answers &&
									quiz?.questions &&
									quiz.questions.map((question: Question, idx) => {
										const answers = quiz.submitted_answers![0].answers.filter((answer) => answer.question == question.id);
										const answersIndices = answers.map((answer: SubmittedAnswer) => {
											return { index: answer.index, isCorrect: answer.is_correct };
										});

										if (question.question_type == QuestionType.SA) {
											return (
												<SingleAnswerQuestion
													answers={answersIndices}
													score={true}
													number={idx + 1}
													question={question}
													key={idx}
													onAnswer={() => {}}
												/>
											);
										}
										return (
											<MultiAnswerQuestion answers={answersIndices} score={true} number={idx + 1} question={question} key={idx} onAnswer={() => {}} />
										);
									})}
							</div>
						</>
					)}
				</div>
			</main>
		</>
	);
}
