import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ajuste o caminho se precisar
import nodemailer from "nodemailer";

export const criarPropostaFinanciamento = async (req, res) => {
  const { nome, telefone, whatsapp, email, veiculo, cpf, dataNascimento } = req.body;

  try {
    // Constrói o objeto dinamicamente, incluindo apenas os campos opcionais se estiverem preenchidos
    const propostaData = {
      nome,
      telefone,
      whatsapp: Boolean(whatsapp),
      email,
      veiculo,
      ...(cpf && { cpf }),
      ...(dataNascimento && { dataNascimento: new Date(dataNascimento) }),
    };

    // Salva no banco
    const proposta = await prisma.propostaFinanciamento.create({
      data: propostaData,
    });

    // Configurar transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_REMETENTE,
        pass: process.env.SENHA_REMETENTE,
      },
    });

    // Conteúdo do e-mail
    const emailHtml = `
      <h2>Nova proposta de financiamento recebida</h2>
      <p><strong>Veículo:</strong> ${veiculo}</p>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>WhatsApp?:</strong> ${whatsapp ? "Sim" : "Não"}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${cpf ? `<p><strong>CPF:</strong> ${cpf}</p>` : ""}
      ${dataNascimento ? `<p><strong>Data de Nascimento:</strong> ${dataNascimento}</p>` : ""}
      <p><strong>Data da Proposta:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
    `;

    // Enviar o e-mail
    await transporter.sendMail({
      from: `"Loja de Carros" <${process.env.EMAIL_REMETENTE}>`,
      to: process.env.EMAIL_DESTINO,
      subject: "Nova proposta de financiamento recebida",
      html: emailHtml,
    });

    res.status(201).json({ message: "Proposta salva e e-mail enviado!" });
  } catch (error) {
    console.error("Erro ao salvar proposta:", error);
    res.status(500).json({ error: "Erro ao salvar proposta." });
  }
};
export const listarPropostasFinanciamento = async (req, res) => {
  try {
    const propostas = await prisma.propostaFinanciamento.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(propostas);
  } catch (error) {
    console.error("Erro ao listar propostas:", error);
    res.status(500).json({ error: "Erro ao listar propostas." });
  }
};
export const deletarPropostaFinanciamento = async (req, res) => {
  const { id } = req.params;
  try {
    const proposta = await prisma.propostaFinanciamento.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Proposta deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar proposta:", error);
    res.status(500).json({ error: "Erro ao deletar proposta." });
  }
};


