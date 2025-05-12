-- CreateTable
CREATE TABLE `Imagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `carroId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Imagem` ADD CONSTRAINT `Imagem_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `Carro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
