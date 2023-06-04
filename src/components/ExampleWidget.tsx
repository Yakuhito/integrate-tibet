import React, { useEffect, useState } from 'react';

/*
  our main API's base URL
  endpoints: https://api.v2.tibetswap.io/docs
  the main API is slow because it queries both the blockchain and the mempool when you fetch data about pairs (including quotes)
  if a small delay is acceptable (1 min) or you're interested in transactions (trades) done through TibetSwap, you should take a look at the analytics api
  analytics api endpoints: https://api.info.v2.tibetswap.io/docs
*/
const apiBaseURL = "https://api.v2.tibetswap.io"

/*
  This is what we usually mean by 'token'
  A 'pair' is a separate object; the XCH-token pair can be fetched using the 'pair_id' as the pair launcher id
*/
interface Token {
    asset_id: string; // also known as TAIL hash
    pair_id: string; // pair singleton launcher id of the XCH-token pair (pool)
    name: string; // full name - e.g., "Dexie Bucks"
    short_name: string; // "code" - e.g., "DBX"
    image_url: string; // self-explanatory
    verified: boolean; // see comment below
}

/*
  This is a typical response from the 'quote' endpoint
  As you can see, there's plenty of information
  It's up to you what you display to the user
  You can also calculate some things yourself - e.g., price impact (which is also included)
*/
interface QuoteResponse {
  amount_in: number; // amount of XCH/tokens that the user needs to offer, in mojos
  amount_out: number; // amount of XCH/tokens that the user needs to request, in mojos
  price_warning: boolean; // true if price_impact is over 5%
  price_impact: number; // number from 0 to 1 indicating price impact
  fee: number; // recommended fee to be included in the offer (based on mempool); usually overshoot
  asset_id: string; // token asset id
  input_reserve: number; // pair's total input reserve
  output_reserve: number; // pair's total output reserve
}

// used when sending offer to the server
interface OfferData {
  offer: string; // offer1...
  action: string; // always "SWAP"
  total_donation_amount: number; // integer, in mojos (XCH)
  donation_addresses: string[]; // list of donation addresses - ours is xch1hm6sk2ktgx3u527kp803ex2lten3xzl2tpjvrnc0affvx5upd6mq75af8y
  // /\ you can also include "FEE" as a donation address - the funds assigned to it will be used as a tx fee
  donation_weights: number[]; // each address[i] will receive total_donation_amount * (donation_weights[i] / sum(donation_weights))
  // /\ if that's not clear to you, just put the number of mojos you want to send each donation address
}

interface OfferResponse {
  success: boolean; // only 'true' if the offer was sent to the mempool and no error was returned
  message: string; // either traceback or the push_tx response
  offer_id: string; // empty if not usccessful; otherwise Dexie offer id
}

/*
  Fetching available tokens is usually fast since this endpoint does not query the blockchain - it only interacts with our database.
  Note that all tokens, including unverified ones are returned.
  We 'verify' a token to indicate that it's not trying to mislead the user - e.g., USDS is Stably's issued token, and not a token 'impersonating' the real USDS.
  This is a very basic verification and says nothing about our opinion on the token.
*/
const fetchTokens = async (setTokens: any) => {
  /* The '/tokens' endpoint will return a list of all tokens available on our UI */
  const resp = await fetch(`${apiBaseURL}/tokens`)
  const tokens = await resp.json()
  /* Open your developer console to see how the response looks! */
  console.log({ tokens })

  /*
    Highly recommended you only display verified tokens - or come up with a better solution.
    For example, you can manually whitelist tokens, or only display those with a TailDB entry.
  */
  setTokens(tokens.filter((token: Token) => token.verified))
}

