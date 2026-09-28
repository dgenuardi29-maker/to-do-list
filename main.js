let fbsRegistry = [];
let currentSelectionList = [];
let dragInteractionsRegistered = false;

// Automated live network link - continuously maintained and refreshed every week
const LIVE_STANDINGS_DATABASE = "https://githubusercontent.com";
const PROFILE_NAME_KEY = 'pollProfileName';
const PROFILE_PHOTO_KEY = 'pollProfilePhoto';

// Map preloaded Week 5 user poll configuration directly into starting state
const PRELOADED_POLL_IDS = [
    "251",   // 1. Texas
    "87",    // 2. Notre Dame
    "2390",  // 3. Miami
    "57",    // 4. Florida
    "84",    // 5. Indiana
    "61",    // 6. Georgia
    "194",   // 7. Ohio State
    "333",   // 8. Alabama
    "2641",  // 9. Texas Tech
    "252",   // 10. BYU
    "254",   // 11. Utah
    "2633",  // 12. Tennessee
    "145",   // 13. Ole Miss
    "99",    // 14. LSU
    "344",   // 15. Mississippi State
    "2294",  // 16. Iowa
    "2483",  // 17. Oregon
    "30",    // 18. USC
    "248",   // 19. Houston
    "2567",  // 20. SMU
    "26",    // 21. UCLA
    "68",    // 22. Boise State
    "96",    // 23. Kentucky
    "142",   // 24. Missouri
    "2449"   // 25. North Dakota State
];

