import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
} from "typeorm";

@Entity({ name: "Roll" })
export class Roll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teamId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Pokemon, (p) => p.rolls)
  @JoinColumn({ name: "pokemonNumber", referencedColumnName: "number" })
  pokemon: Pokemon;

  @Column()
  createdAt: Date;
}

@Entity({ name: "Pokemon" })
export class Pokemon {
  @PrimaryColumn()
  number: number;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @Column()
  primaryType: string;

  @Column()
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

  @OneToMany(() => Roll, (r) => r.pokemon)
  rolls: Roll[];
}
