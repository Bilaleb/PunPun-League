"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import leagueLogo from "../Canva AI Image Oct 2, 2026 at 8_15_16 AM.jpeg";

const clubs = [
	{ id: "deportivo", name: "Deportivo La Coruna", short: "DEP", color: "#1c4c9a", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/5/56/RC_Deportivo_A_Coru%C3%B1a_logo_2026.svg/330px-RC_Deportivo_A_Coru%C3%B1a_logo_2026.svg.png" },
	{ id: "levante", name: "Levante", short: "LEV", color: "#a51e37", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/7/7b/Levante_Uni%C3%B3n_Deportiva%2C_S.A.D._logo.svg/330px-Levante_Uni%C3%B3n_Deportiva%2C_S.A.D._logo.svg.png" },
	{ id: "hull", name: "Hull City", short: "HUL", color: "#e6a522", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/5/54/Hull_City_A.F.C._logo.svg/330px-Hull_City_A.F.C._logo.svg.png" },
	{ id: "ipswich", name: "Ipswich Town", short: "IPS", color: "#2d6da5", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/4/43/Ipswich_Town.svg/330px-Ipswich_Town.svg.png" },
	{ id: "brest", name: "Brest", short: "BRE", color: "#c3273f", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/0/05/Stade_Brestois_29_logo.svg/330px-Stade_Brestois_29_logo.svg.png" },
	{ id: "paris", name: "Paris FC", short: "PFC", color: "#172e57", logo: "https://thumb.wikimedia.org/wikipedia/en/thumb/9/9f/Paris_FC_logo.svg/330px-Paris_FC_logo.svg.png" },
	{ id: "schalke", name: "Schalke 04", short: "S04", color: "#1681bd", logo: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/FC_Schalke_04_Logo.svg/330px-FC_Schalke_04_Logo.svg.png" },
	{ id: "gladbach", name: "Borussia M'gladbach", short: "BMG", color: "#16864b", logo: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/330px-Borussia_M%C3%B6nchengladbach_logo.svg.png" },
];

const matches = [
	{ home: "deportivo", homeGoals: 8, away: "brest", awayGoals: 1 },
	{ home: "deportivo", homeGoals: 8, away: "hull", awayGoals: 5 },
	{ home: "ipswich", homeGoals: 9, away: "levante", awayGoals: 1, redCard: true },
	{ home: "ipswich", homeGoals: 6, away: "levante", awayGoals: 5 },
	{ home: "deportivo", homeGoals: 6, away: "ipswich", awayGoals: 5 },
];

const clubById = Object.fromEntries(clubs.map((club) => [club.id, club]));

function getStandings() {
	const table = clubs.map((club, order) => ({
		...club,
		order,
		played: 0,
		wins: 0,
		draws: 0,
		losses: 0,
		goalsFor: 0,
		goalsAgainst: 0,
		points: 0,
		form: [],
	}));
	const stats = Object.fromEntries(table.map((club) => [club.id, club]));

	matches.forEach((match) => {
		const home = stats[match.home];
		const away = stats[match.away];
		home.played += 1;
		away.played += 1;
		home.goalsFor += match.homeGoals;
		home.goalsAgainst += match.awayGoals;
		away.goalsFor += match.awayGoals;
		away.goalsAgainst += match.homeGoals;

		if (match.homeGoals > match.awayGoals) {
			home.wins += 1;
			home.points += 3;
			away.losses += 1;
			home.form.push("W");
			away.form.push("L");
		} else if (match.homeGoals < match.awayGoals) {
			away.wins += 1;
			away.points += 3;
			home.losses += 1;
			home.form.push("L");
			away.form.push("W");
		} else {
			home.draws += 1;
			away.draws += 1;
			home.points += 1;
			away.points += 1;
			home.form.push("D");
			away.form.push("D");
		}
	});

	return table
		.map((club) => ({ ...club, goalDifference: club.goalsFor - club.goalsAgainst }))
		.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.order - b.order);
}

function ClubMark({ club }) {
	return (
		<span className="club-mark" style={{ "--club-color": club.color }} aria-hidden="true">
			<span className="club-mark-initial">{club.short.slice(0, 1)}</span>
			<Image src={club.logo} alt="" width={96} height={96} unoptimized onError={(event) => { event.currentTarget.style.display = "none"; }} />
		</span>
	);
}

function FormDots({ form }) {
	if (form.length === 0) return <span className="form-empty">-</span>;
	return (
		<span className="form-dots" aria-label={`Last results: ${form.join(", ")}`}>
			{form.slice(-5).map((result, index) => (
				<span className={`form-dot form-${result.toLowerCase()}`} key={`${result}-${index}`} title={result}>
					{result}
				</span>
			))}
		</span>
	);
}

function MatchRow({ match, index }) {
	const home = clubById[match.home];
	const away = clubById[match.away];
	return (
		<article className="match-row">
			<span className="match-number">{String(index + 1).padStart(2, "0")}</span>
			<div className="match-team match-home"><ClubMark club={home} /><span>{home.name}</span></div>
			<span className="match-score">{match.homeGoals}<span>:</span>{match.awayGoals}</span>
			<div className="match-team match-away"><ClubMark club={away} /><span>{away.name}</span></div>
			{match.redCard ? <span className="red-card-note"><i /> RED CARD</span> : <span className="match-complete">FT</span>}
		</article>
	);
}

function StandingsView({ table }) {
	return (
		<main className="main-content">
			<section className="intro-row">
				<div>
					<p className="eyebrow">THE LEAGUE TABLE</p>
					<h1>Every point<br /><span>counts.</span></h1>
				</div>
				<div className="intro-brand"><Image src={leagueLogo} alt="PunPun League football logo" priority /><p className="intro-copy">Eight clubs. One table.<br />The season is just getting started.</p></div>
			</section>

			<section className="dashboard-grid" aria-label="League standings and latest results">
				<div className="table-panel">
					<div className="panel-heading">
						<div><p className="eyebrow">2026 / 27 SEASON</p><h2>Standings</h2></div>
						<span className="played-count"><b>{matches.length}</b> MATCHES PLAYED</span>
					</div>
					<div className="table-scroll">
						<table className="league-table">
							<thead>
								<tr>
									<th className="position-col">#</th><th className="club-col">Club</th><th title="Played">P</th><th title="Wins">W</th><th title="Draws">D</th><th title="Losses">L</th><th title="Goals for">GF</th><th title="Goals against">GA</th><th title="Goal difference">GD</th><th className="form-col">Last 5</th><th className="points-col">Pts</th>
								</tr>
							</thead>
							<tbody>
								{table.map((club, index) => (
									<tr className={club.id === "deportivo" ? "leader-row" : ""} key={club.id}>
										<td className="position-cell">{String(index + 1).padStart(2, "0")}</td>
										<td className="club-cell"><ClubMark club={club} /><span>{club.name}</span></td>
										<td>{club.played}</td><td>{club.wins}</td><td>{club.draws}</td><td>{club.losses}</td><td>{club.goalsFor}</td><td>{club.goalsAgainst}</td>
										<td className={club.goalDifference > 0 ? "positive-diff" : ""}>{club.goalDifference > 0 ? `+${club.goalDifference}` : club.goalDifference}</td>
										<td className="form-cell"><FormDots form={club.form} /></td>
										<td className="points-cell">{club.points}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="table-footnote"><span><i className="legend-dot" /> Promotion places</span><span>Ranked by points, goal difference, goals scored</span></div>
				</div>

				<aside className="results-panel">
					<div className="panel-heading results-heading">
						<div><p className="eyebrow">THE ACTION SO FAR</p><h2>Latest results</h2></div>
						<span className="live-mark"><i /> FINAL</span>
					</div>
					<div className="match-list">
						{[...matches].reverse().map((match, index) => <MatchRow match={match} index={matches.length - 1 - index} key={`${match.home}-${match.away}-${index}`} />)}
					</div>
					<div className="results-footer"><span>ALL FIXTURES COMPLETE</span><span>05 / 05</span></div>
				</aside>
			</section>
			<footer className="page-footer"><span>PUNPUN LEAGUE</span><span>8 CLUBS <i /> 1 CHAMPION</span></footer>
		</main>
	);
}

function ResultsView() {
	return (
		<main className="main-content results-page">
			<section className="intro-row">
				<div><p className="eyebrow">2026 / 27 SEASON</p><h1>The story<br /><span>so far.</span></h1></div>
				<div className="intro-brand"><Image src={leagueLogo} alt="PunPun League football logo" /><p className="intro-copy">Every result from the<br />PunPun League season.</p></div>
			</section>
			<section className="full-results">
				<div className="panel-heading"><div><p className="eyebrow">MATCHDAY ARCHIVE</p><h2>Played matches</h2></div><span className="played-count"><b>{matches.length}</b> FINAL SCORES</span></div>
				<div className="match-list">{[...matches].reverse().map((match, index) => <MatchRow match={match} index={matches.length - 1 - index} key={`${match.home}-${match.away}-${index}`} />)}</div>
			</section>
			<footer className="page-footer"><span>PUNPUN LEAGUE</span><span>8 CLUBS <i /> 1 CHAMPION</span></footer>
		</main>
	);
}

function LeagueApp() {
	const location = useLocation();
	const table = getStandings();
	const isResults = location.pathname === "/results";
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(window.localStorage.getItem("punpun-theme") === "dark");
	}, []);

	function toggleTheme() {
		const nextIsDark = !isDark;
		setIsDark(nextIsDark);
		window.localStorage.setItem("punpun-theme", nextIsDark ? "dark" : "light");
	}

	return (
		<div className={`site-shell${isDark ? " theme-dark" : ""}`}>
			<header className="topbar">
				<Link className="brand" to="/" aria-label="PunPun League home">
					<span className="brand-ball" aria-hidden="true"><span /></span>
					<span className="brand-name">PUNPUN <b>LEAGUE</b></span>
				</Link>
				<nav className="main-nav" aria-label="Main navigation">
					  <Link className={!isResults ? "nav-link active" : "nav-link"} to="/">Standings</Link>
					  <Link className={isResults ? "nav-link active" : "nav-link"} to="/results">Results <span className="nav-count">05</span></Link>
				</nav>
				<button
					className="theme-toggle"
					type="button"
					role="switch"
					aria-checked={isDark}
					aria-label={`Switch to ${isDark ? "light" : "sombre"} theme`}
					title={`Switch to ${isDark ? "light" : "sombre"} theme`}
					onClick={toggleTheme}
				>
					<span className="theme-label">Sombre</span>
					<span className="theme-track"><span /></span>
				</button>
				<div className="season-label"><span className="season-dot" /> SEASON 2026 / 27</div>
			</header>
			<Routes>
				<Route path="/" element={<StandingsView table={table} />} />
				<Route path="/results" element={<ResultsView />} />
				<Route path="*" element={<StandingsView table={table} />} />
			</Routes>
		</div>
	);
}

export default function Home() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return <HashRouter><LeagueApp /></HashRouter>;
}