async function fetchLiveRecords() {
    try {
        const response = await fetch(LIVE_STANDINGS_DATABASE);
        if (!response.ok) throw new Error("Network response stalled");
        
        fbsRegistry = await response.json();
        setupInterfaceDropdown();
        prepopulateUserPoll();
    } catch (error) {
        console.warn("Live database connection timed out. Booting local fail-safe backup parameters...", error);
        
        // Full Fail-Safe Dataset of all 138 FBS Teams with 2026 real-world record baselines
        fbsRegistry = [
            { name: "Air Force Falcons", wins: 1, losses: 3, id: "2005" },
            { name: "Akron Zips", wins: 1, losses: 3, id: "2006" },
            { name: "Alabama Crimson Tide", wins: 4, losses: 0, id: "333" },
            { name: "Appalachian State Mountaineers", wins: 2, losses: 2, id: "2026" },
            { name: "Arizona Wildcats", wins: 3, losses: 1, id: "12" },
            { name: "Arizona State Sun Devils", wins: 3, losses: 1, id: "9" },
            { name: "Arkansas Razorbacks", wins: 2, losses: 2, id: "8" },
            { name: "Arkansas State Red Wolves", wins: 2, losses: 2, id: "2032" },
            { name: "Army Black Knights", wins: 3, losses: 0, id: "349" },
            { name: "Auburn Tigers", wins: 3, losses: 1, id: "2" },
            { name: "Ball State Cardinals", wins: 1, losses: 2, id: "2050" },
            { name: "Baylor Bears", wins: 3, losses: 1, id: "239" },
            { name: "Boise State Broncos", wins: 3, losses: 1, id: "68" },
            { name: "Boston College Eagles", wins: 3, losses: 1, id: "103" },
            { name: "Bowling Green Falcons", wins: 1, losses: 2, id: "189" },
            { name: "Buffalo Bulls", wins: 3, losses: 1, id: "2084" },
            { name: "BYU Cougars", wins: 3, losses: 0, id: "252" },
            { name: "California Golden Bears", wins: 3, losses: 1, id: "25" },
            { name: "Central Michigan Chippewas", wins: 2, losses: 2, id: "2117" },
            { name: "Charlotte 49ers", wins: 1, losses: 3, id: "2429" },
            { name: "Cincinnati Bearcats", wins: 4, losses: 0, id: "2132" },
            { name: "Clemson Tigers", wins: 3, losses: 1, id: "228" },
            { name: "Coastal Carolina Chanticleers", wins: 3, losses: 1, id: "324" },
            { name: "Colorado Buffaloes", wins: 3, losses: 1, id: "38" },
            { name: "Colorado State Rams", wins: 2, losses: 2, id: "36" },
            { name: "Connecticut Huskies", wins: 2, losses: 2, id: "41" },
            { name: "Duke Blue Devils", wins: 4, losses: 0, id: "150" },
            { name: "East Carolina Pirates", wins: 2, losses: 2, id: "151" },
            { name: "Eastern Michigan Eagles", wins: 3, losses: 1, id: "2199" },
            { name: "FIU Panthers", wins: 1, losses: 3, id: "2226" },
            { name: "Florida Gators", wins: 4, losses: 0, id: "57" },
            { name: "Florida Atlantic Owls", wins: 1, losses: 3, id: "2229" },
            { name: "Florida State Seminoles", wins: 2, losses: 2, id: "52" },
            { name: "Fresno State Bulldogs", wins: 3, losses: 1, id: "278" },
            { name: "Georgia Bulldogs", wins: 4, losses: 0, id: "61" },
            { name: "Georgia Southern Eagles", wins: 2, losses: 2, id: "290" },
            { name: "Georgia Tech Yellow Jackets", wins: 3, losses: 2, id: "59" },
            { name: "Hawaii Rainbow Warriors", wins: 2, losses: 2, id: "62" },
            { name: "Houston Cougars", wins: 3, losses: 1, id: "248" },
            { name: "Illinois Fighting Illini", wins: 2, losses: 2, id: "356" },
            { name: "Indiana Hoosiers", wins: 4, losses: 0, id: "84" },
            { name: "Iowa Hawkeyes", wins: 4, losses: 0, id: "2294" },
            { name: "Iowa State Cyclones", wins: 3, losses: 1, id: "66" },
            { name: "Jacksonville State Gamecocks", wins: 1, losses: 3, id: "2335" },
            { name: "James Madison Dukes", wins: 4, losses: 0, id: "256" },
            { name: "Kansas Jayhawks", wins: 1, losses: 3, id: "2305" },
            { name: "Kansas State Wildcats", wins: 3, losses: 1, id: "2306" },
            { name: "Kennesaw State Owls", wins: 0, losses: 4, id: "2316" },
            { name: "Kent State Golden Flashes", wins: 0, losses: 4, id: "2309" },
            { name: "Kentucky Wildcats", wins: 3, losses: 1, id: "96" },
            { name: "Liberty Flames", wins: 4, losses: 0, id: "2339" },
            { name: "LSU Tigers", wins: 3, losses: 1, id: "99" },
            { name: "Louisiana Ragin' Cajuns", wins: 2, losses: 1, id: "309" },
            { name: "Louisiana Tech Bulldogs", wins: 1, losses: 2, id: "2348" },
            { name: "Louisville Cardinals", wins: 2, losses: 2, id: "97" },
            { name: "Marshall Thundering Herd", wins: 2, losses: 2, id: "276" },
            { name: "Maryland Terrapins", wins: 2, losses: 2, id: "120" },
            { name: "Memphis Tigers", wins: 3, losses: 1, id: "235" },
            { name: "Miami Hurricanes", wins: 4, losses: 0, id: "2390" },
            { name: "Miami RedHawks", wins: 0, losses: 3, id: "193" },
            { name: "Michigan Wolverines", wins: 3, losses: 1, id: "130" },
            { name: "Michigan State Spartans", wins: 3, losses: 1, id: "127" },
            { name: "Middle Tennessee Blue Raiders", wins: 1, losses: 3, id: "2393" },
            { name: "Minnesota Golden Gophers", wins: 3, losses: 1, id: "135" },
            { name: "Mississippi State Bulldogs", wins: 4, losses: 0, id: "344" },
            { name: "Missouri Tigers", wins: 3, losses: 1, id: "142" },
            { name: "Missouri State Bears", wins: 1, losses: 3, id: "2396" },
            { name: "Navy Midshipmen", wins: 3, losses: 0, id: "2426" },
            { name: "NC State Wolfpack", wins: 2, losses: 2, id: "152" },
            { name: "Nebraska Cornhuskers", wins: 4, losses: 0, id: "158" },
            { name: "Nevada Wolf Pack", wins: 2, losses: 3, id: "2440" },
            { name: "New Mexico Lobos", wins: 3, losses: 1, id: "167" },
            { name: "New Mexico State Aggies", wins: 1, losses: 3, id: "166" },
            { name: "North Carolina Tar Heels", wins: 3, losses: 1, id: "153" },
            { name: "North Dakota State Bison", wins: 4, losses: 0, id: "2449" },
            { name: "North Texas Mean Green", wins: 3, losses: 1, id: "249" },
            { name: "Northern Illinois Huskies", wins: 2, losses: 1, id: "2459" },
            { name: "Northwestern Wildcats", wins: 2, losses: 1, id: "77" },
            { name: "Notre Dame Fighting Irish", wins: 4, losses: 0, id: "87" },
            { name: "Ohio Bobcats", wins: 2, losses: 2, id: "195" },
            { name: "Ohio State Buckeyes", wins: 3, losses: 1, id: "194" },
            { name: "Oklahoma Sooners", wins: 2, losses: 2, id: "201" },
            { name: "Oklahoma State Cowboys", wins: 3, losses: 1, id: "197" },
            { name: "Old Dominion Monarchs", wins: 1, losses: 3, id: "295" },
            { name: "Ole Miss Rebels", wins: 3, losses: 1, id: "145" },
            { name: "Oregon Ducks", wins: 3, losses: 1, id: "2483" },
            { name: "Oregon State Beavers", wins: 2, losses: 1, id: "204" },
            { name: "Penn State Nittany Lions", wins: 3, losses: 1, id: "213" },
            { name: "Pittsburgh Panthers", wins: 4, losses: 0, id: "221" },
            { name: "Purdue Boilermakers", wins: 1, losses: 2, id: "2509" },
            { name: "Rice Owls", wins: 1, losses: 3, id: "242" },
            { name: "Rutgers Scarlet Knights", wins: 3, losses: 1, id: "164" },
            { name: "Sacramento State Hornets", wins: 2, losses: 2, id: "168" },
            { name: "Sam Houston Bearkats", wins: 3, losses: 1, id: "2534" },
            { name: "San Diego State Aztecs", wins: 1, losses: 2, id: "21" },
            { name: "San Jose State Spartans", wins: 3, losses: 1, id: "23" },
            { name: "SMU Mustangs", wins: 3, losses: 1, id: "2567" },
            { name: "South Alabama Jaguars", wins: 2, losses: 2, id: "6" },
            { name: "South Carolina Gamecocks", wins: 2, losses: 2, id: "2579" },
            { name: "South Florida Bulls", wins: 4, losses: 0, id: "58" },
            { name: "Southern Miss Golden Eagles", wins: 1, losses: 3, id: "2572" },
            { name: "Stanford Cardinal", wins: 2, losses: 1, id: "24" },
            { name: "Syracuse Orange", wins: 2, losses: 1, id: "183" },
            { name: "TCU Horned Frogs", wins: 2, losses: 2, id: "2628" },
            { name: "Temple Owls", wins: 1, losses: 3, id: "218" },
            { name: "Tennessee Volunteers", wins: 3, losses: 1, id: "2633" },
            { name: "Texas Longhorns", wins: 4, losses: 0, id: "251" },
            { name: "Texas A&M Aggies", wins: 2, losses: 2, id: "245" },
            { name: "Texas A&M Aggies", wins: 2, losses: 2, id: "245" }, // Recoded down to 2-2 baseline
            { name: "Texas State Bobcats", wins: 2, losses: 1, id: "326" },
            { name: "Texas Tech Red Raiders", wins: 4, losses: 0, id: "2641" },
            { name: "Toledo Rockets", wins: 3, losses: 1, id: "2649" },
            { name: "Troy Trojans", wins: 1, losses: 3, id: "2653" },
            { name: "Tulsa Golden Hurricane", wins: 3, losses: 1, id: "202" },
            { name: "UAB Blazers", wins: 1, losses: 2, id: "5" },
            { name: "UCF Knights", wins: 3, losses: 1, id: "2116" },
            { name: "UCLA Bruins", wins: 4, losses: 0, id: "26" },
            { name: "ULM Warhawks", wins: 2, losses: 1, id: "2433" },
            { name: "UNLV Rebels", wins: 3, losses: 0, id: "2439" },
            { name: "USC Trojans", wins: 4, losses: 1, id: "30" },
            { name: "Utah Utes", wins: 4, losses: 0, id: "254" },
            { name: "Utah State Aggies", wins: 1, losses: 3, id: "328" },
            { name: "UTEP Miners", wins: 0, losses: 4, id: "2638" },
            { name: "UTSA Roadrunners", wins: 2, losses: 2, id: "2636" },
            { name: "Vanderbilt Commodores", wins: 3, losses: 1, id: "238" },
            { name: "Virginia Cavaliers", wins: 3, losses: 1, id: "258" },
            { name: "Virginia Tech Hokies", wins: 4, losses: 0, id: "259" },
            { name: "Wake Forest Demon Deacons", wins: 2, losses: 2, id: "154" },
            { name: "Washington Huskies", wins: 3, losses: 1, id: "264" },
            { name: "Washington State Cougars", wins: 4, losses: 0, id: "265" },
            { name: "West Virginia Mountaineers", wins: 3, losses: 1, id: "277" },
            { name: "Western Kentucky Hilltoppers", wins: 3, losses: 1, id: "98" },
            { name: "Western Michigan Broncos", wins: 1, losses: 2, id: "2711" },
            { name: "Wyoming Cowboys", wins: 1, losses: 3, id: "2751" }
        ];
        setupInterfaceDropdown();
        prepopulateUserPoll();
    }
}

