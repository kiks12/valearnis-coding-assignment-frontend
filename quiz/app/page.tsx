"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";

import { GET_QUIZZES_API, QUIZ_BASE_API } from "@/endpoints";
import { Quiz } from "../types";

import NavBar, { ActivePage } from "@/components/navbar";
import QuizCard from "@/components/quizCard";

export default function Home() {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		axios
			.get(GET_QUIZZES_API)
			.then((res) => {
				setQuizzes(res.data.quizzes);
				setIsLoading(false);
			})
			.catch((e: AxiosError) => console.error(e));
	}, []);

	const deleteQuiz = async (id: number) => {
		const confirmResponse = confirm("Are you sure you want to delete this quiz?");

		if (confirmResponse) {
			const res = await axios.delete(QUIZ_BASE_API + id + "/delete");

			if (res.status === 200) {
				setQuizzes((prev) => {
					return prev.filter((quiz) => quiz.id !== id);
				});
				return;
			}

			alert("There is something wrong please try again later.");
			return;
		}
	};

	const navigateQuiz = (quizId: number) => {
		router.push(`/quiz/${quizId}`);
	};

	const navigateQuizScore = (quizId: number) => {
		router.push(`/quiz/${quizId}/score`);
	};

	return (
		<>
			<NavBar active={ActivePage.QUIZZES} />
			<main>
				{isLoading ? (
					<div className="w-100 flex justify-center align-center">
						<p>Loading...</p>
					</div>
				) : (
					<main className="flex flex-col md:mx-auto lg:w-3/4 md:w-4/5 p-3">
						<h1 className="text-3xl font-bold">Quizzes</h1>
						<div className="py-4 grid lg:grid-cols-4 md:grid-cols-2 gap-4">
							{quizzes.map((quiz: Quiz, idx) => {
								return (
									<QuizCard
										key={idx}
										quiz={quiz}
										onDeleteQuiz={() => deleteQuiz(quiz?.id!)}
										onViewScore={() => navigateQuizScore(quiz?.id!)}
										onTakeQuiz={() => navigateQuiz(quiz?.id!)}
									/>
								);
							})}
						</div>
					</main>
				)}
			</main>
		</>
	);
}
