import { Worker, NearAccount } from "near-workspaces";
import {
    Market,
    Offer,
    createMarket,
    createOffer,
    numberToNEAR,
} from "./helpers";
import { listMarkets, listOffers } from "./helpers";

const MARKETPLACE_CONTRACT_PATH = "./wasm/marketplace.wasm";
const MARKET_DESCRIPTION = "testing";

type Context = {
    worker: Worker | undefined;
    accounts: Record<string, NearAccount>;
};

let context: Context = {
    worker: undefined,
    accounts: {},
};

beforeAll(async () => {
    const worker = await Worker.init();
    const root = worker.rootAccount;
    const marketOwner = await root.createSubAccount("offer");
    const longAccount = await root.createSubAccount("long");
    const shortAccount = await root.createSubAccount("short");
    const marketplace = await root.devDeploy(MARKETPLACE_CONTRACT_PATH);
    await root.call(marketplace, "new", {});
    context = {
        worker,
        accounts: {
            root,
            marketplace,
            marketOwner,
            longAccount,
            shortAccount,
        },
    };
});

describe("Create market", () => {
    beforeAll(async () => {
        const { marketplace, marketOwner } = context.accounts;
        await createMarket(marketplace, marketOwner, MARKET_DESCRIPTION);
    });

    test("Market is created properly", async () => {
        const { marketplace, marketOwner } = context.accounts;
        const expected: Market[] = [
            {
                id: 0,
                description: MARKET_DESCRIPTION,
                owner_id: marketOwner.toJSON(),
                is_long: false,
                is_closed: false,
                long_token_id: "m0l." + marketplace.toJSON(),
                short_token_id: "m0s." + marketplace.toJSON(),
            },
        ];
        const markets = await listMarkets(marketplace);
        expect(markets).toStrictEqual(expected);
    });
});

describe("Create offer", () => {
    let balanceBefore: number = 0;
    let balanceAfter: number = 0;

    beforeAll(async () => {
        const { marketplace, longAccount } = context.accounts;
        balanceBefore = parseFloat(
            (await longAccount.balance()).available.toString(),
        );
        await createOffer(marketplace, longAccount, 0, true, 1);
        balanceAfter = parseFloat(
            (await longAccount.balance()).available.toString(),
        );
    });

    test("Offer is created properly", async () => {
        const { marketplace, longAccount } = context.accounts;
        const expected: Offer[] = [
            {
                id: 0,
                market_id: 0,
                account_id: longAccount.toJSON(),
                is_long: true,
                amount: numberToNEAR(1),
            },
        ];
        const offers = await listOffers(marketplace);
        expect(offers).toStrictEqual(expected);
    });

    test("Correct amount of deposit is used", () => {
        const balanceChange = balanceAfter - balanceBefore;
        expect(balanceChange).toBe();
    });
});

afterAll(async () => {
    await context.worker?.tearDown().catch((err) => {
        console.log("Failed to tear down the worker:", err);
    });
});