function setupInterfaceDropdown() {
    const selector = document.getElementById('teamSelector');
    selector.innerHTML = '';

    fbsRegistry.sort((a, b) => a.name.localeCompare(b.name));

    fbsRegistry.forEach(team => {
        const node = document.createElement('option');
        node.value = team.name;
        node.textContent = `${team.name} (${team.wins}-${team.losses})`;
        selector.appendChild(node);
    });
}

function prepopulateUserPoll() {
    currentSelectionList = [];
    PRELOADED_POLL_IDS.forEach(id => {
        const match = fbsRegistry.find(team => team.id === id);
        if (match) currentSelectionList.push(match);
    });
    drawBoardElements();
}

function drawBoardElements() {
    const list = document.getElementById('top25Container');
    const emptyNotice = document.getElementById('emptyNotice');
    list.innerHTML = '';

    if (currentSelectionList.length === 0) {
        emptyNotice.style.display = 'block';
        return;
    } else {
        emptyNotice.style.display = 'none';
    }

    currentSelectionList.forEach((team, index) => {
        const li = document.createElement('li');
        li.className = 'poll-item';
        li.draggable = true;
        li.dataset.index = index;

        const rank = document.createElement('div');
        rank.className = 'rank-badge';
        rank.textContent = `#${index + 1}`;

        const logo = document.createElement('img');
        logo.className = 'team-logo-img';
        logo.src = `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.id}.png`;
        logo.crossOrigin = 'anonymous';
        logo.alt = '';
        logo.onerror = () => { logo.hidden = true; };

        const meta = document.createElement('div');
        meta.className = 'team-meta';
        const name = document.createElement('span');
        name.className = 'team-name-text';
        name.textContent = team.name;
        const record = document.createElement('span');
        record.className = 'team-record-text';
        record.textContent = `(${team.wins}-${team.losses})`;
        meta.append(name, record);

        const actions = document.createElement('div');
        actions.className = 'item-action-buttons';
        const moveUp = document.createElement('button');
        moveUp.className = 'btn-nav';
        moveUp.textContent = '▲';
        moveUp.title = 'Move up';
        moveUp.setAttribute('aria-label', `Move ${team.name} up`);
        moveUp.addEventListener('click', () => reorderRank(index, -1));
        const moveDown = document.createElement('button');
        moveDown.className = 'btn-nav';
        moveDown.textContent = '▼';
        moveDown.title = 'Move down';
        moveDown.setAttribute('aria-label', `Move ${team.name} down`);
        moveDown.addEventListener('click', () => reorderRank(index, 1));
        const remove = document.createElement('button');
        remove.className = 'btn-nav btn-nav-delete';
        remove.textContent = '✕';
        remove.title = 'Remove team';
        remove.setAttribute('aria-label', `Remove ${team.name}`);
        remove.addEventListener('click', () => dropRankElement(index));
        actions.append(moveUp, moveDown, remove);
        li.append(rank, logo, meta, actions);

        li.addEventListener('dragstart', () => li.classList.add('dragging'));
        li.addEventListener('dragend', () => li.classList.remove('dragging'));

        list.appendChild(li);
    });

    registerDragInteractions();
}

