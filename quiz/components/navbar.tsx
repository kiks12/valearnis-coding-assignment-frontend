"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface props {
	active: ActivePage;
}

export enum ActivePage {
	QUIZZES,
	CREATE,
	NONE,
}

const NavBar: React.FC<props> = ({ active }) => {
	const router = useRouter();

	const [activePage, setActivePage] = useState<ActivePage>(active);

	const goHome = () => {
		setActivePage(ActivePage.QUIZZES);
		router.push("/");
	};

	const createQuiz = () => {
		setActivePage(ActivePage.CREATE);
		router.push("/create");
	};

	return (
		<header className="w-screen border-b-2 border-slate-100 p-6 sticky top-0 self-start bg-white">
			<nav className="flex flex-row justify-between w-100">
				<ul>
					<li>Coding Assignment</li>
				</ul>
				<ul className="flex flex-row w-100">
					<li className={activePage == ActivePage.QUIZZES ? "px-5 font-semibold" : "px-5"}>
						<button onClick={goHome}>Quizzes</button>
					</li>
					<li className={activePage == ActivePage.CREATE ? "px-5 font-semibold" : "px-5"}>
						<button onClick={createQuiz}>Create</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default NavBar;
