import {
    Worker,
    NearAccount,
    captureError,
    BN,
    parseNEAR,
    tGas,
} from "near-workspaces";
import anyTest, { TestFn } from "ava";
import { Market, Offer, listMarkets, listOffers } from "./helpers";

const STORAGE_BYTE_COST = "1.5mN";
const MARKETPLACE_CONTRACT_PATH = "./wasm/marketplace.wasm";

const test = anyTest as TestFn<{
    worker: Worker;
    accounts: Record<string, NearAccount>;
}>;

test.before(async (t) => {
    const worker = await Worker.init();
    const root = worker.rootAccount;
    const marketOwner = await root.createSubAccount("offer");
    const longAccount = await root.createSubAccount("long");
    const shortAccount = await root.createSubAccount("short");
    const marketplace = await root.devDeploy(MARKETPLACE_CONTRACT_PATH);
    await root.call(marketplace, "new", {});
    t.context.worker = worker;
    t.context.accounts = {
        root,
        marketplace,
        marketOwner,
        longAccount,
        shortAccount,
    };
});

test("Create market", async (t) => {
    const { marketplace, marketOwner } = t.context.accounts;
    await marketOwner.call(
        marketplace,
        "create_market",
        {
            description: "testing",
        },
        {
            attachedDeposit: parseNEAR("5 N").toString(),
            gas: tGas(300),
        },
    );
    const actual: Market[] = [
        {
            id: 0,
            description: "testing",
            owner_id: marketOwner.toJSON(),
            is_long: false,
            is_closed: false,
            long_token_id: "m0l." + marketplace.toJSON(),
            short_token_id: "m0s." + marketplace.toJSON(),
        },
    ];
    const markets = await listMarkets(marketplace);
    t.deepEqual(actual, markets);
});

test("Create offer", async (t) => {
    const { marketplace, longAccount } = t.context.accounts;
    await longAccount.call(
        marketplace,
        "create_offer",
        {
            market_id: 0,
            is_long: true,
            amount: parseNEAR("1 N").toString(),
        },
        {
            attachedDeposit: parseNEAR("3 N").toString(),
            gas: tGas(300),
        },
    );
    const actual: Offer[] = [
        {
            id: 0,
            market_id: 0,
        },
    ];
    const offers = await listOffers(marketplace);
    t.deepEqual(actual, offers);
});

test.after(async (t) => {
    await t.context.worker.tearDown().catch((err) => {
        console.log("Failed to tear down the worker:", err);
    });
});
