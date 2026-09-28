import { readFile, writeFile } from 'node:fs/promises';

const mainSource = await readFile(new URL('../main.js', import.meta.url), 'utf8');
const teamPattern = /^[ \t]*\{ name: ("(?:[^"\\]|\\.)*"), wins: \d+, losses: \d+, id: "(\d+)" \}/gm;
const teamsById = new Map();

for (const match of mainSource.matchAll(teamPattern)) {
    const team = { name: JSON.parse(match[1]), id: match[2] };
    teamsById.set(team.id, team);
}

const teams = [...teamsById.values()];
if (teams.length < 100) {
    throw new Error(`Expected at least 100 fallback teams, found ${teams.length}.`);
}

const now = new Date();
const season = now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
const records = [];

async function fetchRecord(team) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team.id}?season=${season}`;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'college-football-records-updater' },
                signal: AbortSignal.timeout(20000)
            });
            if (!response.ok) throw new Error(`ESPN returned HTTP ${response.status}`);

            const data = await response.json();
            const summary = data.team?.record?.items?.find(item => item.type === 'total')?.summary;
            const match = summary?.match(/^(\d+)-(\d+)(?:-\d+)?$/);
            if (!match) throw new Error(`No overall record found for ${team.name}`);

            return { ...team, wins: Number(match[1]), losses: Number(match[2]) };
        } catch (error) {
            if (attempt === 3) throw new Error(`Could not update ${team.name}: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
}

for (let index = 0; index < teams.length; index += 8) {
    const batch = teams.slice(index, index + 8);
    records.push(...await Promise.all(batch.map(fetchRecord)));
    console.log(`Updated ${records.length} of ${teams.length} team records.`);
}

const recordData = {
    provider: 'ESPN',
    season,
    updatedAt: now.toISOString(),
    teams: records.sort((first, second) => first.name.localeCompare(second.name))
};

await writeFile(
    new URL('../records.json', import.meta.url),
    `${JSON.stringify(recordData, null, 2)}\n`
);
console.log(`Wrote ${records.length} team records for the ${season} season.`);
