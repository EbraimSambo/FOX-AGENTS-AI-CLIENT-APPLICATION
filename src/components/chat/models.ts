import { IconType } from "react-icons";
import { RiOpenaiFill } from "react-icons/ri";
import { RiGeminiFill } from "react-icons/ri";
import { RiClaudeFill } from "react-icons/ri";
import { SiOllama } from "react-icons/si";

export interface Models {
  name: string;
  type: string;
  icon: IconType;
}

export const models = [
  {
    name: "GPT-5",
    type: "GPT",
    icon: RiOpenaiFill,
    description: "Melhor para conversa do dia a dia",
  },
  {
    name: "Gemini",
    type: "GEMINI",
    icon: RiGeminiFill,
    description: "Melhor para temas",
  },
  {
    name: "Claude",
    type: "CLAUDE",
    icon: RiClaudeFill,
    description: "Melhor para coding",
  },
  {
    name: "OLLAMA",
    type: "OLLAMA",
    icon: SiOllama,
    description: "Melhor para coding",
  },
];
