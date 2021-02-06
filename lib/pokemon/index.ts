import { PrismaClient, Pokemon, Roll, PokemonWhereInput } from "@prisma/client";

export const emojiFor = (poke: Pokemon): string => {
  if (poke.number > 151) {
    return "sparkles";
  }

  return poke.emoji || poke.name.toLowerCase();
};

export const pickOne = <T>(items: T[]): T => {
  if (items.length === 0) throw new Error("Must provide a non-empty list");
  return items[Math.floor(Math.random() * items.length)];
};

const IMAGE_PREFIX = "https://cdn.traction.one/pokedex/pokemon";

export const imageFor = (poke: Pokemon): string => {
  if (poke.number === 492) {
    return `${IMAGE_PREFIX}/${poke.number}-land.png`;
  }

  return `${IMAGE_PREFIX}/${poke.number}.png`;
};

type FullRoll = Roll & { Pokemon: Pokemon };

export const assignRandomPokemon = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string,
  where: PokemonWhereInput
): Promise<FullRoll> => {
  return prisma.pokemon
    .findMany({ where })
    .then((pokes) => pickOne(pokes))
    .then((poke) => assignPokemonToUser(prisma, teamId, userId, poke.number));
};

export const assignPokemonToUser = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string,
  number: number
): Promise<FullRoll> => {
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
    `It would seem your *${name}* (${classification}) is doing OK, thanks for checking in.`,
    `It would seem your *${name}* (${classification}) is great – but a little hungry.`,
    `It would seem your *${name}* (${classification}) is annoyed that you forgot their birthday last week.`,
    `Your *${name}* (${classification}) is good.`,
    `Your *${name}* (${classification}) is strong.`,
    `Your *${name}* (${classification}) is flourishing.`,
    `Your *${name}* (${classification}) is thriving.`,
    `Your *${name}* (${classification}) is in good health.`,
    `Your *${name}* (${classification}) is bright-eyed.`,
    `Your *${name}* (${classification}) is wholesome.`,
    `Your *${name}* (${classification}) is fresh.`,
    `Your *${name}* (${classification}) is hearty.`,
    `Your *${name}* (${classification}) is prosperous.`,
    `Your *${name}* (${classification}) is solid as a rock.`,
    `Your *${name}* (${classification}) is doing well.`,
    `Your *${name}* (${classification}) is happy and healthy.`,
    `Your *${name}* (${classification}) is looking great today.`,
    `Your *${name}* (${classification}) thinks you look nice today.`,
    `Your *${name}* (${classification}) thinks you're doing a great job.`,
    `Your *${name}* (${classification}) is says they're lucky to have you.`,
    `Your *${name}* (${classification}) is just glad to be here.`,
    `Your *${name}* (${classification}) loves you.`,
    `Your *${name}* (${classification}) is alright.`,
    `Your *${name}* (${classification}) is... still a piece of garbage.`,
    `Your *${name}* (${classification}) is great.`,
    `Your *${name}* (${classification}) is excellent.`,
    `Your *${name}* (${classification}) is lovely.`,
    `Your *${name}* (${classification}) is completing mandatory training – Fs in chat please.`,
    `Your *${name}* (${classification}) has been better, actually.`,
    `Your *${name}* (${classification}) has the sniffles.`,
    `Your *${name}* (${classification}) is having a bit of a rough day.`,
    `Your *${name}* (${classification}) would like a hug.`,
    `Your *${name}* (${classification}) is suffering from the longer term effects of COVID-19.`,
    `Your *${name}* (${classification}) could do with a holiday.`,
    `Your *${name}* (${classification}) is looking forward to Christmas, which is definitely something that Pokémon celebrate.`,
    `Shit, that's a hench *${name}* (${classification}).`,
    `Goodness, what a large *${name}* (${classification}).`,
    `Looks like your *${name}* (${classification}) is happy.`,
    `Looks like your *${name}* (${classification}) is enjoying themselves.`,
    `Looks like your *${name}* (${classification}) is doing well.`,
    `Looks like your *${name}* (${classification}) is doing great.`,
    `Looks like your *${name}* (${classification}) is having a great time.`,
    `Looks like your *${name}* (${classification}) is having a well-earned break.`,
    `Your *${name}* (${classification}) is looking healthy.`,
    `Your *${name}* (${classification}) is looking happy.`,
    `Your *${name}* (${classification}) is well.`,
    `Your *${name}* (${classification}) is just great.`,
    `Your *${name}* (${classification}) is swell.`,
    `Your *${name}* (${classification}) is doing well.`,
    `Your *${name}* (${classification}) is doing OK.`,
    `Your *${name}* (${classification}) is doing great.`,
    `Your *${name}* (${classification}) is just fine.`,
  ]);
};
