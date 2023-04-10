# Smart contract for one-zero

## Features

- Create a market
- Close a market
- View markets
- Create an offer, creating a share
- Accept an offer, getting a share
- View offers
- Sell shares
- Buy shares

## Structs

- `Market`
  - The market that tracks an event on which predictions can be made
- `ViewMarket`
  - The public view of the `Market` struct
- `Offer`
  - The creation of a `SharePair`, which is then listed to be matched by the other half
- `SharePair`
  - A pair of users that are matched by being long and short on a market by a specified amount

## TODO

- [ ] Incomplete events
- [ ] Change the way shares are stored to support
  - Share enumeration
  - Share transfer
- [ ] Oracle integratino
  - to get data from outside sources to know how to resolve a market
- [ ] Storage staking
