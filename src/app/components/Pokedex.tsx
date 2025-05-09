"use client";

import { PokemonInfo } from "@/lib/types";
import { PokemonCard } from "./PokemonCard";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

export const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState<PokemonInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchKantoPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();

      const fullList = await Promise.all(
        data.results.map(async (p: { name: string }) => {
          const pokemonRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${p.name}`
          );
          const pokemonData = await pokemonRes.json();

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            gifUrl: `https://play.pokemonshowdown.com/sprites/ani/${pokemonData.name}.gif`,
            fallbackImage:
              pokemonData.sprites.other["official-artwork"].front_default,
            types: pokemonData.types.map(
              (t: { type: { name: string } }) => t.type.name
            ),
            height: pokemonData.height,
          };
        })
      );

      setPokemonList(fullList);
    } catch {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKantoPokemons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setError("");
    setLoading(true);

    try {
      const searchResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );
      if (!searchResponse.ok)
        throw new Error("Sorry, we couldn't find your Pokémon.");
      const pokemonData = await searchResponse.json();

      console.log(
        `https://play.pokemonshowdown.com/sprites/ani/${pokemonData.name}.gif`
      );

      const foundPokemon: PokemonInfo = {
        id: pokemonData.id,
        name: pokemonData.name,
        gifUrl: `https://play.pokemonshowdown.com/sprites/ani/${pokemonData.name}.gif`,
        fallbackImage:
          pokemonData.sprites.other["official-artwork"].front_default,
        types: pokemonData.types.map(
          (t: { type: { name: string } }) => t.type.name
        ),
        height: pokemonData.heigth,
      };

      setPokemonList([foundPokemon]);
    } catch (error: unknown) {
      setPokemonList([]);
      if (typeof error === "string") {
        setError("Something went wrong.");
      } else if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setSearch(e.target.value);

    if (value.length == 0) {
      setError("");
      fetchKantoPokemons();
    }
  };

  return (
    <div className="relative">
      <div className="search-area mb-20 w-full flex items-center justify-center gap-2 sticky top-0 z-[2] bg-[#f6f8fc]">
        <input
          type="text"
          className="w-full h-16 rounded-lg bg-white shadow-lg text-sm placeholder:text-zinc-400 p-6 focus:shadow-2xl outline-none transition-all duration-150 ease-in-out"
          placeholder="Search your Pokémon!"
          value={search}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="h-16 aspect-square rounded-lg bg-red-400 shadow-lg flex items-center justify-center focus:shadow-2xl outline-none transition-all duration-150 ease-in-out cursor-pointer"
          onClick={handleSearch}
        >
          <Image
            src="/images/assets/pokeball-icon-white.svg"
            width={30}
            height={30}
            alt="Pokeball Icon"
          />
        </button>
      </div>
      {error && (
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/images/assets/missingno.svg"
              width={85}
              height={200}
              alt="MissingNo"
              className="mx-auto mb-4"
            />
          </div>
          <p className="text-zinc-400 font-semibold">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 w-full">
        {!loading && pokemonList ? (
          pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} {...pokemon} />
          ))
        ) : (
          <div className="w-full flex items-center justify-center opacity-50 col-span-1 md:col-span-2 lg:col-span-3">
            <Image
              src="/images/assets/pokeball-icon.svg"
              priority
              width={300}
              height={300}
              className="animate-pulse"
              alt="Loading..."
            />
          </div>
        )}
      </div>
    </div>
  );
};
