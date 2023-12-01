# CMD Degree Guide
### Developed by Team Popsicle (Ethan Cha, Haley Figone, Peyton Elebash, Yaya Yao)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The full web app for CMD Degree Guide can be viewed [here](https://cmd-degree-guide.vercel.app/)

## Getting Started for Developing

You will need to provide your own MySQL database and data. The database will need to be structured with two tables with their schemas as shown:

![Database Diagram](/public/db_structure.png)

Provide the credentials to access the database as well as the API keys for the app to send database queries using environment variables. You can also choose to put the environment variables in a `.env.local` file, which needs to be filled like so:

```
MYSQL_HOST= your.mysql.host
MYSQL_PORT= 3306
MYSQL_DATABASE= your_db_name
MYSQL_USER= your_user_name
MYSQL_PASSWORD= your_password
NEXT_PUBLIC_API_KEY= my-api-key
PRIVATE_API_KEY= my-api-key
```

`NEXT_PUBLIC_API_KEY` and `PRIVATE_API_KEY` can be whatever you want, but they must be the same.

Install all dependencies using your preferred Node package manager:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then run the development environment
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
