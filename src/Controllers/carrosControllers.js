import prisma from '../prisma/client.js';

// GET – Público: carros em destaque
export const getAllCarros = async (req, res) => {
  try {
    const destaques = await prisma.carro.findMany({
      where: { destaque: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(destaques);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar destaques.' });
  }
};

// POST – Admin: criar carro
export const createCarros = async (req, res) => {
    const {
      modelo,
      ano,
      preco,
      quilometragem,
      cor,
      combustivel,
      cambio,
      portas,
      descricao,
      imagem,
      destaque,
    } = req.body;
  
    try {
      if (destaque) {
        const count = await prisma.carro.count({ where: { destaque: true } });
        if (count >= 3) {
          return res.status(400).json({ message: 'Máximo de 3 carros em destaque já atingido.' });
        }
      }
  
      const data = {};
      if (modelo !== undefined) data.modelo = modelo;
      if (ano !== undefined) data.ano = ano;
      if (preco !== undefined) data.preco = preco;
      if (quilometragem !== undefined) data.quilometragem = quilometragem;
      if (cor !== undefined) data.cor = cor;
      if (combustivel !== undefined) data.combustivel = combustivel;
      if (cambio !== undefined) data.cambio = cambio;
      if (portas !== undefined) data.portas = portas;
      if (descricao !== undefined) data.descricao = descricao;
      if (imagem !== undefined) data.imagem = imagem;
      if (destaque !== undefined) data.destaque = destaque;
  
      const carro = await prisma.carro.create({ data });
  
      res.status(201).json(carro);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar carro.' });
    }
  };

 export const getByIdCarro = async (req,res)=>{
    const { id } = req.params;
    try {
        const carro = await prisma.carro.findUnique({ where: { id: Number(id) } });
        if (!carro) return res.status(404).json({ message: 'Carro não encontrado.' });
        res.status(200).json(carro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar carro.' });
    }
  }


// PUT – Admin: atualizar carro
export const updateCarro = async (req, res) => {
    const { id } = req.params;
    const {
      modelo,
      ano,
      preco,
      quilometragem,
      cor,
      combustivel,
      cambio,
      portas,
      descricao,
      imagem,
      destaque,
    } = req.body;
  
    try {
      const carroExistente = await prisma.carro.findUnique({ where: { id: Number(id) } });
      if (!carroExistente) return res.status(404).json({ message: 'Carro não encontrado.' });
  
      if (destaque && !carroExistente.destaque) {
        const count = await prisma.carro.count({ where: { destaque: true } });
        if (count >= 3) {
          return res.status(400).json({ message: 'Máximo de 3 carros em destaque já atingido.' });
        }
      }
  
      const data = {};
      if (modelo !== undefined) data.modelo = modelo;
      if (ano !== undefined) data.ano = ano;
      if (preco !== undefined) data.preco = preco;
      if (quilometragem !== undefined) data.quilometragem = quilometragem;
      if (cor !== undefined) data.cor = cor;
      if (combustivel !== undefined) data.combustivel = combustivel;
      if (cambio !== undefined) data.cambio = cambio;
      if (portas !== undefined) data.portas = portas;
      if (descricao !== undefined) data.descricao = descricao;
      if (imagem !== undefined) data.imagem = imagem;
      if (destaque !== undefined) data.destaque = destaque;
  
      const carroAtualizado = await prisma.carro.update({
        where: { id: Number(id) },
        data,
      });
  
      res.status(200).json(carroAtualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar carro.' });
    }
  };


// DELETE – Admin: deletar carro
export const deleteCarro = async (req, res) => {
  const { id } = req.params;

  try {
    const carro = await prisma.carro.findUnique({ where: { id: Number(id) } });
    if (!carro) return res.status(404).json({ message: 'Carro não encontrado.' });

    await prisma.carro.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Carro deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar carro.' });
  }
};
