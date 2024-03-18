<div align="center">
  <h1>astro-db-starlight-showcase 🚧</h1>
  <p>A Starlight showcase page using Astro DB.</p>
</div>

> [!NOTE]  
> This repository is shared for demonstration purposes only, written in a limited amount of time, and is not intended to be used as a production-ready application.
>
> The goal is to demonstrate how one might use Astro DB in a Starlight application, handle form and image validation, and interface with other services such as GitHub and Cloudflare R2.

## Features

This repository contains a basic example of a showcase related set of custom pages in a Starlight application using Astro DB.

Users can login using their GitHub account and submit their own showcase entry which must include a name, a URL, and an image at specific dimensions.
Users with the `admin` permission can approve or reject entries.
Approved entries are displayed on the showcase page for everyone to see.

- GitHub authentication powered by [Lucia](https://lucia-auth.com/)
- Image hosted on [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)

## How to run

1. The application requires various environment variables to be set. Duplicate the `.env.example` file and rename it to `.env.development.local`. Then, fill in the required values (the example file contains links to the documentation for each service).
1. Install the dependencies using `pnpm install`.
1. Run the application using `pnpm dev`.

## License

Licensed under the MIT License, Copyright © HiDeoo.

See [LICENSE](https://github.com/HiDeoo/astro-db-starlight-showcase/blob/main/LICENSE) for more information.
