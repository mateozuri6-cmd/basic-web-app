import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  if (!process.env.MUAPI_KEY) {
    return res.status(500).json({ error: 'La clave de API no está configurada en el servidor.' });
  }

  try {
    const respuestaIA = await fetch('https://api.muapi.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MUAPI_KEY}`,
      },
      body: JSON.stringify({
        model: 'flux-pro',
        prompt: prompt,
        negative_prompt: 'distorsión, mala calidad, borroso',
        width: 768,
        height: 1024,
        num_images: 1,
      }),
    });

    const datosIA = await respuestaIA.json();

    if (!respuestaIA.ok) {
      throw new Error(datosIA.error || 'Error al generar la imagen');
    }

    const urlImagen = datosIA.url || datosIA.images?.[0]?.url;
    if (!urlImagen) {
      throw new Error('La IA no devolvió una URL de imagen');
    }

    res.status(200).json({ url: urlImagen });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al generar la imagen' });
  }
}