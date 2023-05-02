#!/bin/zsh

while [ $# -gt 0 ]; do
    if [[ $1 == "--"* ]]; then
        v="${1/--/}"
        declare "$v"="$2"
        shift
    fi
    shift
done

if [[ -n $gas ]]
then
    near call $(cat neardev/dev-account) $function $args --accountId $accountId --deposit $deposit --gas $gas
else
    near call $(cat neardev/dev-account) $function $args --accountId $accountId --deposit $deposit
fi
