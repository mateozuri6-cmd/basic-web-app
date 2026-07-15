import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: 'Falta la clave de API de Fal.ai' });
  }

  try {
    const response = await fetch('https://fal.run/fal-ai/fast-lightning-sdxl', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'square_hd',
        num_inference_steps: 20,
        guidance_scale: 3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.detail || 'Error al generar la imagen' });
    }

    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: 'No se recibió una URL de imagen' });
    }

    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}