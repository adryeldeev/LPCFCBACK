import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ajuste o caminho se precisar
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    if (destaque !== undefined) data.destaque = destaque;

    if (req.file) {
      data.imagem = req.file.filename;
    }

    const carro = await prisma.carro.create({ data });
    res.status(201).json(carro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar carro.' });
  }
};

// GET – Público: buscar por ID
export const getByIdCarro = async (req, res) => {
  const { id } = req.params;
  try {
    const carro = await prisma.carro.findUnique({ where: { id: Number(id) } });
    if (!carro) return res.status(404).json({ message: 'Carro não encontrado.' });
    res.status(200).json(carro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carro.' });
  }
};

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
    destaque,
  } = req.body;

  try {
    const carroExistente = await prisma.carro.findUnique({ where: { id: Number(id) } });
    if (!carroExistente) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

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
    if (destaque !== undefined) data.destaque = destaque;

    // Se veio uma nova imagem, remove a antiga
    if (req.file) {
      if (carroExistente.imagem) {
        const imagemAntigaPath = path.join(__dirname, '../../Uploads/carros', carroExistente.imagem);
        if (fs.existsSync(imagemAntigaPath)) {
          fs.unlinkSync(imagemAntigaPath);
        }
      }
      data.imagem = req.file.filename;
    }

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

    // Remove imagem do disco se existir
    if (carro.imagem) {
      const imagemPath = path.join(__dirname, '../../Uploads/carros', carro.imagem);
      if (fs.existsSync(imagemPath)) {
        fs.unlinkSync(imagemPath);
      }
    }

    await prisma.carro.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Carro deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar carro.' });
  }
};
