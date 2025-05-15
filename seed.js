import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient(); // ajuste o caminho se precisar

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Admin Inicial',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Usuário admin criado com sucesso!');
  } else {
    console.log('Admin já existe.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
