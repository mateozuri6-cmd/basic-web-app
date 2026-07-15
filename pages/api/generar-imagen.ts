import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  try {
    const respuestaIA = await fetch('https://api.muapi.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MUAPI_KEY}`,
      },
      body: JSON.stringify({
        model: 'flux-pro', // Puedes cambiar a 'midjourney', 'sd-xl', etc.
        prompt: prompt,
        negative_prompt: 'distorsión, mala calidad, borroso, deforme, píxeles, texto ilegible',
        width: 768,
        height: 1024,
        num_images: 1,
      }),
    });

    const datosIA = await respuestaIA.json();

    if (!respuestaIA.ok) {
      throw new Error(datosIA.error || 'Error al generar la imagen');
    }

    // Asumiendo que Muapi devuelve la URL de la imagen en datosIA.url o datosIA.images[0].url
    const urlImagen = datosIA.url || datosIA.images?.[0]?.url;
    if (!urlImagen) {
      throw new Error('La IA no devolvió una URL de imagen');
    }

    res.status(200).json({ url: urlImagen });
  } catch (error: any) {
    console.error('Error en la API:', error.message);
    res.status(500).json({ error: error.message || 'Error al generar la imagen' });
  }
}