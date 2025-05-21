import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ajuste o caminho se precisar
import nodemailer from "nodemailer";

export const criarPropostaVenda = async (req, res) => {
  const { nome, telefone, whatsapp, email, veiculo } = req.body;

  try {
    // Salva no banco
    const proposta = await prisma.propostaVenda.create({
      data: {
        nome,
        telefone,
        whatsapp: Boolean(whatsapp),
        email,
        veiculo
      },
    });

    // Configurar o transporte do e-mail
    const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_REMETENTE,
       pass: process.env.SENHA_REMETENTE,
     },
     tls: {
       rejectUnauthorized: false, // 👈 Isso ignora o certificado autoassinado
     },
   });

    // Conteúdo do e-mail
    const emailHtml = `
      <h2>Nova proposta de venda recebida</h2>
      <p><strong>Veículo:</strong> ${veiculo}</p>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>WhatsApp?:</strong> ${whatsapp ? "Sim" : "Não"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Data da Proposta:</strong> ${new Date().toLocaleDateString()}</p>
    `;

    // Enviar o e-mail para o dono da loja
    await transporter.sendMail({
      from: `"Loja Felipe Carneiro Motors" <${process.env.EMAIL_REMETENTE}>`,
      to: process.env.EMAIL_DESTINO, // e-mail que vai receber a notificação
      subject: "Nova proposta de venda recebida",
      html: emailHtml,
    });

    res.status(201).json({ message: "Proposta salva e e-mail enviado!" });
  } catch (error) {
    console.error("Erro ao salvar proposta:", error);
    res.status(500).json({ error: "Erro ao salvar proposta." });
  }
};

export const listarPropostas = async (req, res) => {
  try {
    const propostas = await prisma.propostaVenda.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(propostas);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    res.status(500).json({ error: "Erro ao buscar propostas." });
  }
};

export const deletarProposta = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.propostaVenda.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Proposta deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar proposta:", error);
    res.status(500).json({ error: "Erro ao deletar proposta." });
  }
};
