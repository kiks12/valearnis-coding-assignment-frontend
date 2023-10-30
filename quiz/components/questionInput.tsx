import { Choice, Question, QuestionType } from "@/types";
import { ChangeEvent, useEffect, useState } from "react";
import SingleAnswerChoices from "./singleAnswerChoices";
import MultiAnswerChoices from "./multiAnswerChoices";

interface props {
	question: Question;
	onChange: (question: Question, index: number) => void;
	onDelete: () => void;
	index: number;
	active: boolean;
	setActive: () => void;
}

const QuestionInput: React.FC<props> = ({ question, onChange, index, onDelete, active, setActive }) => {
	const [questionData, setQuestionData] = useState<Question>(question);

	useEffect(() => {
		onChange(questionData, index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questionData]);

	useEffect(() => {
		setQuestionData(question);
	}, [question]);

	const onTypeChange = (type: QuestionType) => {
		setQuestionData((prev) => {
			return {
				...prev,
				question_type: type,
			};
		});
	};

	const onChoicesChange = (choices: Choice[]) => {
		setQuestionData((prev) => {
			return {
				...prev,
				choices: choices,
			};
		});
	};

	const onQuestionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setQuestionData((prev) => {
			return {
				...prev,
				text: event.target.value,
			};
		});
	};

	const onDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuestionData((prev) => {
			return {
				...prev,
				description: event.target.value,
			};
		});
	};

	return (
		<div className={active ? "mt-10 mb-20 p-5 rounded-lg shadow border" : "mt-10 mb-20 p-5"} onClick={setActive}>
			<div className="">
				<div className="flex flex-row-reverse">
					<button className="text-rose-800 py-1 px-5 border rounded-lg border-rose-800 hover:bg-rose-800 hover:text-white" onClick={onDelete}>
						delete
					</button>
				</div>
				<div>
					<label htmlFor={`question${index}`}>Question: </label>
					<textarea onChange={onQuestionChange} value={questionData.text} id={`question${index}`} className="w-full p-1 border rounded" />
				</div>
				<div className="flex flex-col mt-3">
					<label htmlFor={`description${index}`}>Description: (Optional)</label>
					<input
						value={questionData.description}
						id={`description${index}`}
						onChange={onDescriptionChange}
						type="text"
						className="p-3 w-full border"
					/>
				</div>
				<div className="flex flex-col mt-3">
					<label htmlFor={`type${index}`}>Type:</label>
					<select className="p-3 border rounded" id={`type${index}`} onChange={(e) => onTypeChange(e.target.value as QuestionType)}>
						<option value={QuestionType.SA}>Single Answer</option>
						<option value={QuestionType.MA}>Multi Answer</option>
					</select>
				</div>
				<div className="mt-3">
					<p>Choices: </p>
					{questionData.question_type == QuestionType.SA ? (
						<SingleAnswerChoices questionIndex={index} choices={questionData.choices} onChange={onChoicesChange} />
					) : (
						<MultiAnswerChoices questionIndex={index} choices={questionData.choices} onChange={onChoicesChange} />
					)}
				</div>
			</div>
		</div>
	);
};

export default QuestionInput;
