import GreetUser from "@/components/chat/greet-user";
import PromptAi from "@/components/chat/prompt-ai";

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center max-w-4xl w-full mx-auto flex-col gap-6">
      <GreetUser />
      <PromptAi />
    </div>
  );
}