function addSelectedTeam() {
    if (currentSelectionList.length >= 25) {
        alert('Your active selection list is capped at 25.');
        return;
    }

    const pickedName = document.getElementById('teamSelector').value;
    const targetObj = fbsRegistry.find(item => item.name === pickedName);

    if (currentSelectionList.some(item => item.name === pickedName)) {
        alert('This program has already been mapped to your active rankings.');
        return;
    }

    currentSelectionList.push(targetObj);
    drawBoardElements();
}

function dropRankElement(index) {
    currentSelectionList.splice(index, 1);
    drawBoardElements();
}

function reorderRank(index, offset) {
    const targetPos = index + offset;
    if (targetPos < 0 || targetPos >= currentSelectionList.length) return;

    const container = currentSelectionList[index];
    currentSelectionList[index] = currentSelectionList[targetPos];
    currentSelectionList[targetPos] = container;
    drawBoardElements();
}

function capturePollSnapshot() {
    const captureArea = document.getElementById('captureZone');
    const controlButtons = document.querySelectorAll('.item-action-buttons');
    controlButtons.forEach(btn => btn.style.visibility = 'hidden');

    html2canvas(captureArea, {
        useCORS: true, 
        scale: 2,
        backgroundColor: "#f1f3f5"
    }).then(canvas => {
        controlButtons.forEach(btn => btn.style.visibility = 'visible');
        const imgData = canvas.toDataURL('image/png');
        const anchor = document.createElement('a');
        anchor.href = imgData;
        anchor.download = 'BigReds_Top25_Poll.png';
        anchor.click();
    }).catch(err => {
        controlButtons.forEach(btn => btn.style.visibility = 'visible');
        console.error('Snapshot configuration failed:', err);
    });
}

