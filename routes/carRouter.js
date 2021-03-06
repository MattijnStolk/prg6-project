let express = require('express')
let Car = require('../models/carModel.js')

let routes = function() {
    let carRouter = express.Router();

    carRouter.use((req, res, next) => {
        if (req.headers.accept == "application/json"){
            next()
        } else {
            res.status(400).send()
        }
    })

    carRouter.route('/cars') //in de browser is dit dus /api/cars
        .options(async function(req,res){
            res.status(200)
            .header("Allow", "GET,POST,OPTIONS")
            .header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .send()
        })
        .post(async function(req,res) {
            let car = new Car({
                owner : req.body.owner,
                brand : req.body.brand,
                model : req.body.model,
                modifications : req.body.modifications
            });
            try{
                const newCar = await car.save();
                res.status(201)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                .json(newCar)
            }catch(err){
                res.status(400).json({message: err})
            }
        })
        .get(function (req, res) {
            Car.find({}, function (err, cars) {
                if (err) {
                    res.status(500).send(err)
                }
                else{
                    //begin pagination
                    let start;
                    let limit;

                    if (req.query.start && req.query.limit) {
                        start = parseInt(req.query.start);
                        limit = parseInt(req.query.limit);
                    }
                    else
                    {
                        start = 1;
                        limit = cars.length
                        console.log("No querystrings were given");
                    }

                    let totalItems = cars.length;
                    let totalPages = Math.ceil(cars.length / limit);
                    
                    let firstPage;
                    let lastPage;
                    let prevPage;
                    let nextPage;

                    let currentItems;
                    let currentPage;

                    if (totalPages == 1) {
                        firstPage = lastPage = prevPage = nextPage = currentPage = 1;
                        currentItems = cars.length;
                    }

                    else
                    {
                        currentPage = Math.ceil(start / limit);
                        if (currentPage == totalPages) { currentItems = totalItems - ((totalPages-1) * limit) } 
                            else { currentItems = limit }

                        firstPage = 1;
                        lastPage = (totalPages-1) * limit + 1;

                        if (currentPage == 1) { prevPage = 1 } 
                            else { prevPage = start - limit }

                        if (currentPage == totalPages) { nextPage = start }
                            else { nextPage = start + limit }
                        
                    }

                    let collection =
                        {
                        "items" : [],
                        "_links" : {
                            "self" : { "href" : `http://${req.headers.host}/api/cars` },
                            "collection" : { "href" : `http://${req.headers.host}/api/cars` }
                        },
                        "pagination" : {
                            "currentPage": currentPage,
                            "currentItems" : currentItems,
                            "totalPages" : totalPages,
                            "totalItems" : totalItems,
                            "_links" : {
                                "first" : {
                                    "page" : 1,
                                    "href" : `http://${req.headers.host}/api/cars?start=${firstPage}&limit=${limit}`
                                },
                                "last" : {
                                    "page" : 1,
                                    "href" : `http://${req.headers.host}/api/cars?start=${lastPage}&limit=${limit}`
                                },
                                "previous" : {
                                    "page" : 1,
                                    "href" : `http://${req.headers.host}/api/cars?start=${prevPage}&limit=${limit}`
                                },
                                "next" : {
                                    "page" : 1,
                                    "href" : `http://${req.headers.host}/api/cars?start=${nextPage}&limit=${limit}`
                                }
                            } 
                        }
                    }
                    let carsOnPage = [];
                    if (totalPages == 1) {
                        carsOnPage = cars
                    } 
                    else{
                        let startSlice = start - 1;
                        let endSlice = start + limit - 1;
                        carsOnPage = cars.slice(startSlice, endSlice)
                    }

                    for(let car of carsOnPage){
                        let carJson = car.toJSON()

                        carJson._links = {
                            "self" : { "href" : `http://${req.headers.host}/api/cars/${carJson._id}` },
                            "collection" : { "href" : `http://${req.headers.host}/api/cars` }
                        }
                        
                        collection.items.push(carJson)
                    }

                    res.status(200)
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                    .json(collection)
                }
            })
        })

        carRouter.route('/cars/:id') // in je browser is dit dus /api/cars/{id}
            .options(async function(req,res){
                res.status(200)
                .header("Allow", "GET,OPTIONS,DELETE,PUT")
                .header("Content-Type", "application/json")
                .header("Access-Control-Allow-Methods", "GET,OPTIONS,DELETE,PUT")
                .send()
            })
            .get(async function(req, res){
                try{
                    let car = await Car.findById(req.params.id)
                    let carJson = car.toJSON()

                    carJson._links = {
                        self : {href : `http://${req.headers.host}/api/cars/${req.params.id}`},
                        collection : {href : `http://${req.headers.host}/api/cars`}
                    }

                    res.status(200)
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                    .header("Content-Type", "application/json")
                    .json(carJson)
                }catch(err){
                    res.status(404).json({ message: err})
                }
                
            })
            .delete(getCar, async function(req, res){
                try {
                    await res.car.remove()
                    res.status(204).json({ message: 'car successfully deleted' })
                } catch (err) {
                    res.send(500).json({ message: err.message})
                }
            })
            .put(getCar, async function(req, res){
                if(req.body.owner != null){
                    res.car.owner = req.body.owner
                }
                if(req.body.model != null){
                    res.car.model = req.body.model
                }
                if(req.body.brand != null){
                    res.car.brand = req.body.brand
                }
                if(req.body.modifications != null){
                    res.car.modifications = req.body.modifications
                }
                try {
                    const updatedCar = await res.car.save()
                    res.status(202).json(updatedCar)
                    
                } catch (err) {
                    res.status(400).json({ message: err.message })
                }
            })

        async function getCar (req, res, next){
            let car
            try {
                    car = await Car.findById(req.params.id)
                    if(car == null){
                        return res.status(404).json({
                            message: "Car not found"
                        })
                    }        
            } catch (err) {
                return res.status(500).json({ message: err.message})
            }
            res.car = car
            next()
        }
        return carRouter
}

module.exports = routes;