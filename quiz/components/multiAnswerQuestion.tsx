import { Answer, Choice, Question } from "@/types";
import { useEffect, useState } from "react";

interface props {
	number: number;
	question: Question;
	onAnswer: (answer: Answer) => void;
	score: boolean;
	answers: { index: number; isCorrect: boolean }[];
}

const MultiAnswerQuestion: React.FC<props> = ({ question, number, onAnswer, score, answers }) => {
	const [answer, setAnswer] = useState<Answer>({
		question: question?.id!,
		answer: [],
	});

	const onChoiceClick = (checked: boolean, choice: Choice) => {
		if (checked) {
			if (answer.answer.some((choiceAnswer) => choiceAnswer.index == choice.index)) {
				setAnswer((prev) => {
					return {
						...prev,
						answer: prev.answer.map((answer) => {
							if (answer.index == choice.index) return { question: choice.question, index: choice.index, text: choice.text };
							return answer;
						}),
					};
				});
			} else {
				setAnswer((prev) => {
					return {
						...prev,
						answer: [...prev.answer, { question: choice.question, index: choice.index, text: choice.text }],
					};
				});
			}
		} else {
			setAnswer((prev) => {
				return {
					...prev,
					answer: prev.answer.filter((answer) => answer.index != choice.index),
				};
			});
		}
	};

	const clear = () => {
		setAnswer((prev) => {
			return {
				...prev,
				answer: [],
			};
		});
	};

	useEffect(() => {
		onAnswer(answer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [answer]);

	return (
		<div className="flex flex-col mt-10">
			<div className="flex flex-col">
				<div className="flex flex-row">
					<p>{number}.</p>
					<p className="ml-5">{question.text}</p>
				</div>
				<div>
					<small>
						<i>{question.description}</i>
					</small>
				</div>
			</div>
			<div className="flex flex-col">
				<form>
					{question.choices.length !== 0 &&
						question.choices.map((choice: Choice, idx) => {
							return (
								<div
									key={idx}
									className={
										score && answers.some((answer) => answer.index === choice.index && answer.isCorrect)
											? "p-2 my-2 border rounded bg-green-100 border border-green-200"
											: answers.some((answer) => answer.index === choice.index && !answer.isCorrect)
											? "p-2 my-2 border rounded bg-rose-100 border border-rose-100"
											: "p-2 my-2 border rounded"
									}
								>
									<input
										disabled={score}
										checked={
											score
												? answers.some((answer) => answer.index === choice.index) || choice.is_answer
												: answer.answer.some((answer) => answer.index == choice.index)
										}
										className="p-4 mr-5"
										type="checkbox"
										name={`answer${question.id}`}
										id={`answer${question.id}${idx}`}
										onChange={(e) => onChoiceClick(e.target.checked, choice)}
									/>
									<label htmlFor={`answer${question.id}${idx}`}>{choice.text}</label>
								</div>
							);
						})}
				</form>
				<div className="flex flex-row-reverse">
					{answer.answer.length !== 0 && (
						<button className="py-1 px-5 border border-sky-600 text-sky-600 rounded-lg mt-1 hover:bg-sky-600 hover:text-white" onClick={clear}>
							Clear
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default MultiAnswerQuestion;
