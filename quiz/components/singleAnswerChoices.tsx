import { Choice } from "@/types";
import { useEffect, useState } from "react";

interface props {
	choices: Choice[];
	questionIndex: number;
	onChange: (choices: Choice[]) => void;
}

const SingleAnswerChoices: React.FC<props> = ({ choices, questionIndex, onChange }) => {
	const [choice, setChoices] = useState<Choice[]>(choices);

	const addChoice = () => {
		setChoices((prev) => [...prev, { text: "", index: choices.length, is_answer: false }]);
	};

	const deleteChoice = (index: number) => {
		setChoices((prev) => {
			const filtered = prev.filter((choice) => index !== choice.index);
			const mapped = filtered.map((choice, idx) => {
				return { ...choice, index: idx };
			});
			return mapped;
		});
	};

	const onTextChange = (text: string, index: number) => {
		setChoices((prev) =>
			prev.map((choice) => {
				if (choice.index === index)
					return {
						...choice,
						text: text,
					};
				return choice;
			})
		);
	};

	const onRadioChange = (index: number, checked: boolean) => {
		setChoices((prev) =>
			prev.map((choice) => {
				if (choice.index === index)
					return {
						...choice,
						is_answer: checked,
					};
				return {
					...choice,
					is_answer: !checked,
				};
			})
		);
	};

	useEffect(() => {
		onChange(choice);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [choice]);

	return (
		<div>
			{/* <pre>{JSON.stringify(choices, null, 2)}</pre> */}
			{choices.length !== 0 &&
				choices.map((choice, idx) => {
					return (
						<div
							key={idx}
							className={
								choice.is_answer
									? "flex flex-row px-5 py-2 my-2 border rounded bg-sky-100"
									: "flex flex-row px-5 py-2 my-2 border rounded bg-transparent"
							}
						>
							<input onChange={(e) => onRadioChange(choice.index, e.target.checked)} type="radio" name={`choice${questionIndex}`} />
							<input
								value={choice.text}
								onChange={(e) => onTextChange(e.target.value, choice.index)}
								placeholder="Enter choice"
								type="text"
								className="border-none p-2 w-full ml-5 bg-transparent"
							/>
							<button className="text-rose-800 ml-5" onClick={() => deleteChoice(choice.index)}>
								delete
							</button>
						</div>
					);
				})}
			<button className="w-full border p-3 rounded-lg hover:bg-slate-100 bg-white" onClick={addChoice}>
				+ Add Choice
			</button>
		</div>
	);
};

export default SingleAnswerChoices;
