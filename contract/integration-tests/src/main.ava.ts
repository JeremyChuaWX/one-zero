import { Worker, NearAccount, captureError, NEAR, BN } from "near-workspaces";
import anyTest, { TestFn } from "ava";

const STORAGE_BYTE_COST = "1.5mN";
const MARKETPLACE_CONTRACT_PATH =
    "../../target/wasm32-unknown-unknown/release/marketplace.wasm";

const test = anyTest as TestFn<{
    worker: Worker;
    accounts: Record<string, NearAccount>;
}>;

test.before(async (t) => {
    const worker = await Worker.init();
    const root = worker.rootAccount;
    const marketplace_contract = await root.devDeploy(
        MARKETPLACE_CONTRACT_PATH,
    );
    const offer_account = await root.createSubAccount("offer");
    const long_account = await root.createSubAccount("long");
    const short_account = await root.createSubAccount("short");
    t.context.worker = worker;
    t.context.accounts = {
        root,
        marketplace_contract,
        offer_account,
        long_account,
        short_account,
    };
});

// TESTS HERE

test.after(async (t) => {
    await t.context.worker.tearDown().catch((err) => {
        console.log("Failed to tear down the worker:", err);
    });
});
