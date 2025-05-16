import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET – Público: carros em destaque
export const getAllCarrosDestaque = async (req, res) => {
  try {
    const destaques = await prisma.carro.findMany({
      where: { destaque: true },
      orderBy: { createdAt: 'desc' },
      include: { imagens: true },



    });
    res.status(200).json(destaques);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar destaques.' });
  }
};

// GET – Público: todos os carros
export const getAllCarros = async (req, res) => {
  
  try {
    const carros = await prisma.carro.findMany({
      orderBy: { createdAt: 'desc' },
      include: { imagens: true }
    });

    res.status(200).json(carros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carros.' });
  }
};

// POST – Admin: criar carro com múltiplas imagens
export const createCarros = async (req, res) => {

  const {
    modelo,
    marca,
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
   

    const data = {};
    if (!ano || isNaN(Number(ano))) {
      return res.status(400).json({ message: "O campo 'ano' deve ser um número válido." });
    }
    if (!preco || isNaN(Number(preco))) {
      return res.status(400).json({ message: "O campo 'preco' deve ser um número válido." });
    }
    if (modelo !== undefined) data.modelo = modelo;
    if(marca !== undefined) data.marca = marca;
    if (ano !== undefined) data.ano = parseInt(ano, 10); // Converte para Int
    if (preco !== undefined) data.preco = parseFloat(preco.replace(",", "")); // Converte para Float
    if (quilometragem !== undefined) data.quilometragem = parseInt(quilometragem, 10);
    if (portas !== undefined) data.portas = parseInt(portas, 10);
    if (destaque !== undefined) data.destaque = destaque === "true"; // Converte para Boolean // Converte para Boolean

    if (cor !== undefined) data.cor = cor;
    if (combustivel !== undefined) data.combustivel = combustivel;
    if (cambio !== undefined) data.cambio = cambio;
    if (descricao !== undefined) data.descricao = descricao;

    const imagens = req.files?.map(file => ({
      url: file.filename,
    }));

    const carro = await prisma.carro.create({
      data: {
        ...data,
        imagens: {
          create: imagens
        }
      },
      include: { imagens: true }
    });

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
    const carro = await prisma.carro.findUnique({
      where: { id: Number(id) },
      include: { imagens: true }
    });
    if (!carro) return res.status(404).json({ message: 'Carro não encontrado.' });
    res.status(200).json(carro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carro.' });
  }
};

// PUT – Admin: atualizar carro e substituir imagens
export const updateCarro = async (req, res) => {
  const { id } = req.params;
  const {
    modelo,
    marca,
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
    const carroExistente = await prisma.carro.findUnique({
      where: { id: Number(id) },
      include: { imagens: true }
    });

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
    if (marca !== undefined) data.marca = marca;
    if (ano !== undefined) data.ano = ano;
    if (preco !== undefined) data.preco = preco;
    if (quilometragem !== undefined) data.quilometragem = quilometragem;
    if (cor !== undefined) data.cor = cor;
    if (combustivel !== undefined) data.combustivel = combustivel;
    if (cambio !== undefined) data.cambio = cambio;
    if (portas !== undefined) data.portas = portas;
    if (descricao !== undefined) data.descricao = descricao;
    if (destaque !== undefined) data.destaque = destaque;

    // Se vierem novas imagens
    if (req.files && req.files.length > 0) {
      // Deleta imagens antigas do disco
      for (const imagem of carroExistente.imagens) {
        const caminho = path.join(__dirname, '../../Uploads/carros', imagem.url);
        if (fs.existsSync(caminho)) {
          fs.unlinkSync(caminho);
        }
      }

      // Remove imagens antigas do banco
      await prisma.imagem.deleteMany({
        where: { carroId: Number(id) }
      });

      // Cria novas imagens
      const novasImagens = req.files.map(file => ({
        url: file.filename,
        carroId: Number(id)
      }));

      await prisma.imagem.createMany({ data: novasImagens });
    }

    const carroAtualizado = await prisma.carro.update({
      where: { id: Number(id) },
      data,
      include: { imagens: true }
    });

    res.status(200).json(carroAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar carro.' });
  }
};

// DELETE – Admin: deletar carro e imagens associadas
export const deleteCarro = async (req, res) => {
  const { id } = req.params;

  try {
    const carro = await prisma.carro.findUnique({
      where: { id: Number(id) },
      include: { imagens: true }
    });

    if (!carro) return res.status(404).json({ message: 'Carro não encontrado.' });

    // Remove imagens do disco
    for (const imagem of carro.imagens) {
      const imagemPath = path.join(__dirname, '../../Uploads/carros', imagem.url);
      if (fs.existsSync(imagemPath)) {
        fs.unlinkSync(imagemPath);
      }
    }

    // Remove imagens do banco
    await prisma.imagem.deleteMany({
      where: { carroId: Number(id) }
    });

    // Remove o carro
    await prisma.carro.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: 'Carro deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar carro.' });
  }
};
