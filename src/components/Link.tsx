import React from 'react';

type LinkProps = {
  url: string;
  text: string;
};

export const Link: React.FC<LinkProps> = ({ url, text }) => (
  <a
    className="underline hover:text-brandDark/80"
    href={url}
    target="_blank"
  >
    {text}
  </a>
);
