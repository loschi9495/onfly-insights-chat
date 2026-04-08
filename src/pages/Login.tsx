import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "@/lib/api";
import { storeAuth, getStoredUser } from "@/lib/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

import { API_URL, GOOGLE_CLIENT_ID } from "@/lib/config";

export default function Login() {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredUser()) {
      navigate("/", { replace: true });
      return;
    }

    // Check if auth bypass is active
    fetch(`${API_URL}/auth/bypass-status`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.bypass) {
          const authData = await loginWithGoogle("bypass");
          storeAuth({
            user: authData.user,
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
          });
          navigate("/", { replace: true });
          return;
        }
        loadGoogleButton();
      })
      .catch(() => loadGoogleButton());
  }, []);

  const loadGoogleButton = () => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      if (buttonRef.current) {
        window.google?.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 320,
        });
      }
    };
    document.body.appendChild(script);
  };

  const handleGoogleResponse = async (response: { credential: string }) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginWithGoogle(response.credential);
      storeAuth({
        user: data.user,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      navigate("/", { replace: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao autenticar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Onfly Insights</h1>
          <p className="text-muted-foreground">
            Relatórios inteligentes em linguagem natural
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Entrar</h2>
            <p className="text-sm text-muted-foreground">
              Use sua conta Google para acessar
            </p>
          </div>

          <div className="flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Autenticando...
              </div>
            ) : (
              <div ref={buttonRef} />
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Acesso restrito a usuários autorizados
        </p>
      </div>
    </div>
  );
}
