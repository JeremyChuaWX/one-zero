import { WalletSelector } from "@near-wallet-selector/core";
import { providers } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";

const THREE_HUNDRED_TGAS = "300000000000000";
const NO_DEPOSIT = "0";

const viewMethod = async ({
    selector,
    contractId,
    method,
    args = {},
}: {
    selector: WalletSelector;
    contractId: string;
    method: string;
    args?: Object;
}) => {
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query<CodeResult>({
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
    });

    return JSON.parse(Buffer.from(res.result).toString());
};

type CallMethodOptions = {
    gas: string;
    deposit: string;
};

const callMethod = async ({
    selector,
    accountId,
    contractId,
    method,
    args = {},
    partialOptions,
}: {
    selector: WalletSelector;
    accountId: string;
    contractId: string;
    method: string;
    args?: Object;
    partialOptions?: Partial<CallMethodOptions>;
}) => {
    const options: CallMethodOptions = {
        gas: partialOptions?.gas ?? THREE_HUNDRED_TGAS,
        deposit: partialOptions?.deposit ?? NO_DEPOSIT,
    };
    const wallet = await selector.wallet();
    const outcome = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
            {
                type: "FunctionCall",
                params: {
                    methodName: method,
                    args,
                    gas: options.gas,
                    deposit: options.deposit,
                },
            },
        ],
    });

    if (outcome) return providers.getTransactionLastResult(outcome);
};

export { viewMethod, callMethod };
