import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert('Por favor, escribe un prompt.');
      return;
    }

    setCargando(true);
    setImagenUrl('');

    try {
      const respuesta = await fetch('/api/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const datos = await respuesta.json();

      if (datos.url) {
        setImagenUrl(datos.url);
      } else {
        alert('Error: ' + (datos.error || 'No se pudo generar la imagen.'));
      }
    } catch (error) {
      alert('Hubo un error al conectar con el servidor. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>👗 Mi Editor de Fotos con IA</h1>
      <p>Escribe tu prompt para editar la imagen:</p>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Top negro, short blanco roto, fondo de piscina..."
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: '1rem',
            padding: '0.7rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.6 : 1,
          }}
          disabled={cargando}
        >
          {cargando ? '🔄 Generando...' : '🚀 Generar Imagen'}
        </button>
      </form>

      {imagenUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h3>✅ Imagen Generada:</h3>
          <Image
            src={imagenUrl}
            alt="Imagen generada con IA"
            width={768}
            height={1024}
            style={{ maxWidth: '100%', borderRadius: '10px', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}