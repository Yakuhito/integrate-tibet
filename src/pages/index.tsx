import ExampleWidget from "@/components/ExampleWidget";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start lg:p-8 p-4 bg-slate-100"
    >
      <div className='font-medium tracking-tight text-4xl text-gray-900'>Integrate TibetSwap in Your Wallet</div>
      <div className='font-light text-xl text-gray-900 mt-8'>Your users get a better UX, you get some fees 😉</div>
      <div className='grid grid-cols-1 lg:grid-cols-2 lg:mt-16 mt-16'>
        <div className="text-gray-400 h-full flex items-center">
          <div className="w-full lg:text-right text-center pb-4 lg:pr-8">
            <div className="text-brandDark font-medium text-xl">Example Widget</div>
            <div className="text-gray-400 text-md">PoC. Experiment with your own UX.</div>
          </div>
        </div>
        <div className="border-dashed rounded-lg border-gray-400 border-2 px-4 py-4 w-96 h-min-64">
          <div className="w-full">
            <ExampleWidget />
          </div>
        </div>
      </div>
    </main>
  )
}
