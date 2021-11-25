let express = require('express')
let Note = require('../models/noteModel.js')

let routes = function() {
    let notesRouter = express.Router();

    notesRouter.route('/notes') //in de browser is dit dus /api/notes
        .post(function(req,res) {
            let note = new Note(req.body);

            note.save(function (err) {
                res.status(201).send(note)
            })
        })
        .get(function (req, res) {
            Note.find({}, function (err, notes) {
                if (err) {
                    res.status(500).send(err)
                }
                else{
                    res.json(notes)
                }
            })
        })
        return notesRouter
}

module.exports = routes;