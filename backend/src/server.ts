import { createApp } from "./app";
import { connectToDatabase } from "./config/db";
import { env } from "./config/env";

async function main() {
    await connectToDatabase();
    const app = createApp();
    app.listen(env.PORT, () => {
        console.log(`Backend listening on http://localhost:${env.PORT}`);
    });
}

main().catch((err) => {
    console.error("Fatal error starting server:", err);
    process.exit(1);
});


