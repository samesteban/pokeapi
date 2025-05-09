"use client";

import { PokemonInfo } from "@/lib/types";

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-400",
  water: "bg-blue-400",
  electric: "bg-yellow-400",
  grass: "bg-green-400",
  ice: "bg-cyan-300",
  fighting: "bg-orange-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-sky-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-indigo-600",
  dragon: "bg-indigo-800",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export const PokemonCard = ({
  id,
  name,
  gifUrl,
  fallbackImage,
  types,
}: PokemonInfo) => {
  return (
    <div className="w-full h-auto rounded-3xl bg-white p-6 shadow-2xl flex items-center justify-end flex-col max-h-[150px]">
      <div className="h-[150px] flex items-center justify-end flex-col">
        <img
          src={gifUrl}
          alt={name}
          sizes="96px"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
            e.currentTarget.className = "max-h-[100px]";
          }}
          className="-mt-20 object-contain mb-4 max-h-[130px]"
        />
      </div>
      <p className="text-xs text-gray-400 font-bold mb-1">
        #{id.toString().padStart(3, "0")}
      </p>
      <p className="text-base font-bold capitalize">{name}</p>
      {types && (
        <div className="flex items-center w-full flex-wrap justify-center gap-2 mt-1">
          {types.map((type) => (
            <div
              key={type}
              className={`flex items-center justify-center px-2.5 py-1.5 rounded-sm ${
                typeColors[type] || "bg-gray-500"
              }`}
            >
              <span className="text-black uppercase font-bold text-[10px] opacity-60">
                {type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
