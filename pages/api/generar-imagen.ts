import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: 'La clave de Fal.ai no está configurada.' });
  }

  try {
    const respuestaIA = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'square_hd',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: false,
      }),
    });

    const datosIA = await respuestaIA.json();

    if (!respuestaIA.ok) {
      throw new Error(datosIA.detail || 'Error al generar la imagen');
    }

    const urlImagen = datosIA.images?.[0]?.url;
    if (!urlImagen) {
      throw new Error('La IA no devolvió una URL de imagen');
    }

    res.status(200).json({ url: urlImagen });
  } catch (error: any) {
    console.error('Error en la API:', error.message);
    res.status(500).json({ error: error.message || 'Error al generar la imagen' });
  }
}