import React, { ReactNode } from "react";

type HtmlIndex = { children: ReactNode; fileName?: string; id: string };

export function Html({ children, fileName, id }: HtmlIndex) {
  return (
    <html>
      <head>
        <script type="module" src={`${fileName}.js`} />
      </head>
      <body>
        <div id={id}>{children}</div>
      </body>
    </html>
  );
}
