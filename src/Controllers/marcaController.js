import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ajuste o caminho se precisar
// Criar marca
export const createMarca = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    // Se você usa multer, o arquivo vai estar em req.file
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;


    if (!logo) return res.status(400).json({ error: "Logo é obrigatória" });

    const marca = await prisma.marca.create({
      data: {
        nome,
        logo,
      },
    });

    return res.status(201).json(marca);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Marca já existe" });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
};

// Listar todas
export const getMarcas = async (_req , res) => {
  try {
    const marcas = await prisma.marca.findMany();
    return res.json(marcas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
};

// Editar marca
export const updateMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : undefined;

    const dataToUpdate = {};
    if (nome) dataToUpdate.nome = nome;
    if (logo) dataToUpdate.logo = logo;

    const marca = await prisma.marca.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return res.json(marca);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Marca não encontrada" });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
};

// Excluir marca
export const deleteMarca = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.marca.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Marca não encontrada" });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
};
