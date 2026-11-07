# Aural Rehabilitation · التأهيل السمعي

Listening lessons for children, played as games on phones and iPads (installable, works offline, Arabic first).

Site: https://hamada013.github.io/aural-rehabilitation-/

This app stands alone: other sites link here, and it does not link back to the main website.

## Dashboard

The home page is a road map for the kid playing. Each lesson is a stop on the road, built from `assets/lessons.js`.

- **Kids**: tap the name at the top to switch kids or add one (name and picture). Each kid's stars and progress are saved separately, on this device only (`assets/store.js`).
- **Unlocking**: level 1 of lesson 1 is open. Playing every station of a level opens the next level of that lesson. Finishing level 1 of a lesson opens level 1 of the next lesson. Therapist mode opens every lesson and level.
- **Side list** (☰): every lesson with its level status, the **therapist mode** switch, the report, the kids and the info sheet.
- **Therapist mode**: switching it on asks for the therapist code (`THERAPIST_CODE` at the top of `assets/app.js`; a light lock so kids don't turn it on by accident, not real security); switching it off needs no code. While it is on, every lesson and level is open, and after each station the end sheet lists that level's goals for the station with **20 / 40 / 60 / 80%** buttons (tap again to clear). 80% marks the goal done; 20–40% marks it as needing support; 60% as being worked on. A rating takes priority over the game's own scores. The switch is one per device.
- **Report**: for each goal, whether it is being worked on now, done, or needs support, plus stars per station and level and the latest sessions, with therapist notes. «PDF / طباعة» opens the print dialog (choose *Save as PDF*, or on iPhone/iPad *Share → Save to Files / WhatsApp*). «مشاركة» shares a text summary.
- **Info** (ⓘ): about the app and the therapist's contact (email, WhatsApp). The contact appears on the dashboard only; set it in `CONTACT` at the top of `assets/app.js`.

A goal's status comes from the stations listed with it in `assets/lessons.js`: *done* when each of them has scored at least 80% correct the first time, *needs support* when it is still under 60% after two tries (or the last try was under 50%), otherwise *working on now*.

## Lessons

| # | Lesson | Folder |
|---|--------|--------|
| 1 | بيتي (My house) | `lessons/01-my-house/` |
| 2 | مطبخي (My kitchen) | `lessons/02-my-kitchen/` |

Each lesson folder holds `index.html`, `lesson.css`, `data.js` (all words, rounds and sound list), `art.js` (original SVG pictures), `game.js` and `cover.svg`. Pieces every lesson shares live in `assets/kit.js`: the therapist rating sheet, the book page flip, swipe, and the star burst.

All games are made for touch screens first (iPad, phone), and every station must fit the screen on a phone, an iPad, a landscape phone and a 13" laptop.

### Lesson 1 · بيتي

Four stations, each at three levels (1, 2 or 3 pieces of information to listen for):

1. **نبني البيت** — hear a part / colour + part / what the part is for; pick the piece and it goes on the house.
2. **مين بالبيت؟** — dollhouse: person / person + room / person + action + room.
3. **وين بيروح؟** — find the object heard, then match it to its place.
4. **قصة بيتي** — read-along book that turns its pages like a real book (tap the arrow or swipe right); the therapist taps the tick when the child repeats; Level 3 adds a question per page.

### Lesson 2 · مطبخي

Lesson 2 reuses lesson 1's styles (`../01-my-house/lesson.css`) and people drawings (`../01-my-house/art.js`).

1. **أغراض المطبخ** — a board of kitchen things. L1: «معي كوباية» (I have a cup); the hidden card turns over and lands on the same picture («متل بعض!» same!). L2: pick your favourite colour of buttons, then hear two things and put a button on each. L3: find the thing from what it's used for.
2. **قصة البسكوتات** — the cookie book, with page flips. L1: find the boy or the girl on the cover and repeat a word per page. L2: find the next page number to turn the page. L3: «before / after» questions. The last page is a game: catch the running cookies.
3. **قبعة الطبّاخ** — make a chef's hat by listening: pick the tool (L1), the tool and where (L2), or two directions in order (L3). The finished hat lands on the kid's own picture.
4. **شغلات الطبّاخ** — the dice roll inside a box the child can't see into, so they must listen: verb, then food (L1); verb + food (L2); who + verb + food (L3). A chef's hat goes on the right food on the cut / wash / cook mat.

Both lessons take their ideas from published themed listening kits; the words, rounds and pictures here are our own.

## Sounds

Each lesson's `sounds/sounds.txt` lists every recording: `<number>.m4a`, the Arabic text, and where it is used. Record each line and save it as `sounds/<number>.m4a`. Until a file exists, the game uses the device's Arabic voice, or shows the words when there is none.

After editing a lesson's `data.js`, run `node scripts/sounds-list.cjs` to rewrite its `sounds.txt`.

## Adding a lesson

1. Copy the structure of `lessons/02-my-kitchen/` (it is the most complete). In its `game.js`, set `LID` to the new lesson's id. Add the lesson to `scripts/cover.cjs` and run `node scripts/cover.cjs` to make its `cover.svg` (a single `<svg>`, so every browser and dev server shows it).
2. Add an entry to `assets/lessons.js`: stations (the same ids as its `data.js`), goals with the stations each goal is measured by, cover and tint.
3. Add the lesson's files to `SHELL` in `sw.js` and bump `VERSION`.

## Checks

- `node tests/check.cjs` — stands alone, manifest, lessons and offline files.
- `node tests/lessons.cjs` — every round's sounds and pictures exist in both lessons; `sounds.txt` is up to date.
- `APP_PLAYWRIGHT=/path/to/node_modules/playwright node tests/browser.cjs` — plays every station of both lessons (every level on the phone) on phone, iPad, landscape phone and a 13" laptop, and checks each station fits the screen (`APP_ENGINE=webkit` for Safari's engine). Screens go to `output/screens/`.

The font is Baloo Bhaijaan 2 (SIL Open Font License), stored in `assets/fonts/` so it works offline.
