export type Track = {
  id: string;
  title: string;
  artist: string;
  description: string;
  audioUrl: string;
  coverUrl: string;
  duration?: string;
  year?: number;
  genre?: string;
};

export const tracks: Track[] = [
  {
    id: "aura-track",
    title: "Aura",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Aura.wav",
    coverUrl: "/covers/Aura-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },

  {
    id: "lumina-track",
    title: "Lumina",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Lumina.wav",
    coverUrl: "/covers/Lumina-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },

    {
    id: "grace-track",
    title: "Grace",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Grace.wav",
    coverUrl: "/covers/Grace-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },

  {
    id: "sail-track",
    title: "Sail",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Sail.wav",
    coverUrl: "/covers/Sail-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },

  {
    id: "classi-track",
    title: "Classi",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Classi.wav",
    coverUrl: "/covers/Classi-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },
];