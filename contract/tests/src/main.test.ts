import { Worker, NearAccount } from "near-workspaces";
import { Market, Offer, cancelOffer, getTokenBalance } from "./helpers";
import {
    listMarkets,
    listOffers,
    createMarket,
    closeMarket,
    createOffer,
    acceptOffer,
    nearNumberToString,
} from "./helpers";

const MARKETPLACE_CONTRACT_PATH = "./wasm/marketplace.wasm";
const MARKET_DESCRIPTION = "testing";

type Context = {
    worker: Worker;
    accounts: Record<string, NearAccount>;
    markets: Market[];
    offers: Offer[];
};

let context: Context;

beforeAll(async () => {
    const worker = await Worker.init();
    const root = worker.rootAccount;
    const marketOwner = await root.createSubAccount("owner");
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
        markets: [],
        offers: [],
    };
});

describe("Create market", () => {
    test("Market is created properly", async () => {
        const { marketplace, marketOwner } = context.accounts;
        await createMarket({
            marketplace,
            marketOwner,
            description: MARKET_DESCRIPTION,
        });
        context.markets = await listMarkets(marketplace);
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
        expect(context.markets).toStrictEqual(expected);
    });
});

describe("Close market", () => {
    test("Market cannot be closed by non-owner", async () => {
        const { marketplace, shortAccount } = context.accounts;
        await expect(
            closeMarket({
                marketplace,
                marketOwner: shortAccount,
                marketId: 0,
                isLong: true,
            }),
        ).rejects.toThrow();
    });

    test("Market is closed properly", async () => {
        const { marketplace, marketOwner } = context.accounts;
        await closeMarket({
            marketplace,
            marketOwner,
            marketId: 0,
            isLong: true,
        });
        context.markets = await listMarkets(marketplace);
        const expected: Market[] = [
            {
                id: 0,
                description: MARKET_DESCRIPTION,
                owner_id: marketOwner.toJSON(),
                is_long: true,
                is_closed: true,
                long_token_id: "m0l." + marketplace.toJSON(),
                short_token_id: "m0s." + marketplace.toJSON(),
            },
        ];
        expect(context.markets).toStrictEqual(expected);
    });

    test("Cannot close an already closed market", async () => {
        const { marketplace, marketOwner } = context.accounts;
        await expect(
            closeMarket({
                marketplace,
                marketOwner,
                marketId: 0,
                isLong: true,
            }),
        ).rejects.toThrow();
    });
});

describe("Create offer", () => {
    test("Cannot create offer on a closed market", async () => {
        const { marketplace, longAccount } = context.accounts;
        await expect(
            createOffer({
                marketplace,
                offerMaker: longAccount,
                marketId: 0,
                isLong: true,
                amount: 1,
            }),
        ).rejects.toThrow();
    });

    test("Offer is created properly", async () => {
        const { marketplace, marketOwner, longAccount } = context.accounts;
        await createMarket({
            marketplace,
            marketOwner,
            description: MARKET_DESCRIPTION,
        });
        context.markets = await listMarkets(marketplace);
        await createOffer({
            marketplace,
            offerMaker: longAccount,
            marketId: 1,
            isLong: true,
            amount: 1,
        });
        context.offers = await listOffers(marketplace);
        const expected: Offer[] = [
            {
                id: 0,
                market_id: 1,
                account_id: longAccount.toJSON(),
                is_long: true,
                amount: nearNumberToString(1),
            },
        ];
        expect(context.offers).toStrictEqual(expected);
    });
});

describe("Accept offer", () => {
    test("Cannot accept your own offer", async () => {
        const { marketplace, longAccount } = context.accounts;
        await expect(
            acceptOffer({
                marketplace,
                offerAccepter: longAccount,
                offerId: 0,
            }),
        ).rejects.toThrow();
    });

    test("Offer is accepted properly", async () => {
        const { marketplace, shortAccount } = context.accounts;
        await acceptOffer({
            marketplace,
            offerAccepter: shortAccount,
            offerId: 0,
        });
        context.offers = await listOffers(marketplace);
        const expected: Offer[] = [];
        expect(context.offers).toStrictEqual(expected);
    });

    test("Cannot accept offer on a closed market", async () => {
        const { marketplace, marketOwner, longAccount, shortAccount } =
            context.accounts;
        await createOffer({
            marketplace,
            offerMaker: longAccount,
            marketId: 1,
            isLong: true,
            amount: 1,
        });
        await closeMarket({
            marketplace,
            marketOwner,
            marketId: 1,
            isLong: true,
        });
        await expect(
            acceptOffer({
                marketplace,
                offerAccepter: shortAccount,
                offerId: 1,
            }),
        ).rejects.toThrow();
    });

    test("Tokens distributed properly", async () => {
        const { marketplace, longAccount, shortAccount } = context.accounts;
        await expect(
            getTokenBalance({
                token: "m1l." + marketplace.toJSON(),
                account: longAccount,
                worker: context.worker,
            }),
        ).resolves.toBe(nearNumberToString(1));
        await expect(
            getTokenBalance({
                token: "m1s." + marketplace.toJSON(),
                account: shortAccount,
                worker: context.worker,
            }),
        ).resolves.toBe(nearNumberToString(1));
    });
});

describe("Cancel offer", () => {
    test("Offer cannot be cancelled by non-owner", async () => {
        const { marketplace, shortAccount } = context.accounts;
        await expect(
            cancelOffer({
                marketplace,
                offerMaker: shortAccount,
                offerId: 1,
            }),
        ).rejects.toThrow();
    });

    test("Offer is cancelled properly", async () => {
        const { marketplace, longAccount } = context.accounts;
        await cancelOffer({
            marketplace,
            offerMaker: longAccount,
            offerId: 1,
        });
        context.offers = await listOffers(marketplace);
        const expected: Offer[] = [];
        expect(context.offers).toStrictEqual(expected);
    });
});

describe("Reward distribution", () => {
    test("Cannot get rewards from an open market", async () => {});
    test("Rewards distributed properly (win)", async () => {});
    test("Rewards distributed properly (lose)", async () => {});
});

afterAll(async () => {
    await context.worker.tearDown().catch((err) => {
        console.log("Failed to tear down the worker:", err);
    });
});
