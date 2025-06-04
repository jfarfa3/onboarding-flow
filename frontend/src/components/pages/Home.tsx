import Letter from "@/components/atoms/Letter";
import LoginForm from "@/components/organism/Login";
import { useNavigate } from "react-router-dom";
import Div from "../atoms/Div";
import useSessionChecker from "@/hooks/useSessionChecker";

export default function Home() {
  const navigate = useNavigate();
  const onboarding = ["ON", "B", "O", "A", "R", "D", "I", "N", "G"];
  const flow = ["F", "L", "O", "W"];

  useSessionChecker({
    onSessionValid: () => {
      navigate("/dashboard");
    },
  });

  return (
    <Div>
      <div className="bg-white rounded-lg p-8 w-full">
        <div className="flex flex-row items-center justify-center gap-2">
          {onboarding.map((letter, index) => (
            <Letter
              key={index}
              letter={letter}
              firstLetter={index === 0}
            />
          ))}
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          {
            flow.map((letter, index) => (
              <Letter
                key={index}
                letter={letter}
                firstLetter={index === 0}
              />
            ))
          }
        </div>
      </div>
      <LoginForm />

    </Div>
  );
}