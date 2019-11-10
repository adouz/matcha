const Tags = require('../models/tagsmodel.js');


exports.list_all_tags = function(req, res) {
    Tags.getAllTags(function(err, tags) {
    if (err)
      return res.send(err);
      //console.log('res', tags);
      /*const test = [];
      tags.map(cur => test.push({"text" : cur.text}))*/
    res.send(tags);
  });
};

exports.list_user_tags = function(req, res) {
  Tags.getUserTags(req.params.userId,function(err, tags) {
  if (err)
    return res.send(err);
  
    //console.log('res', tags);
    /*const test = [];
    tags.map(cur => test.push({"text" : cur.text}))*/
  res.send(tags);
});
};

exports.create_a_tag = function(req, res) {
  var tags = req.body.newtags;
  var selectedtags = req.body.selectedtags;
  var user_id = req.body.user_id;
  
   /*if(!new_user.user_name)
      res.status(400).send({ error:true, message: 'Please provide User/status' });*/
  //   var errors = is_valid_user(new_user);
    //if (Object.keys(errors).length != 0)
     // res.json(errors);
    //else 
    for(tag in tags){
      Tags.createTag(tags[tag], function(err, ressql) {
        if (err)
        res.send(err);
       // res.json(res);
  });
  }
  /* ASSign TAGS TO USER*/
  for(tag in selectedtags)
  {
    Tags.AssignTag(selectedtags[tag],user_id, function(err, ressql) {
      if (err)
      res.send(err);
     // res.json(res);
});
}
};