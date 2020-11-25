import { PrismaClient, Pokemon } from "@prisma/client";

const EMOJI: { [n: number]: string } = {
  1: "f",
};

export const emojiFor = (poke: Pokemon): string => {
  if (poke.number > 151) {
    return "sparkles";
  }

  return EMOJI[poke.number] || poke.name.toLowerCase();
};

export const pickOne = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const assignPokemonToUser = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string,
  number: number
) => {
  return prisma.roll.create({
    data: {
      teamId: teamId,
      userId: userId,
      Pokemon: {
        connect: {
          number,
        },
      },
    },
    include: {
      Pokemon: true,
    },
  });
};

export const currentPokemonForUser = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string
): Promise<Pokemon | null> => {
  const rolls = await prisma.roll.findMany({
    where: { teamId, userId },
    orderBy: { createdAt: "desc" },
    take: 1,
    include: {
      Pokemon: true,
    },
  });

  if (rolls.length === 0) {
    return null;
  }

  return rolls[0].Pokemon;
};
