"use client";

import { Quiz } from "@/types";

interface props {
	quiz: Quiz;
	onTakeQuiz: () => void;
	onViewScore: () => void;
	onDeleteQuiz: () => void;
}

const QuizCard: React.FC<props> = ({ quiz, onTakeQuiz, onViewScore, onDeleteQuiz }) => {
	return (
		<div className="flex flex-col border rounded-2xl justify-between cursor-pointer hover:border-slate-300 p-5">
			<div className="flex flex-col">
				<div className="flex flex-row w-100 justify-between break-all">
					<h2 className="text-lg font-semibold">{quiz.title}</h2>
					<small>{quiz.questions.length.toString()} Items</small>
				</div>
				<p className="text-md mt-2 font-light break-all">{quiz.description}</p>
			</div>
			<div className="mt-10 flex lg:flex-row md:flex-col sm:flex-col">
				<button
					className="py-2 px-5 border border-rose-800 text-rose-800 rounded-lg mr-3 hover:bg-rose-800 hover:text-white lg:mr-3 sm:mr-0 lg:mb-0 sm:mb-3"
					onClick={onDeleteQuiz}
				>
					Delete
				</button>
				{quiz?.submitted_answers!.length !== 0 ? (
					<button
						className="py-2 px-5 border rounded-lg text-center w-full bg-slate-500 text-white hover:bg-slate-600 hover:shadow"
						onClick={onViewScore}
					>
						View Score
					</button>
				) : (
					<button
						className="py-2 px-5 border rounded-lg text-center w-full bg-slate-700 text-white hover:bg-slate-800 hover:shadow"
						onClick={onTakeQuiz}
					>
						Take Quiz
					</button>
				)}
			</div>
		</div>
	);
};

export default QuizCard;
