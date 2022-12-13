import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
} from "typeorm";

@Entity({ name: "Pokemon" })
export class Pokemon {
  @PrimaryColumn()
  number: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  emoji: string;

  @Column()
  primaryType: string;

  @Column({ nullable: true })
  secondaryType: string;

  @Column()
  hp: number;

  @Column()
  generation: number;

  @Column()
  classification: string;

  @Column()
  isLegendary: boolean;

  @Column()
  attack: number;

  @Column()
  defense: number;

  @Column()
  speed: number;

  @Column()
  specialAttack: number;

  @Column()
  specialDefense: number;

  @Column({ nullable: true })
  fusionNameFirst: string;

  @Column({ nullable: true })
  fusionNameSecond: string;

  @OneToMany("Roll", "pokemon")
  rolls: Roll[];
}

@Entity({ name: "Roll" })
export class Roll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teamId: string;

  @Column()
  userId: string;

  @ManyToOne("Pokemon", "rolls")
  @JoinColumn({ name: "pokemonNumber", referencedColumnName: "number" })
  pokemon: Pokemon;

  @Column()
  createdAt: Date;
}

@Entity({ name: "Installation" })
export class Installation {
  @PrimaryColumn()
  teamId: string;

  @Column()
  installation: string;
}
