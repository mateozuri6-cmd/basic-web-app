import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Prompt enviado: ' + prompt);
    // Aquí conectaremos con la IA más tarde
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
            cursor: 'pointer'
          }}
        >
          Generar Imagen
        </button>
      </form>
    </div>
  );
}