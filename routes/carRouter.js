let express = require('express')
let Car = require('../models/carModel.js')

let routes = function() {
    let carRouter = express.Router();

    carRouter.route('/cars') //in de browser is dit dus /api/cars
        .post(function(req,res) {
            let car = new Car(req.body);

            car.save(function (err) {
                res.status(201).send(car)
            })
        })
        .get(function (req, res) {
            Car.find({}, function (err, cars) {
                if (err) {
                    res.status(500).send(err)
                }
                else{
                    res.json(cars)
                    console.log(req.params.id);
                }
            })
        })
        // carRouter.delete('/cars/delete/:id', getMember, function (req, res){
        //     //need an id for this, how?
        // })

        // async function getMember(req, res, next){
        //     let car
            
        //     try {
        //         car = await Car.findById(req.params.id)
        //     } catch (err) {
                
        //     }
        // }
}

module.exports = routes;