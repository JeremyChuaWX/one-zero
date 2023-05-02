#!/bin/zsh

while [ $# -gt 0 ]; do
    if [[ $1 == "--"* ]]; then
        v="${1/--/}"
        declare "$v"="$2"
        shift
    fi
    shift
done

if [[ -n $args ]]
then
    near view $(cat neardev/dev-account) $function $args
else
    near view $(cat neardev/dev-account) $function
fi
