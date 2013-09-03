# MILLETVEKILI PLACE HOLDER

This is a node.js app serving pictures of the members of the Turkish parliament, past and present.

It is still work in progress, however the basic functionality is already implemented. You can find a working instance of the project deployed on [heroku](http://mvph.herokuapp.com/).

## Installation and Configuration
Clone node-mvph from the GitHub [repository](https://github.com/artsince/node-mvph.git)
```sh
git clone https://github.com/artsince/node-mvph.git
```

All required external modules are alrady specified in package.json file. To install dependencies run:
```sh
npm install
```

node-mvph uses MongoDB for storing data. The connection parameters for the database are kept under the config folder. Depending on the ```process.env.NODE_ENV``` value, the config parameters are retrieved from the the corresponding ```config.(env).js``` file. If no parameter is set, development is assumed.```config.heroku.js``` file is used on heroku, and filled out on deployment.

## Testing
Hopefully automated tests will be added soon.

## Running And Usage
To run the program:
```sh
node app.js
```

The app will run on port 4242, and default index file can be reached on that port. Queries can be sent either from the browser with, for example, Developer Console on Chrome, or with curl.

## Reference
The image files are retrieved from the official website for [Türkiye Büyük Millet Meclisi](http://www.tbmm.gov.tr). Each profile image is located at ``http://www.tbmm.gov.tr/mv_resim/:id.jpg``. Once the image is retrieved, it is stored in the local mongodb database, so that the official website is not constantly harassed by your Hot or Not app. (I am such a good samaritan). There are currently 6972 registered MPs in the system. However, there are some missing images here and there. The app will return [a default image](https://github.com/artsince/node-mvph/blob/master/public/img/tbmm.jpg) if those missing images are specifically requested.

The following endpoints are defined so far:
* ```GET /random``` Returns a random jpeg image. Until all images are cached, this function may return the default image, so keep trying.

* ```GET /p/:id``` Returns the jpeg image for the MP with the id. This method would return ```400 (Bad Request)``` if the id exceeds the number of MPs in the system. Also the method would return the default image if the image is missing in the original source.

## Contribute
Use the source! Feel free to fork the project, report issues, and give feedback.