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

export const assignRandomPokemon = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string,
  generation: number
) => {
  return await prisma.pokemon
    .findMany({
      where: { generation },
    })
    .then((pokes) =>
      assignPokemonToUser(prisma, teamId, userId, pickOne(pokes).number)
    );
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

export const renderType = (p: Pokemon): string => {
  if (p.secondaryType) {
    return `:pokemon_type_${p.primaryType}: ${camelCase(
      p.primaryType
    )} / :pokemon_type_${p.secondaryType}: ${camelCase(p.secondaryType)}`;
  }

  return `:pokemon_type_${p.primaryType}: ${camelCase(p.primaryType)}`;
};

const camelCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const statusFor = (pokemon: Pokemon): string => {
  const { name, classification } = pokemon;
  return pickOne([
    `*${name}* (${classification}) is doing OK, thanks for checking in.`,
    `*${name}* (${classification}) is great – but a little hungry.`,
    `*${name}* (${classification}) is annoyed that you forgot their birthday last week.`,
    `*${name}* (${classification}) is good.`,
    `*${name}* (${classification}) is doing well.`,
    `*${name}* (${classification}) is happy and healthy.`,
    `*${name}* (${classification}) is looking great today.`,
    `*${name}* (${classification}) thinks you look nice today.`,
    `*${name}* (${classification}) says your doing a great job.`,
    `*${name}* (${classification}) is says they're lucky to have you.`,
    `*${name}* (${classification}) is just glad to be here.`,
    `*${name}* (${classification}) loves you.`,
    `*${name}* (${classification}) is alright.`,
    `*${name}* (${classification}) is great.`,
    `*${name}* (${classification}) is excellent.`,
    `*${name}* (${classification}) is lovely.`,
    `*${name}* (${classification}) is completing mandatory training – Fs in chat please.`,
    `*${name}* (${classification}) has been better, actually.`,
    `*${name}* (${classification}) has the sniffles.`,
    `*${name}* (${classification}) is doing well.`,
    `*${name}* (${classification}) is doing OK.`,
    `*${name}* (${classification}) is just fine.`,
    `*${name}* (${classification}) is having a bit of a rough day.`,
    `*${name}* (${classification}) would like a hug.`,
    `*${name}* (${classification}) could do with a holiday.`,
    `*${name}* (${classification}) is looking forward to Christmas, which is definitely something that Pokémon celebrate.`,
    `Shit, that's a hench *${name}* (${classification}).`,
    `Goodness, what a large *${name}* (${classification}).`,
    `Looks like *${name}* (${classification}) is happy.`,
    `Looks like *${name}* (${classification}) is having a great time.`,
    `Looks like *${name}* (${classification}) is having a well-earned break.`,
    `Your *${name}* (${classification}) is looking healthy.`,
    `Your *${name}* (${classification}) is looking happy.`,
    `Your *${name}* (${classification}) is well.`,
    `Your *${name}* (${classification}) is just great.`,
    `Your *${name}* (${classification}) is swell.`,
  ]);
};
