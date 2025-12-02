import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string
        user: {
            /** The user's role. */
            role?: string
            id?: string
        } & DefaultSession["user"]
    }

    interface User {
        role?: string
        id?: string
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        id?: string
        accessToken?: string
    }
}
