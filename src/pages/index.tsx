import ExampleWidget from "@/components/ExampleWidget";
import { Link } from "@/components/Link";
import { Section } from "@/components/Section";

export default function Home() {
  const exampleWidget = (
    <div className="border-dashed rounded-lg border-gray-400 border-2 px-4 py-4 w-96 h-min-64">
      <div className="w-full">
        <ExampleWidget />
      </div>
    </div>
  )

  const firstStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
      First, come up with an elegant way to know what the user wants to trade, and how much. You can use a traditional swap interface, copy the widget above, or build your own UX. Aim to have a solution that is simple, intuitive, and quick.
    </div>
  )

  const secondStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
      Once you know the token, operation (buy/sell), and one amount (either the input or the output), you{"'"}re ready to make the first API call.
      The{' '}
      <Link text="quote endpoint" url="https://api.v2.tibetswap.io/docs#/default/read_quote_quote__pair_id__get" />
      {' '}will, as the name suggests, give you a quote, along with other useful information.
    </div>
  )

  const thirdStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
      It{"'"}s time to calculate fees. We highly recommend taking a percentage of the trade (e.g., 0.875% - just like Metamask!). We also humbly ask you to respect our 0.3% dev fee.
      See the{' '}
      <Link text="example widget" url="https://github.com/Yakuhito/integrate-tibet/blob/master/src/components/ExampleWidget.tsx" />
      {' '} for more details about this step.
    </div>
  )

  const fourthStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
      You have all the info required to do a swap now, so it{"'"}s time to ask the user for a final confirmation by showing them the amounts, price, price impact, fee, etc. Once they accept, simply generate the offer.
    </div>
  )

  const fifthStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
      You have all the data required to make a call to{' '}
      <Link text="this API endpoint" url="https://api.v2.tibetswap.io/docs#/default/create_offer_endpoint_offer__pair_id__post" />
      . Send us the offer, as well as the fees, how we should distribute them, and the pair involved - we{"'"}ll build the full spend bundle and broadcast it to the network.
    </div>
  )

  const sixthStep = (
    <div className="w-96 text-gray-700 text-lg text-justify tracking-wide">
       You{"'"}ll know if the trade went through from the response of the last API call. It{"'"}s time to do something nice from the user - e.g., confetti. Your fee will arrive in your wallet as soon as the transaction is confirmed.
    </div>
  )

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start lg:p-8 p-4 pb-0 bg-slate-100 text-black"
    >
      <div className='font-medium tracking-tight text-4xl text-gray-900'>Integrate TibetSwap in Your Wallet</div>
      <div className='font-light text-xl text-gray-900 mt-8'>Your users get a better UX, you get some fees 😉</div>
      <div className="lg:mt-8">
        <Section
          title="Example Widget"
          subtitle="PoC. Experiment with your own UX."
          showcasedElement={exampleWidget}
          titleOnRight={false}
        />
      </div>
      <div className="lg:mb-4 mt-24 text-4xl text-brandDark tracking-tight">
        Step-by-Step Integration Guide
      </div>
      <Section
        title="Step 1"
        subtitle="Show your creativity or go with the tried-and-tested"
        showcasedElement={firstStep}
        titleOnRight={true}
      />
      <Section
        title="Step 2"
        subtitle="First TibetSwap API call"
        showcasedElement={secondStep}
        titleOnRight={false}
      />
      <Section
        title="Step 3"
        subtitle="Your cut - and hopefully ours"
        showcasedElement={thirdStep}
        titleOnRight={true}
      />
      <Section
        title="Step 4"
        subtitle="Last confirmation from the user"
        showcasedElement={fourthStep}
        titleOnRight={false}
      />
      <Section
        title="Step 5"
        subtitle="Last request to our API"
        showcasedElement={fifthStep}
        titleOnRight={true}
      />
      <Section
        title="Step 6"
        subtitle="Confetti time!"
        showcasedElement={sixthStep}
        titleOnRight={false}
      />
      <div className="lg:mb-4 mt-24 text-4xl text-brandDark tracking-tight">
        Questions? Issues?
      </div>
      <div className="mt-8 mb-16 lg:mt-4 w-full text-gray-700 text-lg text-center tracking-wide">
        DM me on {' '}<Link url="https://twitter.com/yakuh1t0" text="twitter"/>{' '} or join our {' '}<Link url="https://discord.com/invite/D8xRkEPxrx" text="Discord server"/>.
      </div>
      <div className="w-full text-gray-400 text-md text-center">
        <Link url="https://v2.tibetswap.io" text="v2.tibetswap.io"/>
      </div>
    </main>
  )
}
