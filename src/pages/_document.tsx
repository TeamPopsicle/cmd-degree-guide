/*
    i. a statement of what it represents or implements,
    ii. the group name,
    iii. the names of all authors (alphabetically by last name),
    iv. the product’s author information should be clear, i.e., what each
        component is or implements, who created or last updated it, and
        when.
*/

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
