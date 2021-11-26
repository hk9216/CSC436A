var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/Todo');
const users = require('../models/User.js');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;



const privateKey = process.env.JWT_PRIVATEKEY

router.use(function(req, res, next) {
      console.log(req.header("Authorization"))
      if (req.header("Authorization")) {
          try {
              req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] })
              console.log(req.payload)
          } catch(error) {
              return res.status(401).json({"error": error.message});
          }
      } else {
          return res.status(401).json({"error": "Unauthorized"});
      }
      next()
  });
 
  router.get('/users/:id', async function(req, res) {
    console.log("Im kite")
    const TodoP= await Todo.find().where('author').equals(req.payload.id).exec()
    return res.status(200).json({"TodoP": TodoP})
    
  });
  
  router.get('/users', async function(req, res,next) {
    // const Todo = await Todo.find().where('author').equals(req.payload.id).exec()
  
    const usersA=await users.find().exec()
    
      return res.status(200).json({"TodosUsers": usersA})
  });

router.get('/items', async function(req, res, next) {
 // const Todo = await Todo.find().where('author').equals(req.payload.id).exec()

  const TodoA=await Todo.find({}).exec()
  
    return res.status(200).json({"Todos": TodoA})
    next()
});
router.get('/items/:id', async function(req, res, next) {
  console.log("Iam there" + req.payload.id)
  const TodoA = await Todo.find().where('author').equals(mongoose.Types.ObjectId(req.payload.id.trim())).exec()
 
   //const TodoAA=await TodoA.find().exec()
   
     return res.status(200).json({"Todos": TodoA})
     next()
 });
router.patch('/update/:id' , async function(req,res){

  const TodoA= await Todo.findOne().where('author').equals(mongoose.Types.ObjectId(req.payload.id.trim())).exec()
   if(req.body.DateCompleted){
     TodoA.DateCompleted=req.body.DateCompleted
   }
   if(req.body.complete){
     console.log(req.body.complete)
    TodoA.complete=req.body.complete
  }
   await TodoA.save()
   res.send(TodoA)
   //res.send(status(201).json({"result": TodoA} )
});

router.delete('/:id',  function(req,res)
{
  
      // Check ID and filter obj
     //const filter=({_id:ObjectId(json.stringify(req.params.id))})
      
  
  console.log(mongoose.Types.ObjectId(req.params.id.trim()))
  const TodoA= Todo.deleteOne().where('_id').equals(mongoose.Types.ObjectId(req.params.id.trim())).exec()

  return res.status(201).json({"result": TodoA} )
     /*
     await TodoA.delete().then(removeTodo => {
      return res.status(201).json({"result": TodoA} )
    }).catch( error => {
      return res.status(500).json({"error": error.message})
  });*/
     
});

router.post('/create', async function (req, res) {
    console.log('I m here')
  const todo = new Todo({
       "title": req.body.title,
    "description": req.body.description,
    "author": req.payload.id,
     "complete":false,
     "DateCompleted":'1/1/1900'
    })

    await todo.save().then( savedTodo => {
        return res.status(201).json({
            "id": savedTodo._id,
            "title": savedTodo.title,
            "description": savedTodo.description,
            "author": savedTodo.author,
            "complete":savedTodo.complete,
            "DateCompleted":savedTodo.DateCompleted
        })
    }).catch( error => {
        return res.status(500).json({"error": error.message})
    });
})

module.exports = router;