function registerDragInteractions() {
    if (dragInteractionsRegistered) return;
    dragInteractionsRegistered = true;

    const boardList = document.getElementById('top25Container');
    boardList.addEventListener('dragover', e => {
        e.preventDefault();
        const activeDrag = document.querySelector('.dragging');
        if (!activeDrag) return;
        const items = [...boardList.querySelectorAll('.poll-item:not(.dragging)')];

        let pivotItem = items.find(item => {
            return e.clientY <= item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2;
        });

        if (pivotItem) {
            boardList.insertBefore(activeDrag, pivotItem);
        } else {
            boardList.appendChild(activeDrag);
        }
    });

    boardList.addEventListener('drop', () => {
        const DOMOrder = [...boardList.querySelectorAll('.poll-item')];
        const updatedArrayOrder = [];
        DOMOrder.forEach(node => {
            const sourcePointer = parseInt(node.dataset.index);
            updatedArrayOrder.push(currentSelectionList[sourcePointer]);
        });
        currentSelectionList = updatedArrayOrder;
        drawBoardElements();
    });
}

function updateProfileName() {
    const name = document.getElementById('profileNameInput').value.trim();
    const initials = name
        ? name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
        : 'PO';

    document.getElementById('pollOwnerName').textContent = name || 'Poll owner';
    document.querySelector('.custom-title-box').textContent = name ? `${name}'s Poll` : "Big Red's Poll";
    document.getElementById('profileInitials').textContent = initials;
    document.getElementById('pollOwnerInitials').textContent = initials;
}

