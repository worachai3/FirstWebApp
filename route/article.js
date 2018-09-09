
// Get Single Article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

// Add Route
app.get('/articles/add/', function(req, res){
  res.render('add_article', {
    title: 'Add articles'
    });
});

// Add Submit POST Route
app.post('/articles/add/',
 [
  check('title').isLength({min:1}).trim().withMessage('Title required'),
  check('author').isLength({min:1}).trim().withMessage('Author required'),
  check('body').isLength({min:1}).trim().withMessage('Body required')
 ],
 (req, res, next)=>{

   let article = new Article({
     title:req.body.title,
     author:req.body.author,
     body:req.body.body
   });

  // Get Errors
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors);
    res.render('add_article', {
      article:article,
      errors:errors.mapped()
    });
  } else {
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;

      article.save(err=>{
        if(err){throw err;
        } else {
          req.flash('success', 'Article Added')
          console.log('test');
          res.redirect('/');
        }
      });
    }
  });

// Load Edit Form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
app.post('/articles/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated')
      res.redirect('/');
    }
  })
});

app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  })
});
