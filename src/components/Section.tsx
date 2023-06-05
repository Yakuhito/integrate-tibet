import React from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  showcasedElement: JSX.Element;
  titleOnRight: boolean;
};

export const Section: React.FC<SectionProps> = ({ title, subtitle, showcasedElement, titleOnRight }) => (
  <div className='mt-16 lg:mt-8'>
    <div className="text-gray-400 h-full flex items-center lg:hidden">
      <div className="w-full text-center pb-4">
        <div className="text-brandDark font-medium text-xl">{title}</div>
        <div className="text-gray-400 text-md">{subtitle}</div>
      </div>
    </div>
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      {!titleOnRight && <div className='lg:block hidden'>
        <div className="text-gray-400 h-full flex items-center">
          <div className="w-full text-right pr-8 pb-8">
            <div className="text-brandDark font-medium text-xl">{title}</div>
            <div className="text-gray-400 text-md">{subtitle}</div>
          </div>
        </div>
      </div>}
      <div className={titleOnRight ? 'lg:pr-8' : 'lg:pl-8'}>
        {showcasedElement}
      </div>
      {titleOnRight && <div className='lg:block hidden'>
        <div className="text-gray-400 h-full flex items-center">
          <div className="w-full text-left pl-8 pb-8">
            <div className="text-brandDark font-medium text-xl">{title}</div>
            <div className="text-gray-400 text-md">{subtitle}</div>
          </div>
        </div>
      </div>}
    </div>
  </div>
);
