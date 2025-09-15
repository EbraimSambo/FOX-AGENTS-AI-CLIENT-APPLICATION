import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({ clientId: process.env.GITHUB_ID as string, clientSecret: process.env.GITHUB_SECRET as string, }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
        newUser: "/",
        error: "/error",
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {

            return { ...token, ...user };
        },
        async signIn({ account, user, profile }) {
            return true;
        },
        async session({ session, token }) {
            console.log(session)
            return session;
        },
    }
};
