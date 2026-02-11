"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        const roleName = formData.get("roleName");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password, name, roleName }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.details
                    ? `${data.error}: ${data.details}`
                    : (data.error || "Une erreur est survenue");
                throw new Error(errorMessage);
            }

            setSuccess("Compte créé avec succès ! En attente de validation par l'administrateur.");
            // Optional: redirect after delay
            setTimeout(() => {
                router.push("/connexion");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Créer un compte
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Inscrivez-vous pour accéder au portail
                    </p>
                </div>

                <form onSubmit={onSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom complet / Nom de l'établissement
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                Je suis un(e)
                            </label>
                            <select
                                id="roleName"
                                name="roleName"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            >
                                <option value="stagiaire">Stagiaire</option>
                                <option value="tuteur">Tuteur</option>
                                <option value="ecole">École (Lycée/Collège)</option>
                                <option value="universite">Université</option>
                                <option value="rh">RH / Recruteur</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "S'inscrire"
                        )}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Déjà un compte ? </span>
                        <Link href="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
                            Se connecter
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
