import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchList = async (file) => {
  try {
    const response = await fetch(`/data/${file}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${file}:`, error);
    return [];
  }
};

const TerminalText = ({ children, className = "" }) => (
  <span className={`font-mono ${className}`}>{children}</span>
);

const GlitchText = ({ children }) => (
  <span className="relative inline-block">
    <span className="absolute top-0 left-0 text-green-400 opacity-75 animate-pulse">{children}</span>
    <span className="relative text-green-500">{children}</span>
  </span>
);

const ImageModal = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors"
        >
          <TerminalText className="text-xl">[X] Cerrar</TerminalText>
        </button>
        <img 
          src={imageUrl} 
          alt="Screenshot ampliada" 
          className="w-full h-auto rounded-lg border border-blue-500/20"
        />
      </div>
    </div>
  );
};

export default function App() {
  const [liveHosts, setLiveHosts] = useState([]);
  const [nucleiResults, setNucleiResults] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [hosts, results] = await Promise.all([
          fetchList('live.txt'),
          fetchList('nuclei-results.txt')
        ]);
        
        setLiveHosts(hosts);
        setNucleiResults(results);

        const response = await fetch('/screenshots/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const files = Array.from(doc.querySelectorAll('a'))
          .map((a) => a.href)
          .filter(href => href.endsWith('.jpeg'))
          .map(href => {
            const filename = href.split('/').pop();
            return `/screenshots/${filename}`;
          });
        
        setScreenshots(files);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <TerminalText className="text-green-500 text-xl">
            <span className="animate-pulse">{'>'}</span> Inicializando sistema...
          </TerminalText>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <TerminalText className="text-red-500 text-xl">
            <span className="animate-pulse">!</span> {error}
          </TerminalText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-green-500/30 pb-4">
          <h1 className="text-4xl font-bold">
            <GlitchText>AutoBounty</GlitchText>
            <TerminalText className="text-green-500/70 text-sm ml-2">v1.0.0</TerminalText>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-gray-800/50 p-6 rounded-lg border border-green-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TerminalText className="text-green-500 mr-2">$</TerminalText>
              Live Hosts
              <TerminalText className="text-green-500/50 text-sm ml-2">({liveHosts.length})</TerminalText>
            </h2>
            {liveHosts.length === 0 ? (
              <p className="text-gray-400">No hay hosts activos</p>
            ) : (
              <ul className="space-y-2">
                {liveHosts.map((h, i) => (
                  <li key={i} className="font-mono text-sm">
                    <a 
                      href={h} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      {h}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-gray-800/50 p-6 rounded-lg border border-red-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TerminalText className="text-red-500 mr-2">!</TerminalText>
              Nuclei Results
              <TerminalText className="text-red-500/50 text-sm ml-2">({nucleiResults.length})</TerminalText>
            </h2>
            {nucleiResults.length === 0 ? (
              <p className="text-gray-400">No hay resultados de Nuclei</p>
            ) : (
              <ul className="space-y-2">
                {nucleiResults.map((r, i) => (
                  <li key={i} className="font-mono text-sm text-red-400">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="bg-gray-800/50 p-6 rounded-lg border border-blue-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TerminalText className="text-blue-500 mr-2">#</TerminalText>
            Screenshots
            <TerminalText className="text-blue-500/50 text-sm ml-2">({screenshots.length})</TerminalText>
          </h2>
          {screenshots.length === 0 ? (
            <p className="text-gray-400">No hay capturas de pantalla disponibles</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((s, i) => (
                <div 
                  key={i} 
                  className="group relative overflow-hidden rounded-lg border border-blue-500/20 cursor-pointer"
                  onClick={() => setSelectedImage(s)}
                >
                  <img 
                    src={s} 
                    alt={`Screenshot ${i + 1}`} 
                    className="w-full h-auto transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <TerminalText className="text-blue-400">Ver imagen</TerminalText>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}
