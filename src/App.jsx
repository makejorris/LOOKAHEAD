import { useState, useEffect } from 'react';
import './App.css';
const F1_API = "https://api.jolpi.ca/ergast/f1/current/races/";
const categories = [
  {
    name: 'UFC',
    icon: '🥊',
    color: '#ff4545',
    image:
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Formula 1',
    icon: '🏎️',
    color: '#ff4747',
    image:
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Gaming',
    icon: '🎮',
    color: '#a78bfa',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'TV & Film',
    icon: '🎬',
    color: '#38bdf8',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Boxing',
    icon: '🥊',
    color: '#fbbf24',
    image:
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Space',
    icon: '🚀',
    color: '#34d399',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
  },
];

const events = [
  {
    id: 1,
    cat: 'UFC',
    title: 'Fight Week: Press Conference',
    type: 'BUILD-UP',
    date: 'DATE TBC',
    time: 'Time TBC',
    image: '🥊',
    desc: 'Watch for fighter face-offs, interviews and fight-week announcements.',
  },
  {
    id: 2,
    cat: 'Formula 1',
    title: 'Practice & Qualifying',
    type: 'RACE WEEKEND',
    date: 'DATE TBC',
    time: 'Schedule TBC',
    image: '🏎️',
    desc: 'Follow practice sessions, qualifying and team interviews before race day.',
  },
  {
    id: 3,
    cat: 'Gaming',
    title: 'Upcoming Game Reveals',
    type: 'GAMING',
    date: 'DATE TBC',
    time: 'Time TBC',
    image: '🎮',
    desc: 'Discover confirmed showcases, new trailers and game announcements.',
  },
  {
    id: 4,
    cat: 'TV & Film',
    title: 'Trailer Premieres',
    type: 'TV & FILM',
    date: 'DATE TBC',
    time: 'Time TBC',
    image: '🎬',
    desc: 'Keep an eye on official trailer launches, premieres and release dates.',
  },
  {
    id: 5,
    cat: 'Boxing',
    title: 'Fight Week: Weigh-In',
    type: 'BUILD-UP',
    date: 'DATE TBC',
    time: 'Time TBC',
    image: '🥊',
    desc: 'Follow official weigh-ins, media workouts and fighter face-offs.',
  },
  {
    id: 6,
    cat: 'Space',
    title: 'Rocket Launch Watch',
    type: 'SPACE & SCIENCE',
    date: 'DATE TBC',
    time: 'Window TBC',
    image: '🚀',
    desc: 'Track official launch windows, mission updates and livestreams.',
  },
];

