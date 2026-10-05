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
    id: "test-track",
    title: "Aura",
    artist: "Probhanshu SC",
    description: "An original soundtrack.",
    audioUrl: "/tracks/Aura.wav",
    coverUrl: "/covers/Aura-poster.png",
    year: 2026,
    genre: "Soundtrack",
  },
];