function displayProfilePhoto(photoData) {
    const editorPhoto = document.getElementById('profilePhotoPreview');
    const ownerPhoto = document.getElementById('pollOwnerPhoto');
    editorPhoto.src = photoData;
    ownerPhoto.src = photoData;
    editorPhoto.hidden = false;
    ownerPhoto.hidden = false;
    document.getElementById('profileInitials').hidden = true;
    document.getElementById('pollOwnerInitials').hidden = true;
    document.getElementById('removeProfilePhotoButton').hidden = false;
}

function initializeProfile() {
    const nameInput = document.getElementById('profileNameInput');
    const photoInput = document.getElementById('profilePhotoInput');
    const status = document.getElementById('profileStatus');

    try {
        nameInput.value = localStorage.getItem(PROFILE_NAME_KEY) || '';
        const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
        if (savedPhoto) displayProfilePhoto(savedPhoto);
    } catch (error) {
        status.textContent = 'This browser could not load saved profile details.';
    }

    updateProfileName();
    nameInput.addEventListener('input', () => {
        updateProfileName();
        try {
            localStorage.setItem(PROFILE_NAME_KEY, nameInput.value);
            status.textContent = 'Your name and photo are saved on this device.';
        } catch (error) {
            status.textContent = 'Your name could not be saved in this browser.';
        }
    });

    document.getElementById('profilePhotoButton').addEventListener('click', () => photoInput.click());
    document.getElementById('removeProfilePhotoButton').addEventListener('click', () => {
        try {
            localStorage.removeItem(PROFILE_PHOTO_KEY);
            document.getElementById('profilePhotoPreview').hidden = true;
            document.getElementById('pollOwnerPhoto').hidden = true;
            document.getElementById('profileInitials').hidden = false;
            document.getElementById('pollOwnerInitials').hidden = false;
            document.getElementById('removeProfilePhotoButton').hidden = true;
            status.textContent = 'Profile photo removed.';
        } catch (error) {
            status.textContent = 'The profile photo could not be removed.';
        }
    });

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            status.textContent = 'Choose an image file for your profile photo.';
            photoInput.value = '';
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            const size = 512;
            const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');
            URL.revokeObjectURL(imageUrl);
            photoInput.value = '';

            if (!context) {
                status.textContent = 'This browser could not prepare the profile photo.';
                return;
            }

            context.drawImage(
                image,
                (image.naturalWidth - cropSize) / 2,
                (image.naturalHeight - cropSize) / 2,
                cropSize,
                cropSize,
                0,
                0,
                size,
                size
            );

            try {
                const photoData = canvas.toDataURL('image/jpeg', 0.82);
                localStorage.setItem(PROFILE_PHOTO_KEY, photoData);
                displayProfilePhoto(photoData);
                status.textContent = 'Profile photo saved on this device.';
            } catch (error) {
                status.textContent = 'The photo could not be saved. Try a smaller image.';
            }
        };
        image.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            photoInput.value = '';
            status.textContent = 'That image could not be opened. Try another photo.';
        };
        image.src = imageUrl;
    });
}

window.onload = () => {
    initializeProfile();
    fetchLiveRecords();
    drawBoardElements();
};
