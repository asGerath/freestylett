const TEMPORARY_FREESTYLER_PHOTOS: Readonly<Record<string, string>> = {
  aczino: "/images/fms colombia/Aczino.webp",
  "valles-t": "/images/fms colombia/Valles-T.webp",
  "exodo-lirical": "/images/fms colombia/Exodo Lirical.webp",
  reverse: "/images/fms colombia/Reverse.webp",
  "fat-n": "/images/fms colombia/Fat N.webp",
  pandora: "/images/fms colombia/Pandora.webp",
  filosofo: "/images/fms colombia/Filosofo.webp",
  dima: "/images/fms colombia/Dima.webp",
  puppy: "/images/fms colombia/Puppy.webp",
  visionario: "/images/fms colombia/Visionario.webp",
  urko: "/images/fms colombia/Urko.webp",
  vilardy: "/images/fms colombia/Vilardy.webp",
};

type CountryVisual = {
  flagSrc?: string;
  emoji?: string;
};

const COUNTRY_VISUALS: Readonly<Record<string, CountryVisual>> = {
  México: {
    flagSrc: "/images/uni/Bandera Mexico.webp",
  },
  "República Dominicana": {
    flagSrc: "/images/uni/Bander Republica Dominican.webp",
  },
  Colombia: {
    emoji: "🇨🇴",
  },
  Cuba: {
    emoji: "🇨🇺",
  },
};

/**
 * Adaptador temporal para las imágenes preliminares del roster.
 * Mantiene las rutas fuera de los componentes para retirarlas fácilmente
 * cuando el catálogo de medios se conecte a Supabase Storage.
 */
export function getTemporaryFreestylerPhoto(slug: string) {
  return TEMPORARY_FREESTYLER_PHOTOS[slug];
}

export function getCountryVisual(country: string): CountryVisual {
  return COUNTRY_VISUALS[country] ?? { emoji: "🌎" };
}
