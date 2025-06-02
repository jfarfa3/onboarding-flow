import { useEffect } from "react";
import { decodeJwtAndCheckExpiration } from "@/utils/jwt";
import { showErrorToast } from "@/utils/toast";
import useSessionStore from "@/store/sessionStore";

interface UseSessionCheckerProps {
  onSessionValid?: () => void;
  onSessionInValid?: () => void;
  errorMessage?: string;
}

export default function useSessionChecker({
  onSessionValid,
  onSessionInValid,
  errorMessage,
}: UseSessionCheckerProps) {
  const { sessionToken, clearSessionToken } = useSessionStore();
  useEffect(() => {
    if (!sessionToken || sessionToken.trim() === "") {
      onSessionInValid?.();
      return;
    }
    decodeJwtAndCheckExpiration(sessionToken)
      .then(() => {
        onSessionValid?.();
      })
      .catch(() => {
        showErrorToast(
          errorMessage || "Ocurrió un error al verificar la sesión.",
          "session-checker"
        );
        clearSessionToken();
        onSessionInValid?.();
      });
  }, [
    sessionToken,
    onSessionValid,
    onSessionInValid,
    clearSessionToken,
    errorMessage,
  ]);
}
