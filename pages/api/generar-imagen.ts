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

  // Por ahora, responderemos con un mensaje de prueba
  return res.status(200).json({ 
    url: 'https://via.placeholder.com/768x1024.png?text=Imagen+generada+con+IA' 
  });
}