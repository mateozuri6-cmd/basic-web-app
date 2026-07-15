import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verificar que sea una petición POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2. Obtener el prompt del cuerpo de la petición
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  // 3. Verificar que la clave de API de Fal.ai esté configurada
  if (!process.env.FAL_KEY) {
    console.error('Error: La variable de entorno FAL_KEY no está configurada.');
    return res.status(500).json({ error: 'La clave de API de Fal.ai no está configurada en el servidor.' });
  }

  try {
    console.log(`Enviando prompt a Fal.ai: "${prompt}"`);

    // 4. Llamar a la API de Fal.ai usando el modelo rápido y gratuito
    const respuestaIA = await fetch('https://fal.run/fal-ai/fast-lightning-sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'square_hd', // Tamaño de la imagen
        num_inference_steps: 28, // Calidad de la imagen
        guidance_scale: 3.5, // Adherencia al prompt
        num_images: 1,
        enable_safety_checker: false, // Para evitar bloqueos
      }),
    });

    // 5. Leer la respuesta de Fal.ai
    const datosIA = await respuestaIA.json();

    // 6. Si Fal.ai devuelve un error, lanzarlo con el mensaje detallado
    if (!respuestaIA.ok) {
      console.error('Error de Fal.ai:', datosIA);
      throw new Error(datosIA.detail || datosIA.message || 'Error al generar la imagen');
    }

    // 7. Extraer la URL de la imagen
    const urlImagen = datosIA.images?.[0]?.url;
    if (!urlImagen) {
      console.error('Respuesta de Fal.ai sin URL:', datosIA);
      throw new Error('La IA no devolvió una URL de imagen');
    }

    // 8. Devolver la URL al frontend
    res.status(200).json({ url: urlImagen });

  } catch (error: any) {
    // 9. Capturar y mostrar cualquier error
    console.error('Error en la API /generar-imagen:', error);
    res.status(500).json({
      error: error.message || 'Error al generar la imagen',
      details: error.toString(),
    });
  }
}