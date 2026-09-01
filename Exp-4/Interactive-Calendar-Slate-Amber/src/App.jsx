import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DAYS, CATEGORIES, INITIAL_EVENTS } from './data.js';
import { EventCard, EventCardUnmemoized } from './EventCard.jsx';
import './App.css';

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="toggle">
      <span
        className={`toggle__switch ${checked ? 'toggle__switch--on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span className="toggle__knob" />
      </span>
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        <span className="toggle__hint">{hint}</span>
      </span>
    </label>
  );
}

export default function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [memoOn, setMemoOn] = useState(true);
  const [callbackOn, setCallbackOn] = useState(true);
  const [memoFilterOn, setMemoFilterOn] = useState(true);
  const [liveClockOn, setLiveClockOn] = useState(true);
  const [clockTick, setClockTick] = useState(0);
  const [renderCounts, setRenderCounts] = useState({});
  const dragId = useRef(null);

  // Live clock: simulates unrelated state changes elsewhere in the app,
  // to demonstrate how memoization protects cards from parent re-renders.
  useEffect(() => {
    if (!liveClockOn) return undefined;
    const id = setInterval(() => setClockTick((t) => t + 1), 450);
    return () => clearInterval(id);
  }, [liveClockOn]);

  const recordRender = useCallback((id) => {
    setRenderCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const handleDragStartStable = useCallback((e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragStartUnstable = (e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = useCallback((day) => {
    const id = dragId.current;
    if (!id) return;
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, day } : ev)));
    dragId.current = null;
  }, []);

  // useMemo demo: only recompute the per-day grouping when events change,
  // not on every unrelated render (e.g. the live clock ticking).
  const eventsByDayMemoized = useMemo(() => {
    const grouped = {};
    DAYS.forEach((d) => { grouped[d] = []; });
    events.forEach((ev) => { grouped[ev.day].push(ev); });
    return grouped;
  }, [events]);

  const eventsByDayUnmemoized = (() => {
    const grouped = {};
    DAYS.forEach((d) => { grouped[d] = []; });
    events.forEach((ev) => { grouped[ev.day].push(ev); });
    return grouped;
  })();

  const eventsByDay = memoFilterOn ? eventsByDayMemoized : eventsByDayUnmemoized;
  const handleDragStart = callbackOn ? handleDragStartStable : handleDragStartUnstable;
  const CardComponent = memoOn ? EventCard : EventCardUnmemoized;

  const resetCounters = () => setRenderCounts({});

  const totalRenders = Object.values(renderCounts).reduce((a, b) => a + b, 0);
  const cardsRendered = Object.keys(renderCounts).length;

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">UNIT 1 · EXPERIMENT 4 · LIVE DEMO</p>
        <h1 className="app__title">Interactive Calendar</h1>
        <p className="app__subtitle">
          Drag events between days, then flip the switches below to see, in real time, what
          React.memo, useCallback, and useMemo actually do to re-renders.
        </p>
      </header>

      <section className="controls">
        <div className="controls__row">
          <Toggle
            label="React.memo on cards"
            hint="Skip a card's re-render when its own props haven't changed."
            checked={memoOn}
            onChange={setMemoOn}
          />
          <Toggle
            label="useCallback for handlers"
            hint="Keep drag handlers referentially stable so memo isn't fooled."
            checked={callbackOn}
            onChange={setCallbackOn}
          />
          <Toggle
            label="useMemo for agenda filter"
            hint="Cache the filtered list; recompute only when events or day change."
            checked={memoFilterOn}
            onChange={setMemoFilterOn}
          />
        </div>
        <div className="controls__row controls__row--bottom">
          <Toggle
            label="Live clock"
            hint="Ticks every 450ms to simulate unrelated state elsewhere in the app."
            checked={liveClockOn}
            onChange={setLiveClockOn}
          />
          <button type="button" className="btn-reset" onClick={resetCounters}>
            Reset counters
          </button>
        </div>
      </section>

      <div className="layout">
        <section className="week">
          <div className="week__head">
            <h2 className="week__title">WEEK VIEW</h2>
            <div className="legend">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <span key={key} className="legend__chip" style={{ color: cat.color, borderColor: cat.color }}>
                  {cat.label}
                </span>
              ))}
            </div>
          </div>

          <div className="week__grid">
            {DAYS.map((day) => (
              <div
                key={day}
                className="day-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(day)}
              >
                <div className="day-col__label">{day}</div>
                <div className="day-col__events">
                  {eventsByDay[day].map((ev) => (
                    <CardComponent
                      key={ev.id}
                      event={ev}
                      onDragStart={handleDragStart}
                      onRender={recordRender}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="monitor">
          <h2 className="monitor__title">RENDER MONITOR</h2>
          <div className="monitor__stats">
            <div className="monitor__stat">
              <span className="monitor__stat-value">{totalRenders}</span>
              <span className="monitor__stat-label">total renders logged</span>
            </div>
            <div className="monitor__stat">
              <span className="monitor__stat-value">{cardsRendered}/{events.length}</span>
              <span className="monitor__stat-label">cards that have rendered</span>
            </div>
          </div>

          <ul className="monitor__list">
            {events.map((ev) => {
              const count = renderCounts[ev.id] || 0;
              const pct = Math.min(100, (count / 8) * 100);
              return (
                <li key={ev.id} className="monitor__row">
                  <span className="monitor__row-name">{ev.title}</span>
                  <span className="monitor__row-bar">
                    <span className="monitor__row-fill" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="monitor__row-count">{count}</span>
                </li>
              );
            })}
          </ul>

          <p className="monitor__note">
            React.memo is {memoOn ? 'ON' : 'OFF'} — {memoOn
              ? 'only the card whose data actually changed should light up.'
              : 'every card re-renders on any state change, memoized or not.'}
          </p>
          {liveClockOn && <p className="monitor__clock">clock tick #{clockTick}</p>}
        </aside>
      </div>
    </div>
  );
}
