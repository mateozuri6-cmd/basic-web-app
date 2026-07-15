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

  // Verificar que la clave de API de Fal.ai esté configurada
  if (!process.env.FAL_KEY) {
    console.error('Error: La variable de entorno FAL_KEY no está configurada.');
    return res.status(500).json({ error: 'La clave de API de Fal.ai no está configurada en el servidor.' });
  }

  try {
    console.log(`Enviando prompt a Fal.ai: "${prompt}"`);

    // Llamar a la API de Fal.ai usando el modelo rápido y gratuito
    const respuestaIA = await fetch('https://fal.run/fal-ai/fast-lightning-sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'square_hd',
        num_inference_steps: 20,
        guidance_scale: 3,
      }),
    });

    const datosIA = await respuestaIA.json();

    if (!respuestaIA.ok) {
      console.error('Error de Fal.ai:', datosIA);
      throw new Error(datosIA.detail || datosIA.message || 'Error al generar la imagen');
    }

    const urlImagen = datosIA.images?.[0]?.url;
    if (!urlImagen) {
      console.error('Respuesta de Fal.ai sin URL:', datosIA);
      throw new Error('La IA no devolvió una URL de imagen');
    }

    return res.status(200).json({ url: urlImagen });
  } catch (error) {
    console.error('Error en la API /generar-imagen:', error);
    return res.status(500).json({
      error: error.message || 'Error al generar la imagen',
    });
  }
}