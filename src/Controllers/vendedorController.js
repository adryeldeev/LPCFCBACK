import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ajuste o caminho se precisar

// GET – Público: listar todos os vendedores
export const getAllVendedores = async (req, res) => {
  try {
    const vendedores = await prisma.vendedor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(vendedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar vendedores.' });
  }
};

// POST – Admin: criar vendedor
export const createVendedor = async (req, res) => {
  const { nome, telefone } = req.body;

  try {
    const vendedor = await prisma.vendedor.create({
      data: {
        nome,
        telefone,
      },
    });

    res.status(201).json(vendedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar vendedor.' });
  }
};

// PUT – Admin: atualizar vendedor (campos opcionais)
export const updateVendedor = async (req, res) => {
  const { id } = req.params;
  const { nome, telefone } = req.body;

  try {
    const vendedorExistente = await prisma.vendedor.findUnique({ where: { id: Number(id) } });
    if (!vendedorExistente) {
      return res.status(404).json({ message: 'Vendedor não encontrado.' });
    }

    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (telefone !== undefined) data.telefone = telefone;

    const vendedorAtualizado = await prisma.vendedor.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(vendedorAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar vendedor.' });
  }
};

// DELETE – Admin: deletar vendedor
export const deleteVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const vendedor = await prisma.vendedor.findUnique({ where: { id: Number(id) } });
    if (!vendedor) return res.status(404).json({ message: 'Vendedor não encontrado.' });

    await prisma.vendedor.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Vendedor deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar vendedor.' });
  }
};
