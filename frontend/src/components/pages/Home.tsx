import Letter from "@/components/atoms/Letter";
import LoginForm from "@/components/organism/Login";
import useSessionStore from "@/store/sessionStore";
import { decodeJwtAndCheckExpiration } from "@/utils/jwt";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Div from "../atoms/Div";
import { showErrorToast } from "@/utils/toast";

export default function Home() {
  const navigate = useNavigate();
  const onboarding = ["ON", "B", "O", "A", "R", "D", "I", "N", "G"];
  const flow = ["F", "L", "O", "W"];
  const { sessionToken, clearSessionToken } = useSessionStore();

  useEffect(() => {
    if (sessionToken) {
      decodeJwtAndCheckExpiration(sessionToken)
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {
          showErrorToast("Session expired or invalid token. Please log in again.", "session-error");
          clearSessionToken();
        });
    }
  }, [sessionToken, navigate, clearSessionToken]);



  return (
    <Div>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-fit">
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