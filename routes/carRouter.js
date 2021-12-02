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
        .post(function(req,res) {
            let car = new Car(req.body);
            car.save(function (err) {
                try {
                    res.status(201).send(car) 
                } catch (err) {
                    res.status(400).json({message: err.message })
                }

            })
        })
        .get(function (req, res) {
            Car.find({}, function (err, cars) {
                if (err) {
                    res.status(500).send(err)
                }
                else{
                    let items = []
                    for (let car of cars){
                        let item = car.toJSON();
                        // item = {
                        //     "_links" : {href : `http://${req.headers.host}/api/cars`,
                        //     "pagination": {
                        //     "temp": "pagination maken we later af"
                        //      }
                        //     }
                        // }
                        item._links = {
                            self : {href : `http://${req.headers.host}/api/cars`}
                        }
                        item.pagination = {
                            temp: "pagination maken we later af"
                        }
                        items.push(item)
                    }
                    res.json(items)
                }
            })
        })

        carRouter.route('/cars/:id')
            .get(async function(req, res){
                try{
                    let car = await Car.findById(req.params.id)
                    let carJson = car.toJSON()

                    carJson._links = {
                        self : {href : `http://${req.headers.host}/api/cars/${req.params.id}`}
                    }

                    res.json(carJson)
                }catch{
                    res.send(404).json({ message: err.message})
                }
                
            })
            .delete(getCar, async function(req, res){
                try {
                    await res.car.remove()
                    res.json({ message: 'user deleted' })
                } catch (err) {
                    res.send(500).json({ message: err.message})
                }
            })
            .patch(getCar, async function(req, res){
                if(req.body.owner != null){
                    res.car.owner = req.body.owner
                }
                if(req.body.car != null){
                    res.car.car = req.body.car
                }
                try {
                    const updatedCar = await res.car.save()
                    res.json(updatedCar)
            
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