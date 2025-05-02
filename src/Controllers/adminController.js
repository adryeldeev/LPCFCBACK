import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';
import { generateToken } from '../Utils/generateToken';

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin),
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar admin' });
  }
};
