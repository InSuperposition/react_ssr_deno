import React, { ReactNode } from "react";

export declare interface HtmlIndex { children: ReactNode; fileName?: string; id?: string };

export function Html({ children, fileName, id = "app_root"}: HtmlIndex) {
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