/*
  This function sumbits an offer to tibetswap
  Our servers construct the transaction ('accept the offer') and try to push the result to the mempool
  Parse the response to know if everything worked :)
*/
const submitOffer = async (
  offer: string,
  tokenPairLauncherId: string,
  donationAmount: number,
  donationAddresses: string[],
  donationWeights: number[]
) => {
  // https://api.v2.tibetswap.io/docs#/default/create_offer_endpoint_offer__pair_id__post
  // see definition of 'OfferData' or docs for explanation of each parameter
  const payload: OfferData = {
    offer,
    action: "SWAP",
    total_donation_amount: donationAmount,
    donation_addresses: donationAddresses,
    donation_weights: donationWeights
  }

  // make the request to the /offer endpoint
  const resp = await fetch(`${apiBaseURL}/offer/${tokenPairLauncherId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  // return the response
  return resp.json()
}

export default function ExampleWidget() {
  // when something is loading, we lock the text/buttons/etc.
  const [loading, setLoading] = useState(true)

  // text in the form field
  const [text, setText] = useState('')

  // available tokens - will be loaded from the API
  // in V2, only XCH-token and token-XCH trades are available
  const [tokens, setTokens] = useState<Token[]>([])

  // used for the 2nd 'phase' of the widget, after the user said what they want to buy/sell and how much
  // generally, you'd use this information to generate an offer - here, we display it because this site is not a wallet 
  const [
    [quote, xchIsInput, token, donationAmount, donationAddresses, donationWeights],
    setQuoteAndDonationInfo
  ] = useState<[QuoteResponse | null, boolean, Token | null, number, string[], number[]]>([null, false, null, 0, [], []])

  // we'll store the offer here (offer1...)
  const [offer, setOffer] = useState<string>('')

  // offer response - what the server returns after we submit the offer
  const [offerResponse, setOfferResponse] = useState<OfferResponse | null>(null)

  // when page loads, fetch tokens
  useEffect(() => {
    fetchTokens(setTokens).then(() => setLoading(false))
  }, [])

  // this effect sends the offer to the TibetSwap API once the users pastes it
  useEffect(() => {
    // if offer is not empty, the user went through all steps
    if(offer.length > 0) {
      submitOffer(
        offer,
        token?.pair_id ?? '', // pair id = pair launcher id = singleton launcher id of the pair
        donationAmount,
        donationAddresses,
        donationWeights
      ).then((result: OfferResponse) => setOfferResponse(result))
    }
  }, [offer, token, donationAmount, donationAddresses, donationWeights]);

  const changeText = async (newText: string) => {
    // first, update text in UI
    setText(newText)

    // split the input into words
    const words: string[] = newText.toLowerCase().split(" ")
    // command = buy/sell/swap
    const command: string = words[0]

    // store arguments that will be sent to the quote API here
    var args: any = {}
    // this is also needed when calling the quote API
    var token: Token | undefined = undefined

    // buy/sell and swap are handled separately
    // [buy|swap] [amount] [token]
    if(
      words.length === 3 &&
      ["buy", "sell"].includes(command)
    ) {
      // when calling the API, all values are in mojos
      // one CATv2 has 1000 mojos <-> the smalles denomination is 0.001
      const tokenAmount = Math.floor(parseFloat(words[1]) * 1000)

      // find the token with the given short_name (code)
      token = tokens.find(t => t.short_name.toLowerCase() === words[2])
      if(token === undefined) {
        // typo somewhere; let the user correct it
        return
      }

      // first, disable the input to indicate to the user
      // that something is happening
      setLoading(true)

      // finally, set arguments that will be sent to the quote API
      // https://api.v2.tibetswap.io/docs#/default/read_quote_quote__pair_id__get
      if(command === "buy") {
        // when a user buys a token, they give XCH to the AMM
        // therefore, the 'input' is XCH, and the 'output' is the token
        args = {
          // token is the *output*
          amount_out: tokenAmount,
          // XCH is the *input*
          xch_is_input: true,
          // we also want a fee recommendation
          estimate_fee: true
        }
      } else {
        // user wants to SELL some token
        args = {
          // token is the *input*
          amount_in: tokenAmount,
          // XCH is the *output*
          xch_is_input: false,
          // we also want a fee recommendation
          estimate_fee: true
        }
      }
    } else if(
      words.length === 5 &&
      command === "swap" &&
      words[2] === "xch" &&
      words[3] === "for"
    ) {
      // when calling the API, all values are in mojos
      // one XCH has 10 ** 12 mojos
      const xchAmount = Math.floor(parseFloat(words[1]) * 10 ** 12)

      // find the token with the given short_name (code)
      token = tokens.find(t => t.short_name.toLowerCase() === words[4])
      if(token === undefined) {
        // typo somewhere; let the user correct it
        return
      }

      // first, disable the input to indicate to the user
      // that something is happening
      setLoading(true)

      // set the arguments for the quote API call
      args = {
        // token is the *output*
        // XCH is the *input*
        amount_in: xchAmount,
        xch_is_input: true,
        // we also want a fee recommendation
        estimate_fee: true
      }
    }

    if(token === undefined) { return } // text not complete yet

    // if we got here, the args and token variables are set
    // let's make the API request!
    // keep in mind that this is a GET request
    const resp = await fetch(`${apiBaseURL}/quote/${token?.pair_id}?` + new URLSearchParams(args))
    const quote: QuoteResponse = await resp.json();
    // check your dev console to see how the response looks like
    console.log({ quote })

    // now's the time to set the fee
    // we're using Metamask's 0.875% as a reference
    const feePercentage = 875; // 0.875%
    const xchAmountInTrade = args.xch_is_input ? quote.amount_in : quote.amount_out; // in mojos!
    // time to calculate the total fee = donation amount
    const totalDonationAmount = Math.floor(xchAmountInTrade * feePercentage / 100000)

    const donationAddresses = [
      "xch1hm6sk2ktgx3u527kp803ex2lten3xzl2tpjvrnc0affvx5upd6mq75af8y", // tibetswap dev fee wallet
      "xch120ywvwahucfptkeuzzdpdz5v0nnarq5vgw94g247jd5vswkn7rls35y2gc" // marmot recovery foundation
    ]
    // donation weigths - this example respects our 0.3% dev fee (first address)
    // and gives the rest to the 2nd onw
    const donationWeights = [300, 875-300];

    // the donation has to come from somewhere, so we need to modify the quote
    // warning: if the amounts in the final request don't match up (taking totalDonationAmount into account), the API call will return an error
    if(args.xch_is_input) {
      // if the user is asked to offer XCH, just add the donation amount to that number
      quote.amount_in += totalDonationAmount
    } else {
      // if they get XCH for selling their tokens, give them exactly totalDonationAmount less
      quote.amount_out -= totalDonationAmount
    }

    // time to display the offer data and ask the user to sign!
    // or, in our case, display offer data and ask for the offer
    setQuoteAndDonationInfo([quote, args.xch_is_input, token, totalDonationAmount, donationAddresses, donationWeights])
    // /\ [QuoteResponse | null, boolean, Token | null, number, string[], number[]]

    setLoading(false)
  }

  // if the quote is null, we haven't requested it yet
  // meaning that the user has yet to fill in info about the trade
  if(quote === null) {
    /*
      This is just the widget you initially see
      = text field + examples + available tokens
    */
    return (
      <div>
        <div className={`w-full border-2 border-gray-300 rounded-md ${loading ? 'bg-gray-200' : 'bg-white'}`}>
          <label className="pr-2 pl-2">
              I want to
          </label>
          <input
              className="flex-grow py-2 border-l-2 border-gray-300 pl-2 focus:ring-2 focus:ring-inset focus:ring-brandDark"
              type="text"
              placeholder="buy 1 SBX"
              value={text}
              onChange={(e) => changeText(e.target.value)}
              disabled={loading}
          />
        </div>
        <div className='pt-4'>
          <div>Other inputs you can try:</div>
          <div className='list-disc ml-4'>
            <li>{'"'}sell 50 DBX{'"'}</li>
            <li>{'"'}swap 0.01 XCH for USDS{'"'}</li>
          </div>    
        </div>
        <div className='pt-4'>
          <div>Available tokens:</div>
          <div className='w-full flex flex-wrap'>
            {tokens.length === 0 ? 'Loading...' : tokens.map(
              (token: Token) => <button
                key={token.asset_id}
                className={`bg-brandDark ${loading ? '' : 'hover:bg-brandDark/80'} rounded-xl py-1 px-4 mr-1 my-1 text-white text-sm w-min`}
                onClick={() => changeText(
                  text +
                  (text[text.length - 1] == ' ' ? '' : ' ') + 
                  token.short_name
                )}
                disabled={loading}
              >
                {token.short_name}
              </button>
            ) }
          </div>    
        </div>
      </div>
    );
  }

  // if the offer is still not set and we got here,
  // the user told us what they want to buy/sell, but they haven't generated an offer
  // in your wallet, this would be a 'generate offer' screen
  // for this example, we just show some info and ask them to input the geenrated offer 
  if(offer.length === 0) {
    const amountInString = xchIsInput ? (
      `${quote.amount_in / 10 ** 12} XCH`
    ) : (
      `${quote.amount_in / 10 ** 3} ${token?.short_name}`
    )
    const amountOutString = xchIsInput ? (
      `${quote.amount_out / 10 ** 3} ${token?.short_name}`
    ) : (
      `${quote.amount_out / 10 ** 12} XCH`
    )

    return <div>
      <div>
        <div>Ofer details:</div>
        <div className='list-disc ml-4'>
          <li>Offer: {amountInString}</li>
          <li>Request: {amountOutString}</li>
          <li>Recommended fee: {quote.fee / 10 ** 12} XCH</li>
        </div>
        <div className='pt-4'>Other information:</div>
        <div className='list-disc ml-4'>
          <li>Token id: {quote.asset_id.slice(0, 8)}...{quote.asset_id.slice(-9, -1)}</li>
          <li>Price impact: {quote.price_impact * 100}%</li>
          <li>Price warning: {quote.price_warning ? 'YES' : 'No'}</li>
          <li>Dev fees (included): {donationAmount / 10 ** 12} XCH</li>
        </div>
        <div className='pt-8'>Generate the offer and paste it below:</div>
        <input
          className='w-full px-1 py-2 rounded-md'
          placeholder='offer1'
          onChange={(e) => {
            if(e.target.value.startsWith('offer1')) {
              setOffer(e.target.value)
            }
          }}
        />
      </div>
    </div>
  }

  // if we're here, the offer was either sent or is being sent right now
  return <div>
    <div>Response:</div>
    {offerResponse === null ? <div>Loading...</div> : <>
      <div className='list-disc ml-4'>
        <li>Success: {offerResponse?.success ? 'True' : 'False'}</li>
        <li>Dexie link: {
          offerResponse?.offer_id?.length ?? 0 > 0 ? 
          <a
            href={`https://dexie.space/offers/${offerResponse?.offer_id}`}
            className='text-blue-600 hover:text-blue-800 underline'
            target="_blank"
          >here</a> : <>Not available :(</>
        }</li>
        <li>Message:</li>
      </div>
      <textarea
        value={offerResponse?.message}
        className='w-full rounded-md bg-white px-2 py-1'
        disabled
      />
    </>}
  </div>
};