export default function App() {
  const [tab, setTab] = useState('Home');
  const [f1Races, setF1Races] = useState([]);
  const [ufcEvents, setUfcEvents] = useState([]);
  useEffect(() => {
    console.log("LOOKAHEAD loaded F1 races:", f1Races.length);
  }, [f1Races]);
useEffect(() => {
  fetch(F1_API)
    .then(response => {
      if (!response.ok) throw new Error("F1 schedule unavailable");
      return response.json();
    })
    .then(data => {
      setF1Races(data.MRData.RaceTable.Races || []);
    })
    .catch(error => console.error("F1 schedule error:", error));
}, []);

useEffect(() => {
  fetch("https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard")
    .then(response => {
      if (!response.ok) throw new Error("UFC schedule unavailable");
      return response.json();
    })
    .then(data => {
      setUfcEvents(data.events || []);
      console.log("LOOKAHEAD loaded UFC events:", data.events || []);
    })
    .catch(error => console.error("UFC schedule error:", error));
}, []);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [savedMoments, setSavedMoments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lookahead-moments') || '[]');
    } catch {
      return [];
    }
  });

  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lookahead-saved') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lookahead-saved', JSON.stringify(saved));
  }, [saved]);

  const toggleSave = (id) =>
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id]
    );

    const allEvents = [
      
      ...events.filter(e => e.cat !== "Formula 1" && e.cat !== "UFC"),
      
      ...f1Races.map((race, index) => ({
        id: `f1-${race.round}`,
        cat: "Formula 1",
        title: race.raceName,
        type: "GRAND PRIX",
        date: race.date,
        time: race.time || "Time TBC",
        image: "🏎️",
        desc: `Formula 1 ${race.season} — ${race.Circuit.circuitName}, ${race.Circuit.Location.locality}.`
      })),
    
      ...ufcEvents.map(event => ({
        id: `ufc-${event.id}`,
        cat: "UFC",
        title: event.name,
        type: "UFC EVENT",
        date: event.date,
        time: new Date(event.date).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        image: "🥊",
        desc: `Upcoming UFC event: ${event.name}.`
      }))
    ];
    
    const filtered = allEvents.filter(
    (e) =>
      (filter === 'All' || e.cat === filter) &&
      (tab !== 'My Events' || saved.includes(e.id))
  );
  console.log("F1 events in feed:", filtered.filter(e => e.cat === "Formula 1").map(e => e.title));
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span>／</span>LOOKAHEAD
        </div>
        <div className="tagline">YOUR WORLD. WHAT'S NEXT.</div>
        <div className="top-note">YOUR INTERESTS. ONE PLACE.</div>
      </header>

      {selected ? (
        <main className="detail">
          <button className="back" onClick={() => setSelected(null)}>
            ← BACK
          </button>
          <div className="hero-art">
            <span>{selected.image}</span>
            <div className="hero-label">{selected.type}</div>
            <h1>{selected.title}</h1>
          </div>
          <p className="muted">
            {selected.cat} · {selected.date} · {selected.time}
          </p>
          <p>{selected.desc}</p>
          <button className="primary" onClick={() => toggleSave(selected.id)}>
            {saved.includes(selected.id)
              ? '✓ SAVED TO MY EVENTS'
              : '+ SAVE EVENT'}
          </button>
          <div className="section-title">THE BUILD-UP</div>
          {(selected.cat === 'Formula 1'
            ? ['Practice sessions', 'Qualifying', 'Race day']
            : selected.cat === 'UFC' || selected.cat === 'Boxing'
            ? ['Press conference', 'Official weigh-in', 'Main fight']
            : selected.cat === 'Gaming'
            ? ['Official announcement', 'Gameplay reveal', 'Release day']
            : selected.cat === 'TV & Film'
            ? ['First trailer', 'Official premiere', 'Streaming release']
            : ['Mission announcement', 'Launch livestream', 'Launch window']
          ).map((item, i) => (
            <div className="list-row" key={item}>
              <span className="timeline-dot">{i + 1}</span>
              <div className="moment-info">
                <strong>{item}</strong>
                <small>Date and time TBC</small>
              </div>
              <button
                className="moment-save"
                onClick={() =>
                  alert('Individual moment saving is our next step!')
                }
              >
                ☆
              </button>
            </div>
          ))}
          <p className="disclaimer">
            Concept preview. These are sample listings, not confirmed event
            schedules.
          </p>
        </main>
      ) : (
        <main>
          {tab === 'Home' && (
            <>
              <div className="welcome">
                <div>
                  <div className="eyebrow">WEDNESDAY · YOUR LINEUP</div>
                  <h1>
                    What's next<span>?</span>
                  </h1>
                </div>
                <div className="avatar">LA</div>
              </div>
              <div className="filter-strip">
                {['All', ...categories.map((c) => c.name)].map((cat) => (
                  <button
                    key={cat}
                    className={filter === cat ? 'chip active' : 'chip'}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="section-heading">
                <h2>YOUR WORLD</h2>
                <span>PERSONALISED</span>
              </div>
              <div className="art-grid">
                {categories
                  .filter((c) => filter === 'All' || c.name === filter)
                  .map((c) => {
                    const e = allEvents.find((x) => x.cat === c.name);

                    return (
                      <button
                        className="art-card"
                        key={c.name}
                        style={{
                          '--accent': c.color,
                          '--card-image': `url("${c.image}")`,
                        }}
                        onClick={() => e && setSelected(e)}
                      >
                        <div
                          className="art-photo"
                          style={{ backgroundImage: `url("${c.image}")` }}
                        />

                        <div className="art-bottom">
                          <small>{c.name.toUpperCase()}</small>
                          <strong>{e?.title}</strong>
                          <span>EXPLORE ↗</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
              <div className="section-heading">
                <h2>YOUR LINEUP</h2>
                <span>ALL INTERESTS</span>
              </div>
            </>
          )}

          {tab === 'Discover' && (
            <>
              <div className="welcome">
                <div>
                  <div className="eyebrow">FIND YOUR NEXT FIX</div>
                  <h1>
                    Discover<span>.</span>
                  </h1>
                </div>
              </div>
              <p className="muted">
                Major events, trailers, launches and releases across your
                interests.
              </p>
            </>
          )}

          {tab === 'Calendar' && (
            <>
              <div className="welcome">
                <div>
                  <div className="eyebrow">ALL YOUR INTERESTS</div>
                  <h1>
                    Calendar<span>.</span>
                  </h1>
                </div>
              </div>
              <p className="muted">
                Your calendar concept: upcoming events, build-up moments and
                release dates together.
              </p>
            </>
          )}

          {tab === 'My Events' && (
            <>
              <div className="welcome">
                <div>
                  <div className="eyebrow">YOUR PERSONAL LINEUP</div>
                  <h1>
                    My Events<span>.</span>
                  </h1>
                </div>
              </div>
              <p className="muted">
                Saved events stay here, even after you close and reopen the
                browser.
              </p>
            </>
          )}

          <div className="event-list">
            {filtered.map((e) => (
              <button
                className="event-row"
                key={e.id}
                onClick={() => setSelected(e)}
              >
                <div className="event-icon">{e.image}</div>
                <div className="event-info">
                  <small>
                    {e.cat.toUpperCase()} · {e.type}
                  </small>
                  <strong>{e.title}</strong>
                  <span>
                    {e.date} · {e.time}
                  </span>
                </div>
                <span className="event-arrow">
                  {saved.includes(e.id) ? '♥' : '↗'}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="muted">
                No saved events in this filter yet. Browse Home and save a few.
              </p>
            )}
          </div>
          <p className="disclaimer">
            Sample content for the prototype. Dates and schedules must be
            verified before use.
          </p>
        </main>
      )}

      <nav className="bottom-nav">
        {[
          ['Home', '⌂'],
          ['Calendar', '▦'],
          ['Discover', '⌕'],
          ['My Events', '♡'],
        ].map(([name, icon]) => (
          <button
            key={name}
            className={tab === name ? 'nav-item chosen' : 'nav-item'}
            onClick={() => {
              setTab(name);
              setSelected(null);
              setFilter('All');
            }}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
}
