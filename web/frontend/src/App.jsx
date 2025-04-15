import React, { useEffect, useState } from 'react';

const fetchList = async (file) =>
  fetch(`http://localhost:3001/data/${file}`).then((res) => res.json());

export default function App() {
  const [liveHosts, setLiveHosts] = useState([]);
  const [nucleiResults, setNucleiResults] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    fetchList('./output/live.txt').then(setLiveHosts);
    fetchList('./output/nuclei-results.txt').then(setNucleiResults);

    fetch('/screenshots/')
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const files = Array.from(doc.querySelectorAll('a')).map((a) => a.href).filter(href => href.endsWith('.png'));
        setScreenshots(files);
      });
  }, []);

  return (
    <div className="p-6 space-y-8 text-gray-800 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Autobounty Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold">Live Hosts</h2>
        <ul className="list-disc ml-6">
          {liveHosts.map((h, i) => (
            <li key={i}><a href={`http://${h}`} target="_blank" rel="noreferrer">{h}</a></li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Nuclei Results</h2>
        <ul className="list-disc ml-6 text-red-600">
          {nucleiResults.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Screenshots</h2>
        <div className="grid grid-cols-2 gap-4">
          {screenshots.map((s, i) => (
            <a key={i} href={s} target="_blank" rel="noreferrer">
              <img src={s} alt="screenshot" className="rounded shadow-md" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
