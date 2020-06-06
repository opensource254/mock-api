# mock API
>TestAPI is  a fake online REST API for testing and prototyping.

## Endpoints

|Route                         |Method  | Description                               |
|:-----------------------------|:-------|:------------------------------------------|
| /users                       |  GET   |  Returns a collection of users            |
| /users/:id                   |  GET   |  Return user with the specified id        |
| /posts                       |  GET   |  Returns a collection of posts            |
| /posts/:id                   |  GET   |  Returns the post with the specified ID   |
| /products                    |  GET   |  Returns a collection of products         |
| /products/:sku               |  GET   |  Returns the products with the specified sku|

## Development 
1. Clone this repository `git clone https://github.com/opensource254/mock-api.git`
2. Navigate into the directory `cd mock-api/`
3. Install npm(recommended) dependencies `npm i` or with yarn `yarn`
3. Start the dev server with auto reload `npm run dev` or with yarn `yarn dev`
4. Your server is now running at `localhost:3006` the default port be free to change to your desired port.

## Production
1. Clone this repository `git clone https://github.com/opensource254/mock-api.git`
2. Navigate into the directory `cd mock-api/`
3. Install npm(recommended) dependencies `npm i` or with yarn `yarn`
4. npm start. 
Your app is now running on `localhost:3006` which is only accessible via LAN to enable WAN access(Not recommended), Edit
`bin/www` change the address from locahost to `0.0.0.0`.
Your API can now be accessed via `your-ip:3006`.

A better way is to use a reverse proxy with a web server of your choice. I'd recommend nginx.

## Contributing
We love contributions 🤩🤩
Most of the guidelines can be found [here](https://opensource254.github.io/guidelines/)
for the sake of clarity here is a few guidelines on how to contribute.
1. Fork this repository
2. Work on your feature
3. Create a pull request and let us discuss and review your awesome feature

