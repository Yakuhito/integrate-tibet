# TibetSwap Integration There

Hello there, wallet developer! Welcome to the repository that helps you integrate TibetSwap in your wallet. Make yourself comfortable - and, if you have any questions, don't hesitate to [reach out](https://twitter.com/yakuh1t0)!


## Wait, what's Tibet[Swap]?

TibetSwap (currently V2) is Chia's first AMM. It allows users to swap tokens and XCH at a price it deems fair. It's a decentralized, trustless, and immutable protocol - anyone (including the creators) has the same permissions, and users can use the [CLI](https://github.com/yakuhito/tibet) to interact with it directly through their wallet and full node. It's basically an app living on the blockchain!


## Why would people use TibetSwap?

There are two types of users. First, they're liquidity providers - as the name suggests, they provide funds that are used to facilitate trades. In return, they earn a set fee of 0.7% per trade (distributed equally among all liquidity providers).

Then, there's normal users - they simply want to sell or buy a token using XCH. Thanks to our API, it's as easy as creating an offer with the correct amount and sending it to an endpoint. We'll handle the rest, and it's completely trustless - if the user isn't given what they asked for, the offer can't be accepted. What's more, these users usually *voluntarily* pay an extra 'developer fee' on top of the 0.7% - see the next point.

## What's in for me?

Glad you asked! There are two main benefits of integrating TibetSwap. First, the user experience of exchanging CATs will benefit greatly - users will find it much easier to buy or sell tokens directly in your wallet (instead of our site). In other words, you'll offer more value to your users.

Second, we've built our API around collecting developer fees. Over 80% of users have paid us a 0.3% dev fee - and they can easily toggle it off on our site. You have the freedom of choosing what fee to charge, and where it gets sent. Depending on the trading volume your wallet generates, this fee can become a new income source for you! We humbly ask you to honor our 0.3% developer fee - or increase it if you are in a charitable mood.

## Where do I start?

We're super glad you asked! You can browse the code in this repository - the example widget has plenty of comments that should make everything clear. You can also play with it at [integrate.tibetswap.io](https://integrate.tibetswap.io). If you have any questions, don't hesitate to reach out!


[Discord](https://discord.com/invite/D8xRkEPxrx)

[Twitter (tag us)](https://twitter.com/TibetSwap)

[Twitter (DM)](https://twitter.com/yakuh1t0)

Keybase: yakuhito_chia
