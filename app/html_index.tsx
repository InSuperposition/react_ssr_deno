import React, {ReactNode} from 'react'

type HtmlIndex = {children: ReactNode; fileName?: string; id?: string}

// const defaultProps = {

// }

export default function HtmlIndex({
  children,
  fileName = 'browser',
  id = 'root'
}: HtmlIndex) {
  return (
    <>
      <html>
        <head>
          <script type="application/javascript" src={`${fileName}.js.map`} />
          <script type="module" src={`${fileName}.js`} />
        </head>
        <body>
          <div id={id}>{children}</div>
        </body>
      </html>
    </>
  )
}
