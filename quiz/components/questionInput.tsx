import { Choice, Question, QuestionType } from "@/types";
import { ChangeEvent } from "react";
import SingleAnswerChoices from "./singleAnswerChoices";
import MultiAnswerChoices from "./multiAnswerChoices";

interface props {
	onQuestionTypeChange: (type: QuestionType) => void;
	onQuestionTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onQuestionDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onQuestionChoicesChange: (choices: Choice[]) => void;
	question: Question;
	onDelete: () => void;
	index: number;
	active: boolean;
	setActive: () => void;
}

const QuestionInput: React.FC<props> = ({
	question,
	index,
	onDelete,
	active,
	setActive,
	onQuestionTypeChange: onTypeChange,
	onQuestionTextChange,
	onQuestionDescriptionChange,
	onQuestionChoicesChange,
}) => {
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
					<textarea onChange={onQuestionTextChange} value={question.text} id={`question${index}`} className="w-full p-1 border rounded" />
				</div>
				<div className="flex flex-col mt-3">
					<label htmlFor={`description${index}`}>Description: (Optional)</label>
					<input
						value={question.description}
						id={`description${index}`}
						onChange={onQuestionDescriptionChange}
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
					{question.question_type == QuestionType.SA ? (
						<SingleAnswerChoices questionIndex={index} choices={question.choices} onChange={onQuestionChoicesChange} />
					) : (
						<MultiAnswerChoices questionIndex={index} choices={question.choices} onChange={onQuestionChoicesChange} />
					)}
				</div>
			</div>
		</div>
	);
};

export default QuestionInput;
